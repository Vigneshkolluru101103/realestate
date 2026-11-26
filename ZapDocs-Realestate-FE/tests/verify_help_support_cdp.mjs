import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = process.env.HELP_SUPPORT_URL || 'http://127.0.0.1:5174/broker/help';
const ARTIFACTS_DIR = path.resolve('tests', 'artifacts', 'help-support');
const PORT = 9226;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        } else if (!msg.id) {
          this.events.push(msg);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
    await sleep(400);
  }

  async screenshot(outputPath, fullPage = false) {
    const params = { format: 'png' };
    if (fullPage) {
      const metrics = await this.send('Page.getLayoutMetrics');
      params.captureBeyondViewport = true;
      params.clip = {
        x: 0,
        y: 0,
        width: metrics.cssContentSize.width,
        height: metrics.cssContentSize.height,
        scale: 1
      };
    }
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${outputPath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank'
  ]);

  try {
    await sleep(2000);
    const targets = await getJson(`http://127.0.0.1:${PORT}/json`);
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');

    console.log(`Navigating to ${APP_URL} ...`);
    await cdp.send('Page.navigate', { url: APP_URL });
    await sleep(2500);

    const pageState = await cdp.evaluate(`({
      url: location.href,
      title: document.title,
      readyState: document.readyState,
      bodyText: document.body?.innerText?.slice(0, 500) || ''
    })`);
    console.log('Page state:', pageState);

    // 1. Verify Contact Support is removed and callback form is present
    const checkRemoval = await cdp.evaluate(`(() => {
      return {
        hasContactSupport: document.body.innerText.includes('Contact Support'),
        hasInstantWhatsApp: document.body.innerText.includes('Instant WhatsApp Assistance'),
        hasHelplineStatus: document.body.innerText.includes('Telephone Helpline Status'),
        hasCallbackCard: Boolean(document.getElementById('card-request-callback')),
        hasNameInput: Boolean(document.getElementById('zd-callback-name')),
        hasPhoneInput: Boolean(document.getElementById('zd-callback-phone')),
        initialNameBlank: document.getElementById('zd-callback-name')?.value === '',
        initialPhoneBlank: document.getElementById('zd-callback-phone')?.value === '',
        hasCategoryDropdown: Boolean(document.getElementById('zd-callback-category')),
        hasIssueTextarea: Boolean(document.getElementById('zd-callback-issue')),
        hasSubmitBtn: Boolean(document.getElementById('btn-submit-callback')),
        hasNotice: document.body.innerText.includes('frontend prototype mode'),
        hasPageSearch: Boolean(document.querySelector('.zd-help-search-input')),
        hasComplianceNotice: document.body.innerText.includes('Help & Support Compliance Notice')
      };
    })()`);
    console.log('DOM Inspection:', checkRemoval);

    if (checkRemoval.hasContactSupport || checkRemoval.hasInstantWhatsApp || checkRemoval.hasHelplineStatus) {
      throw new Error(`Contact Support elements still detected: ${JSON.stringify(checkRemoval)}`);
    }
    if (!checkRemoval.hasCallbackCard || !checkRemoval.hasCategoryDropdown || !checkRemoval.hasIssueTextarea || !checkRemoval.hasPageSearch || !checkRemoval.hasComplianceNotice) {
      throw new Error(`Required callback elements missing: ${JSON.stringify(checkRemoval)}`);
    }
    if (!checkRemoval.initialNameBlank || !checkRemoval.initialPhoneBlank) {
      throw new Error(`Expected callback name and phone fields to be blank by default: ${JSON.stringify(checkRemoval)}`);
    }

    async function inspectLayout(label, expectedVideoColumns, expectedFormColumns, expectedCallbackColumns, expectedKnowledgeColumns) {
      const layout = await cdp.evaluate(`(() => {
        const columns = (selector) => getComputedStyle(document.querySelector(selector)).gridTemplateColumns.split(' ').filter(Boolean).length;
        const videoCards = Array.from(document.querySelectorAll('.zd-video-card'));
        return {
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          formColumns: columns('.zd-callback-grid-2col'),
          callbackColumns: columns('.zd-callback-card'),
          knowledgeColumns: columns('.zd-support-knowledge-grid'),
          videoColumns: columns('.zd-videos-grid'),
          videoCardWidths: videoCards.map((card) => Math.round(card.getBoundingClientRect().width)),
          unavailableCards: document.querySelectorAll('.zd-video-card--unavailable').length,
          comingSoonLabels: Array.from(document.querySelectorAll('.zd-video-placeholder-badge')).filter((node) => node.textContent.trim() === 'Coming Soon').length,
          videoActionControls: document.querySelectorAll('.zd-video-card button, .zd-video-card a').length,
          collapsedFaqHeights: Array.from(document.querySelectorAll('.zd-faq-answer-panel[aria-hidden="true"]')).map((panel) => Math.round(panel.getBoundingClientRect().height))
        };
      })()`);
      console.log(`${label} layout:`, layout);
      if (
        layout.horizontalOverflow ||
        layout.formColumns !== expectedFormColumns ||
        layout.callbackColumns !== expectedCallbackColumns ||
        layout.knowledgeColumns !== expectedKnowledgeColumns ||
        layout.videoColumns !== expectedVideoColumns
      ) {
        throw new Error(`${label} layout mismatch: ${JSON.stringify(layout)}`);
      }
      if (layout.unavailableCards !== 5 || layout.comingSoonLabels !== 5 || layout.videoActionControls !== 0 || new Set(layout.videoCardWidths).size !== 1) {
        throw new Error(`${label} video availability/alignment mismatch: ${JSON.stringify(layout)}`);
      }
      if (layout.collapsedFaqHeights.some((height) => height !== 0)) {
        throw new Error(`${label} collapsed FAQ content is still visible: ${JSON.stringify(layout)}`);
      }
    }

    // 2. Desktop Screenshot (1440x900)
    await cdp.setViewport(1440, 900);
    await inspectLayout('1440px desktop', 5, 2, 2, 2);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_desktop_1440.png'), true);

    // 3. Open Issue Category Dropdown
    console.log('Opening Category Dropdown...');
    await cdp.evaluate(`document.getElementById('zd-callback-category-trigger')?.click();`);
    await sleep(500);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_dropdown_open.png'));

    // 4. Select 'eStamp / eSign' category
    console.log('Selecting category eStamp / eSign...');
    await cdp.evaluate(`(() => {
      const options = Array.from(document.querySelectorAll('#zd-callback-category-listbox .zd-glass-select-option'));
      const opt = options.find(o => o.textContent.includes('eStamp / eSign'));
      if (opt) opt.click();
    })()`);
    await sleep(500);

    // 5. Test validation error by entering short issue and submitting
    console.log('Testing validation error feedback...');
    await cdp.evaluate(`(() => {
      const name = document.getElementById('zd-callback-name');
      const phone = document.getElementById('zd-callback-phone');
      const issue = document.getElementById('zd-callback-issue');
      const inputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const textSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      inputSetter.call(name, 'Ramesh Kumar');
      name.dispatchEvent(new Event('input', { bubbles: true }));
      inputSetter.call(phone, '9876500001');
      phone.dispatchEvent(new Event('input', { bubbles: true }));
      textSetter.call(issue, 'Short');
      issue.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-submit-callback')?.click();
    })()`);
    await sleep(500);

    const validationState = await cdp.evaluate(`(() => {
      return {
        issueErr: document.getElementById('err-callback-issue')?.textContent
      };
    })()`);
    console.log('Validation error state:', validationState);
    if (!validationState.issueErr || !validationState.issueErr.includes('at least 10 characters')) {
      throw new Error(`Expected at least 10 characters error, got: ${JSON.stringify(validationState)}`);
    }

    // 6. Enter valid issue description and submit
    console.log('Submitting valid callback request...');
    await cdp.evaluate(`(() => {
      const issue = document.getElementById('zd-callback-issue');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(issue, 'Need assistance with NeSL eStamp duty calculation for 11M rental agreement');
      issue.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-submit-callback')?.click();
    })()`);
    await sleep(1000);

    const submitResult = await cdp.evaluate(`(() => {
      return {
        hasSuccessBanner: Boolean(document.getElementById('callback-success-banner')),
        bannerText: document.getElementById('callback-success-banner')?.innerText,
        nameVal: document.getElementById('zd-callback-name')?.value,
        phoneVal: document.getElementById('zd-callback-phone')?.value,
        categoryVal: document.getElementById('zd-callback-category')?.value,
        issueVal: document.getElementById('zd-callback-issue')?.value
      };
    })()`);
    console.log('Submission result:', submitResult);

    if (!submitResult.hasSuccessBanner || !submitResult.bannerText.includes('eStamp / eSign')) {
      throw new Error(`Success banner missing or invalid: ${JSON.stringify(submitResult)}`);
    }
    if (submitResult.issueVal !== '') {
      throw new Error('Issue description was not reset after submission');
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_submission_success.png'));

    // 7. Accordion and FAQ interactions
    const interactions = await cdp.evaluate(`(async () => {
      const wait = () => new Promise((resolve) => setTimeout(resolve, 25));
      const troubleButtons = Array.from(document.querySelectorAll('.zd-trouble-header-btn'));
      let everyTroubleToggleWorked = true;
      for (const button of troubleButtons) {
        button.click();
        await wait();
        everyTroubleToggleWorked &&= button.getAttribute('aria-expanded') === 'true';
        button.click();
        await wait();
        everyTroubleToggleWorked &&= button.getAttribute('aria-expanded') === 'false';
      }

      const faqIds = Array.from(document.querySelectorAll('.zd-faq-question-btn')).map((button) => button.id);
      for (const id of faqIds) {
        const button = document.getElementById(id);
        if (button.getAttribute('aria-expanded') === 'true') {
          button.click();
          await wait();
        }
      }
      let everyFaqToggleWorked = true;
      for (const id of faqIds) {
        const button = document.getElementById(id);
        button.click();
        await wait();
        everyFaqToggleWorked &&= button.getAttribute('aria-expanded') === 'true';
        button.click();
        await wait();
        everyFaqToggleWorked &&= button.getAttribute('aria-expanded') === 'false';
      }

      const search = document.querySelector('.zd-faq-search-input');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      const pageSearch = document.querySelector('.zd-help-search-input');
      setter.call(pageSearch, 'download');
      pageSearch.dispatchEvent(new Event('input', { bubbles: true }));
      await wait();
      const globalTroubleCount = document.querySelectorAll('.zd-trouble-card').length;
      const globalFaqCount = document.querySelectorAll('.zd-faq-item').length;
      setter.call(pageSearch, '');
      pageSearch.dispatchEvent(new Event('input', { bubbles: true }));
      await wait();

      setter.call(search, 'quota');
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await wait();
      const filteredCount = document.querySelectorAll('.zd-faq-item').length;
      document.querySelector('.zd-faq-toggle-all-btn')?.click();
      await wait();
      const allVisibleExpanded = Array.from(document.querySelectorAll('.zd-faq-question-btn')).every((button) => button.getAttribute('aria-expanded') === 'true');
      return {
        troubleCount: troubleButtons.length,
        everyTroubleToggleWorked,
        faqCount: faqIds.length,
        everyFaqToggleWorked,
        globalTroubleCount,
        globalFaqCount,
        filteredCount,
        allVisibleExpanded
      };
    })()`);
    console.log('Accordion and FAQ interactions:', interactions);
    if (
      interactions.troubleCount !== 5 ||
      !interactions.everyTroubleToggleWorked ||
      interactions.faqCount !== 10 ||
      !interactions.everyFaqToggleWorked ||
      interactions.globalTroubleCount < 1 ||
      interactions.globalTroubleCount >= 5 ||
      interactions.globalFaqCount < 1 ||
      interactions.globalFaqCount >= 10 ||
      interactions.filteredCount < 1 ||
      !interactions.allVisibleExpanded
    ) {
      throw new Error(`Accordion/FAQ interaction failed: ${JSON.stringify(interactions)}`);
    }

    await cdp.evaluate(`(() => {
      document.querySelector('.zd-callback-success-dismiss')?.click();
      const faqSearch = document.querySelector('.zd-faq-search-input');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(faqSearch, '');
      faqSearch.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelectorAll('.zd-faq-question-btn[aria-expanded="true"]').forEach((button) => button.click());
      document.querySelectorAll('.zd-trouble-header-btn[aria-expanded="true"]').forEach((button) => button.click());
      window.scrollTo(0, 0);
    })()`);
    await sleep(3700);

    // 8. Test Responsive Viewports
    await cdp.setViewport(1920, 1080);
    await inspectLayout('1920px desktop', 5, 2, 2, 2);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_desktop_1920.png'), true);

    // Laptop (1366x768)
    await cdp.setViewport(1366, 768);
    await inspectLayout('1366px laptop', 5, 2, 2, 2);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_laptop_1366.png'), true);

    // Tablet landscape / compact desktop (1024x768)
    await cdp.setViewport(1024, 768);
    await inspectLayout('1024px tablet landscape', 4, 2, 2, 2);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_tablet_1024.png'), true);

    // Tablet (768x1024)
    await cdp.setViewport(768, 1024);
    await inspectLayout('768px tablet', 2, 2, 1, 1);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_tablet_768.png'), true);

    // Mobile (430x932 and 390x844)
    await cdp.setViewport(430, 932);
    await inspectLayout('430px mobile', 1, 1, 1, 1);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_mobile_430.png'), true);

    await cdp.setViewport(390, 844);
    await inspectLayout('390px mobile', 1, 1, 1, 1);
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'help_support_mobile_390.png'), true);

    const browserErrors = cdp.events.filter((event) =>
      event.method === 'Runtime.exceptionThrown' ||
      (event.method === 'Runtime.consoleAPICalled' && event.params?.type === 'error') ||
      (event.method === 'Log.entryAdded' && event.params?.entry?.level === 'error')
    );
    if (browserErrors.length > 0) {
      throw new Error(`Browser console/runtime errors detected: ${JSON.stringify(browserErrors)}`);
    }
    console.log('Browser console/runtime errors: 0');

    console.log('ALL HELP & SUPPORT BROWSER VERIFICATIONS COMPLETED SUCCESSFULLY!');
    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('CDP verification error:', err);
  process.exit(1);
});

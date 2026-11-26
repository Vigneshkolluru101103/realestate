import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\vigne\\.gemini\\antigravity\\brain\\47f6591d-c9b6-437f-993e-365617432091';
const PORT = 9225;

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

  async screenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${outputPath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
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

    console.log('Navigating to http://localhost:5173/broker/dashboard ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/broker/dashboard' });
    await sleep(2500);

    // 1. Verify fresh initial agreement form
    console.log('--- Step 1: Open + Generate Rental Agreement ---');
    await cdp.evaluate(`document.getElementById('btn-gen-rental-sub')?.click();`);
    await sleep(800);
    // Click Enter Manually
    await cdp.evaluate(`document.getElementById('choose-manual-agreement')?.click();`);
    await sleep(800);

    const step1Data = await cdp.evaluate(`(() => {
      return {
        title: document.getElementById('gen-agreement-title')?.value,
        ref: document.getElementById('gen-reference-number')?.value,
        client: document.getElementById('gen-client-select')?.value,
        landlord: document.getElementById('gen-landlord-name')?.value,
        tenant: document.getElementById('gen-tenant-name')?.value,
        address: document.getElementById('gen-property-address')?.value,
        rent: document.getElementById('gen-rent-amount')?.value,
        deposit: document.getElementById('gen-deposit-amount')?.value,
        term: document.getElementById('gen-lease-term')?.value,
        jurisdiction: document.getElementById('gen-stamp-state')?.value
      };
    })()`);

    console.log('Step 1 Form State:', step1Data);
    if (
      step1Data.landlord !== '' ||
      step1Data.tenant !== '' ||
      step1Data.address !== '' ||
      step1Data.rent !== '' ||
      step1Data.deposit !== '' ||
      step1Data.client !== ''
    ) {
      throw new Error(`Step 1 failed: Expected blank party & financial fields, got: ${JSON.stringify(step1Data)}`);
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'form_case_1_fresh_blank_new_agreement.png'));

    // 2. Select Suresh Reddy (Landlord) from Vault
    console.log('--- Step 2: Select Landlord (Suresh Reddy) from Vault ---');
    await cdp.evaluate(`(() => {
      // Open GlassSelect
      const trigger = document.getElementById('gen-client-select-trigger');
      trigger.click();
    })()`);
    await sleep(500);

    await cdp.evaluate(`(() => {
      const options = Array.from(document.querySelectorAll('#gen-client-select-listbox .zd-glass-select-option'));
      const sureshOpt = options.find(o => o.textContent.includes('Suresh Reddy'));
      if (sureshOpt) sureshOpt.click();
    })()`);
    await sleep(600);

    const step2Data = await cdp.evaluate(`(() => {
      return {
        client: document.getElementById('gen-client-select')?.value,
        landlord: document.getElementById('gen-landlord-name')?.value,
        tenant: document.getElementById('gen-tenant-name')?.value,
        address: document.getElementById('gen-property-address')?.value,
        rent: document.getElementById('gen-rent-amount')?.value,
        deposit: document.getElementById('gen-deposit-amount')?.value
      };
    })()`);
    console.log('Step 2 Form State (After Landlord Select):', step2Data);
    if (
      step2Data.client !== 'Suresh Reddy' ||
      step2Data.landlord !== 'Suresh Reddy' ||
      step2Data.tenant !== '' ||
      !step2Data.address.includes('Brigade Gateway') ||
      step2Data.rent !== '' ||
      step2Data.deposit !== ''
    ) {
      throw new Error(`Step 2 failed: Unexpected values after landlord select: ${JSON.stringify(step2Data)}`);
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'form_case_2_selected_landlord.png'));

    // 3. Switch to Pooja Hegde (Tenant)
    console.log('--- Step 3: Switch Client to Tenant (Pooja Hegde) ---');
    await cdp.evaluate(`document.getElementById('gen-client-select-trigger')?.click();`);
    await sleep(500);
    await cdp.evaluate(`(() => {
      const options = Array.from(document.querySelectorAll('#gen-client-select-listbox .zd-glass-select-option'));
      const poojaOpt = options.find(o => o.textContent.includes('Pooja Hegde'));
      if (poojaOpt) poojaOpt.click();
    })()`);
    await sleep(600);

    const step3Data = await cdp.evaluate(`(() => {
      return {
        client: document.getElementById('gen-client-select')?.value,
        landlord: document.getElementById('gen-landlord-name')?.value,
        tenant: document.getElementById('gen-tenant-name')?.value,
        address: document.getElementById('gen-property-address')?.value,
        rent: document.getElementById('gen-rent-amount')?.value,
        deposit: document.getElementById('gen-deposit-amount')?.value
      };
    })()`);
    console.log('Step 3 Form State (After switching to Tenant):', step3Data);
    if (
      step3Data.client !== 'Pooja Hegde' ||
      step3Data.landlord !== '' || // Landlord must be wiped!
      step3Data.tenant !== 'Pooja Hegde' ||
      !step3Data.address.includes('Prestige Falcon City') ||
      step3Data.rent !== '' ||
      step3Data.deposit !== ''
    ) {
      throw new Error(`Step 3 failed: Stale landlord remained or tenant not set: ${JSON.stringify(step3Data)}`);
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'form_case_3_switched_to_tenant.png'));

    // 4. Clear client selection
    console.log('--- Step 4: Clear Client Selection ---');
    await cdp.evaluate(`document.getElementById('gen-client-select-trigger')?.click();`);
    await sleep(500);
    await cdp.evaluate(`(() => {
      const options = Array.from(document.querySelectorAll('#gen-client-select-listbox .zd-glass-select-option'));
      const clearOpt = options.find(o => o.textContent.includes('Select Existing'));
      if (clearOpt) clearOpt.click();
    })()`);
    await sleep(600);

    const step4Data = await cdp.evaluate(`(() => {
      return {
        client: document.getElementById('gen-client-select')?.value,
        landlord: document.getElementById('gen-landlord-name')?.value,
        tenant: document.getElementById('gen-tenant-name')?.value,
        address: document.getElementById('gen-property-address')?.value
      };
    })()`);
    console.log('Step 4 Form State (After clearing client):', step4Data);
    if (
      step4Data.client !== '' ||
      step4Data.landlord !== '' ||
      step4Data.tenant !== '' ||
      step4Data.address !== ''
    ) {
      throw new Error(`Step 4 failed: Client fields not cleared cleanly: ${JSON.stringify(step4Data)}`);
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'form_case_4_cleared_client.png'));

    // 5. Fill fields, close modal via Cancel, reopen -> Starts completely fresh
    console.log('--- Step 5: Fill custom fields, close modal, and reopen ---');
    await cdp.evaluate(`(() => {
      const landlord = document.getElementById('gen-landlord-name');
      const rent = document.getElementById('gen-rent-amount');
      landlord.value = 'Temporary Owner Test';
      landlord.dispatchEvent(new Event('input', { bubbles: true }));
      rent.value = '88888';
      rent.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await sleep(500);

    // Click Cancel button
    await cdp.evaluate(`(() => {
      const cancelBtn = Array.from(document.querySelectorAll('.zd-gen-btn--outline')).find(b => b.textContent.includes('Cancel'));
      if (cancelBtn) cancelBtn.click();
    })()`);
    await sleep(800);

    // Reopen modal via + Generate Rental Agreement
    await cdp.evaluate(`document.getElementById('btn-gen-rental-sub')?.click();`);
    await sleep(800);
    await cdp.evaluate(`document.getElementById('choose-manual-agreement')?.click();`);
    await sleep(800);

    const step5Data = await cdp.evaluate(`(() => {
      return {
        landlord: document.getElementById('gen-landlord-name')?.value,
        rent: document.getElementById('gen-rent-amount')?.value,
        draftBanner: Boolean(document.querySelector('.draft-recovery-banner'))
      };
    })()`);
    console.log('Step 5 Form State (After reopen):', step5Data);
    if (
      step5Data.landlord !== '' ||
      step5Data.rent !== '' ||
      step5Data.draftBanner !== false
    ) {
      throw new Error(`Step 5 failed: Stale data or draft banner persisted after cancel: ${JSON.stringify(step5Data)}`);
    }
    await cdp.screenshot(path.join(ARTIFACTS_DIR, 'form_case_5_fresh_after_cancel.png'));

    console.log('ALL BROWSER E2E SCENARIOS VERIFIED SUCCESSFULLY!');
    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

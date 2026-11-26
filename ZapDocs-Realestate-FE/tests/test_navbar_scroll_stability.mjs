import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:5174';
const PORT = 9232;

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

class CDP {
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

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }
}

const ROUTES = [
  { name: 'Dashboard', path: '/broker/dashboard' },
  { name: 'Agreements', path: '/broker/agreements' },
  { name: 'Clients', path: '/broker/clients' },
  { name: 'Billing', path: '/broker/billing' },
  { name: 'Help', path: '/broker/help' },
  { name: 'Refer', path: '/broker/refer' },
  { name: 'Bank & UPI', path: '/broker/bank-upi' }
];

const VIEWPORTS = [
  { name: 'Mobile 390px', w: 390, h: 844, mobile: true },
  { name: 'Tablet 768px', w: 768, h: 1024, mobile: false },
  { name: 'Laptop 1440px', w: 1440, h: 900, mobile: false },
  { name: 'Desktop 1920px', w: 1920, h: 1080, mobile: false }
];

async function main() {
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1920,1080',
    'about:blank'
  ]);

  try {
    await sleep(2000);
    const targets = await getJson(`http://127.0.0.1:${PORT}/json`);
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const cdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    let allPass = true;

    for (const route of ROUTES) {
      console.log(`\nTesting Route: ${route.name} (${route.path})`);
      await cdp.send('Page.navigate', { url: `${BASE_URL}${route.path}` });
      await sleep(1500);

      for (const vp of VIEWPORTS) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.w,
          height: vp.h,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });
        await sleep(300);

        // Check at top
        await cdp.eval('window.scrollTo(0, 0);');
        await sleep(200);

        const topCheck = await cdp.eval(`(() => {
          const header = document.querySelector('.zd-header');
          if (!header) return { found: false };
          const rect = header.getBoundingClientRect();
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            found: true,
            top: rect.top,
            width: rect.width,
            clientWidth,
            scrollWidth,
            overflow: scrollWidth > clientWidth + 1
          };
        })()`);

        // Check when scrolled down completely
        await cdp.eval('window.scrollTo(0, 99999);');
        await sleep(300);

        const scrolledCheck = await cdp.eval(`(() => {
          const header = document.querySelector('.zd-header');
          if (!header) return { found: false };
          const rect = header.getBoundingClientRect();
          const scrollY = window.scrollY;
          return {
            found: true,
            top: rect.top,
            scrollY
          };
        })()`);

        const topPassed = topCheck.found && topCheck.top === 0 && !topCheck.overflow;
        const scrolledPassed = scrolledCheck.found && scrolledCheck.top === 0;

        if (topPassed && scrolledPassed) {
          console.log(`  ✅ [${vp.name}]: Pinned flush (top=0px, scrollY=${scrolledCheck.scrollY}px, overflow=${topCheck.overflow})`);
        } else {
          console.error(`  ❌ [${vp.name}]: FAILED! topCheck:`, topCheck, 'scrolledCheck:', scrolledCheck);
          allPass = false;
        }
      }
    }

    if (!allPass) {
      console.error('\n❌ SOME CHECKS FAILED!');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL ROUTES & VIEWPORTS PASSED NAVBAR STABILITY AUDIT!');
    }

    cdp.ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);

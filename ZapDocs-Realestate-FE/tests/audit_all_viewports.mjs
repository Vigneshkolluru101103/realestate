import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:5174';
const PORT = 9227;

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
    await sleep(250);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 600 },
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'laptop-1440', width: 1440, height: 900 },
  { name: 'desktop-1600', width: 1600, height: 1000 },
  { name: 'desktop-1920', width: 1920, height: 1080 }
];

const ROUTES = [
  { name: 'Dashboard', path: '/broker/dashboard' },
  { name: 'My Agreements', path: '/broker/agreements' },
  { name: 'Clients Vault', path: '/broker/clients' },
  { name: 'Refer & Earn', path: '/broker/refer' },
  { name: 'Help & Support', path: '/broker/help' },
  { name: 'Bank & UPI', path: '/broker/bank-upi' },
  { name: 'Plan & Billing', path: '/broker/billing' }
];

async function runAudit() {
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

    const results = [];

    for (const route of ROUTES) {
      console.log(`\n========================================\nAuditing route: ${route.name} (${route.path})\n========================================`);
      await cdp.send('Page.navigate', { url: `${BASE_URL}${route.path}` });
      await sleep(1500);

      for (const vp of VIEWPORTS) {
        await cdp.setViewport(vp.width, vp.height);

        const check = await cdp.evaluate(`(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const hasOverflow = scrollWidth > clientWidth + 1;

          // Find culprit elements causing horizontal overflow
          const culprits = [];
          if (hasOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 1) {
                // Ignore fixed backdrop/drawers that are closed
                if (el.classList.contains('zd-drawer') || el.classList.contains('zd-drawer-portal')) continue;
                const tag = el.tagName.toLowerCase();
                const cls = el.className ? (typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') : '';
                const id = el.id ? '#' + el.id : '';
                culprits.push({
                  selector: tag + id + cls,
                  width: Math.round(rect.width),
                  right: Math.round(rect.right),
                  excess: Math.round(rect.right - clientWidth)
                });
              }
            }
          }

          // Top 5 worst culprits sorted by excess
          culprits.sort((a, b) => b.excess - a.excess);
          const topCulprits = culprits.slice(0, 5);

          return {
            scrollWidth,
            clientWidth,
            hasOverflow,
            topCulprits
          };
        })()`);

        if (check.hasOverflow) {
          console.warn(`❌ [${route.name}] [${vp.name} (${vp.width}px)]: OVERFLOW DETECTED! scrollWidth=${check.scrollWidth} > clientWidth=${check.clientWidth}`);
          for (const c of check.topCulprits) {
            console.warn(`   Culprit: ${c.selector} (width=${c.width}px, right=${c.right}px, excess=+${c.excess}px)`);
          }
          results.push({
            route: route.name,
            path: route.path,
            viewport: vp.name,
            width: vp.width,
            ...check
          });
        } else {
          console.log(`✅ [${route.name}] [${vp.name} (${vp.width}px)]: OK (scrollWidth=${check.scrollWidth}, clientWidth=${check.clientWidth})`);
        }
      }
    }

    console.log(`\n========================================\nAuditing Modals across Viewports\n========================================`);
    // Navigate to dashboard to test modals
    await cdp.send('Page.navigate', { url: `${BASE_URL}/broker/dashboard` });
    await sleep(1500);

    const MODAL_TRIGGERS = [
      { name: 'Agreement Creation Modal', open: `window.__zdOpenModal('generate-agreement')` },
      { name: 'Add Client Modal', open: `window.__zdOpenModal('add-client')` },
      { name: 'Edit Client Modal', open: `window.__zdOpenModal('edit-client', { id: 'CL-101', name: 'Suresh Reddy', role: 'Landlord', phone: '9876543210', aadhaar: '•••• •••• 9921', address: 'Indiranagar' })` },
      { name: 'Agreement Details Modal', open: `window.__zdOpenModal('agreement-details', { id: 'AGR-1001', type: 'Residential 11M', status: 'Pending e-Sign', tenantName: 'Siddharth Rao', ownerName: 'Sunita Mehra', rent: 42000, deposit: 200000, propertyArea: 'Indiranagar' })` },
      { name: 'Draft PDF Warning Modal', open: `window.__zdOpenModal('draft-pdf-warning', { id: 'AGR-1002', type: 'Commercial Lease', status: 'Pending e-Sign' })` },
      { name: 'GST Invoice Viewer Modal', open: `window.__zdOpenModal('gst-invoice-viewer', 'INV-2026-8812')` },
      { name: 'Razorpay Checkout Modal', open: `window.__zdOpenModal('razorpay-checkout', { planName: 'Growth Plan', amount: 1499, docCredits: 25 })` },
      { name: 'Renewal Review Modal', open: `window.__zdOpenModal('renewal-review', { id: 'ZD-8991', tenantName: 'Vikram Joshi', rent: 38000, deposit: 190000, propertyArea: 'HSR Layout' })` },
      { name: 'Auto Renew Confirm Modal', open: `window.__zdOpenModal('auto-renew-confirm')` },
      { name: 'Refer & Earn Modal', open: `window.__zdOpenModal('refer-earn')` },
      { name: 'Video Player Modal', open: `window.__zdOpenModal('video-player', 'How to create an agreement')` }
    ];

    for (const modal of MODAL_TRIGGERS) {
      console.log(`\nTesting modal: ${modal.name}`);
      for (const vp of [VIEWPORTS[0], VIEWPORTS[1], VIEWPORTS[2], VIEWPORTS[3], VIEWPORTS[4], VIEWPORTS[6], VIEWPORTS[9], VIEWPORTS[11]]) {
        await cdp.setViewport(vp.width, vp.height);
        await cdp.evaluate(modal.open);
        await sleep(500);

        const check = await cdp.evaluate(`(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const hasOverflow = scrollWidth > clientWidth + 1;
          const modalBox = document.querySelector('.modal-card, .zd-gen-modal-card, .zd-details-modal-card, .zd-draft-modal-card, .zd-glass-modal, [role="dialog"]');
          const modalRect = modalBox ? modalBox.getBoundingClientRect() : null;

          return {
            scrollWidth,
            clientWidth,
            hasOverflow,
            modalFound: Boolean(modalBox),
            modalWidth: modalRect ? Math.round(modalRect.width) : 0,
            modalExceeds: modalRect ? modalRect.right > clientWidth + 1 : false
          };
        })()`);

        if (check.hasOverflow || check.modalExceeds) {
          console.warn(`❌ [Modal: ${modal.name}] [${vp.name} (${vp.width}px)]: OVERFLOW/EXCEEDS! clientWidth=${check.clientWidth}, modalWidth=${check.modalWidth}`);
          results.push({
            route: `Modal: ${modal.name}`,
            viewport: vp.name,
            width: vp.width,
            ...check
          });
        } else {
          console.log(`✅ [Modal: ${modal.name}] [${vp.name} (${vp.width}px)]: OK (modalWidth=${check.modalWidth}px <= ${check.clientWidth}px)`);
        }

        // Close modal
        await cdp.evaluate(`window.__zdCloseModal ? window.__zdCloseModal() : (document.querySelector('.modal-close, .zd-modal-close, [aria-label="Close"], button.close')?.click())`);
        await sleep(300);
      }
    }

    console.log(`\n========================================\nAUDIT COMPLETE: ${results.length} responsive issues found.\n========================================`);
    fs.writeFileSync('tests/audit_results.json', JSON.stringify(results, null, 2));

    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

runAudit().catch(console.error);

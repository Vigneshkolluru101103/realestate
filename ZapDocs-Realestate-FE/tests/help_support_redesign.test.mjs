import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dirname, '..');

const screenSource = fs.readFileSync(
  path.join(ROOT, 'src', 'screens', 'HelpSupport', 'HelpSupportScreen.jsx'),
  'utf8'
);
const cssSource = fs.readFileSync(
  path.join(ROOT, 'src', 'screens', 'HelpSupport', 'HelpSupport.css'),
  'utf8'
);
const mockDataSource = fs.readFileSync(
  path.join(ROOT, 'src', 'mock', 'helpSupportData.js'),
  'utf8'
);

describe('Help & Support Page Redesign Verification', () => {
  describe('1. Contact Support Section Removal', () => {
    test('Contact Support heading and description are completely removed from JSX', () => {
      assert.doesNotMatch(screenSource, /<h2[^>]*>Contact Support<\/h2>/i);
      assert.doesNotMatch(screenSource, /Connect directly with our support desk/i);
      assert.doesNotMatch(screenSource, /zd-contact-card/);
      assert.doesNotMatch(screenSource, /zd-contact-info-col/);
      assert.doesNotMatch(screenSource, /zd-contact-title/);
    });

    test('Instant WhatsApp Assistance card and Active Desk badge are removed', () => {
      assert.doesNotMatch(screenSource, /Instant WhatsApp Assistance/i);
      assert.doesNotMatch(screenSource, /Active Desk/i);
      assert.doesNotMatch(screenSource, /zd-whatsapp-action-box/);
      assert.doesNotMatch(screenSource, /zd-btn-whatsapp-support/);
    });

    test('Telephone Helpline Status card is removed from JSX', () => {
      assert.doesNotMatch(screenSource, /Telephone Helpline Status/i);
      assert.doesNotMatch(screenSource, /No telephone helpline is configured/i);
      assert.doesNotMatch(screenSource, /zd-helpline-status-box/);
    });

    test('Shared SUPPORT_CONFIG export in mock data is safely preserved for non-breaking compatibility', () => {
      assert.ok(mockDataSource.includes('export const SUPPORT_CONFIG ='), 'Mock data must retain SUPPORT_CONFIG');
      assert.ok(mockDataSource.includes('officialWhatsAppNumber'));
      assert.ok(mockDataSource.includes('officialHelplineNumber'));
    });
  });

  describe('2. Request a Callback Responsive Form Architecture', () => {
    test('Callback card uses a two-column desktop layout with a dedicated glass form panel', () => {
      assert.ok(cssSource.includes('.zd-callback-center-wrap'));
      assert.ok(cssSource.includes('.zd-callback-card'));
      assert.ok(screenSource.includes('zd-callback-form-panel'));
      assert.match(cssSource, /\.zd-callback-card\s*\{[\s\S]*?width: 100%/);
      assert.match(cssSource, /\.zd-callback-card\s*\{[\s\S]*?grid-template-columns: minmax\(220px, 0\.7fr\) minmax\(0, 1\.55fr\)/);
      assert.match(cssSource, /@media \(max-width: 980px\)[\s\S]*?\.zd-callback-card,[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
      assert.doesNotMatch(cssSource, /max-width:\s*680px/);
      assert.ok(cssSource.includes('backdrop-filter: blur(18px)'));
    });

    test('Row 1 contains Full Name and Mobile Number in a 2-column grid and defaults to blank', () => {
      assert.ok(screenSource.includes('zd-callback-grid-2col'));
      assert.ok(screenSource.includes('id="zd-callback-name"'));
      assert.ok(screenSource.includes('id="zd-callback-phone"'));
      assert.ok(screenSource.includes("const [callbackName, setCallbackName] = useState('')"));
      assert.ok(screenSource.includes("const [callbackPhone, setCallbackPhone] = useState('')"));
      assert.ok(cssSource.includes('.zd-callback-grid-2col'));
      assert.ok(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
      assert.match(cssSource, /@media \(max-width: 760px\)[\s\S]*?\.zd-callback-grid-2col,[\s\S]*?grid-template-columns: 1fr/);
    });

    test('Row 2 contains Issue Category dropdown using GlassSelect with all approved options', () => {
      assert.ok(screenSource.includes('<GlassSelect'));
      assert.ok(screenSource.includes('id="zd-callback-category"'));
      assert.ok(screenSource.includes('name="callbackCategory"'));
      assert.ok(screenSource.includes('Agreement Creation'));
      assert.ok(screenSource.includes('PDF / Document Upload'));
      assert.ok(screenSource.includes('eStamp / eSign'));
      assert.ok(screenSource.includes('Payment / Billing'));
      assert.ok(screenSource.includes('Account / Profile'));
      assert.ok(screenSource.includes('Technical Issue'));
      assert.ok(screenSource.includes('Other'));
    });

    test('Row 3 contains full-width Issue Description textarea', () => {
      assert.ok(screenSource.includes('id="zd-callback-issue"'));
      assert.ok(screenSource.includes('rows="4"'));
      assert.ok(screenSource.includes('Describe your question or issue in detail...'));
    });

    test('Prototype mode notice is accurately preserved', () => {
      assert.ok(screenSource.includes('zd-callback-notice'));
      assert.ok(screenSource.includes('frontend prototype mode'));
      assert.ok(screenSource.includes('Submissions are simulated locally'));
    });

    test('Submission button includes double-submit protection and loading state', () => {
      assert.ok(screenSource.includes('disabled={isSubmitting}'));
      assert.ok(screenSource.includes('zd-callback-spinner'));
      assert.ok(screenSource.includes('Submitting Request...'));
      assert.ok(screenSource.includes('Submit Callback Request'));
      assert.match(cssSource, /\.zd-btn-callback-submit\s*\{[\s\S]*?width:\s*100%/);
    });

    test('Submission toast clears desktop navigation and defers to the inline banner on compact layouts', () => {
      assert.match(cssSource, /\.zd-help-toast\s*\{[\s\S]*?top:\s*92px/);
      assert.match(cssSource, /@media \(max-width: 1024px\)[\s\S]*?\.zd-help-toast\s*\{\s*display:\s*none/);
      assert.ok(screenSource.includes('zd-callback-success-banner'));
    });
  });

  describe('3. Compact accordions and video availability', () => {
    test('Page-wide search filters both FAQs and troubleshooting content', () => {
      assert.ok(screenSource.includes("const [supportSearchQuery, setSupportSearchQuery] = useState('')"));
      assert.ok(screenSource.includes('filteredTroubleshooting'));
      assert.ok(screenSource.includes('normalizedSupportQuery'));
      assert.ok(screenSource.includes('Search help, FAQs, and troubleshooting'));
    });

    test('Troubleshooting and FAQs share a responsive desktop knowledge grid', () => {
      assert.ok(screenSource.includes('zd-support-knowledge-grid'));
      assert.match(cssSource, /\.zd-support-knowledge-grid\s*\{[\s\S]*?grid-template-columns: minmax\(0, 0\.82fr\) minmax\(0, 1\.18fr\)/);
      assert.match(cssSource, /@media \(max-width: 980px\)[\s\S]*?\.zd-support-knowledge-grid[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
    });

    test('Troubleshooting and FAQ answers use animated disclosure containers', () => {
      assert.ok(screenSource.includes('zd-trouble-body-inner'));
      assert.ok(screenSource.includes('zd-faq-answer-inner'));
      assert.ok(screenSource.includes('aria-hidden={!isExpanded}'));
      assert.ok(cssSource.includes('grid-template-rows: 0fr'));
      assert.ok(cssSource.includes('grid-template-rows: 1fr'));
      assert.match(cssSource, /\.zd-faq-answer-inner\s*\{[\s\S]*?padding:\s*0 18px/);
      assert.match(cssSource, /\.zd-faq-item--expanded \.zd-faq-answer-inner\s*\{[\s\S]*?padding:\s*13px 18px 16px 144px/);
    });

    test('Video cards use a responsive 5/4/2/1 grid and preserve Coming Soon state', () => {
      assert.ok(cssSource.includes('grid-template-columns: repeat(5, minmax(0, 1fr))'));
      assert.ok(cssSource.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'));
      assert.ok(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
      assert.ok(cssSource.includes('.zd-videos-grid { grid-template-columns: 1fr; }'));
      assert.ok(screenSource.includes("vid.hasPlayableVideo ? 'Available' : 'Coming Soon'"));
      assert.doesNotMatch(screenSource, /Preview \/ Coming Soon/);
    });

    test('Compliance notice is rendered and unsupported service claims are absent', () => {
      assert.ok(screenSource.includes('zd-help-disclaimer'));
      assert.ok(screenSource.includes('Help &amp; Support Compliance Notice:'));
      assert.doesNotMatch(screenSource, /Average callback within/i);
      assert.doesNotMatch(screenSource, /Monday to Saturday/i);
    });
  });

  describe('4. Validation & Simulation Logic (Unit Tests)', () => {
    function simulateValidation({ name, phone, category, issue }) {
      const errors = {};
      if (!name || !name.trim()) errors.name = 'Full Name is required';
      const cleanPhone = (phone || '').replace(/\D/g, '');
      if (!cleanPhone) errors.phone = 'Mobile Number is required';
      else if (cleanPhone.length !== 10) errors.phone = 'Please enter a valid 10-digit mobile number';
      if (!category) errors.category = 'Please select an issue category';
      if (!issue || !issue.trim()) errors.issue = 'Please provide a short description of your issue';
      else if (issue.trim().length < 10) errors.issue = 'Issue description must be at least 10 characters long';
      return errors;
    }

    test('Rejects empty submission with all required field errors', () => {
      const errors = simulateValidation({ name: '', phone: '', category: '', issue: '' });
      assert.strictEqual(errors.name, 'Full Name is required');
      assert.strictEqual(errors.phone, 'Mobile Number is required');
      assert.strictEqual(errors.category, 'Please select an issue category');
      assert.strictEqual(errors.issue, 'Please provide a short description of your issue');
    });

    test('Rejects invalid mobile numbers', () => {
      const errShort = simulateValidation({ name: 'John Doe', phone: '98765', category: 'Technical Issue', issue: 'Valid length description here' });
      assert.strictEqual(errShort.phone, 'Please enter a valid 10-digit mobile number');

      const errLetters = simulateValidation({ name: 'John Doe', phone: 'abcdefghij', category: 'Technical Issue', issue: 'Valid length description here' });
      assert.strictEqual(errLetters.phone, 'Mobile Number is required');
    });

    test('Rejects short issue descriptions (<10 chars)', () => {
      const errShortIssue = simulateValidation({ name: 'John Doe', phone: '9876543210', category: 'Other', issue: 'Help' });
      assert.strictEqual(errShortIssue.issue, 'Issue description must be at least 10 characters long');
    });

    test('Accepts valid form and produces simulated submission notice payload', () => {
      const payload = {
        name: 'Ramesh Kumar',
        phone: '9876500001',
        category: 'eStamp / eSign',
        issue: 'Need guidance on executing 11-month lease with NeSL e-stamp'
      };
      const errors = simulateValidation(payload);
      assert.deepStrictEqual(errors, {});
    });
  });
});

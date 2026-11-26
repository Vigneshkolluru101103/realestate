import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const screen = readFileSync(
  new URL('../src/screens/MyAgreements/MyAgreementsScreen.jsx', import.meta.url),
  'utf8'
);
const css = readFileSync(
  new URL('../src/screens/MyAgreements/MyAgreements.css', import.meta.url),
  'utf8'
);

describe('My Agreements universal quick-action layout', () => {
  test('uses the same fixed action column for the header and every action cell', () => {
    assert.match(screen, /<th className="doc-cell-actions">/);
    assert.match(screen, /<td className="doc-cell-actions">/);
    assert.match(css, /#agreements-master-table \.doc-cell-actions\s*\{[\s\S]*min-width: 480px[\s\S]*width: 480px/);
  });

  test('keeps WhatsApp, PDF, Compliance, and Remind WA in four stable slots', () => {
    assert.match(css, /grid-template-columns: 128px 56px 144px 96px/);
    assert.match(css, /\.table-quick-actions\s*\{[\s\S]*width: 448px/);
    assert.match(css, /\.table-quick-actions \.btn\s*\{[\s\S]*height: 32px[\s\S]*width: 100%[\s\S]*min-width: 0/);
    assert.match(screen, /agr\.status === 'Expiring Soon'/);
    assert.match(screen, /agr\.status !== 'Expiring Soon'[\s\S]*action-btn-remind-wa-slot/);
  });

  test('retains every existing action handler and the mobile two-column layout', () => {
    assert.match(screen, /onClick=\{\(\) => dispatchWhatsApp\(agr\.id\)\}/);
    assert.match(screen, /onClick=\{\(\) => handleDownloadAgreement\(agr\)\}/);
    assert.match(screen, /onClick=\{\(\) => handleGenerateCertForAgreement\(agr\)\}/);
    assert.match(screen, /onClick=\{\(\) => handleSendRenewalReminder\(agr\)\}/);
    assert.match(css, /@media \(max-width: 768px\)[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  });
});

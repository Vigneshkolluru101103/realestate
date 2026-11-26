import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const screen = readFileSync(
  new URL('../src/screens/HomeDashboard/HomeDashboardScreen.jsx', import.meta.url),
  'utf8'
);
const css = readFileSync(
  new URL('../src/screens/HomeDashboard/HomeDashboard.css', import.meta.url),
  'utf8'
);

describe('Recent Agreements quick-action layout', () => {
  test('uses the same action-column class for the header and every row', () => {
    assert.match(screen, /<th className="zd-col-actions">/);
    assert.match(screen, /<td className="zd-col-actions"/);
  });

  test('keeps both action positions stable regardless of the PDF label', () => {
    assert.match(css, /\.zd-recent-table \.zd-col-actions\s*\{[\s\S]*width: 232px/);
    assert.match(css, /\.zd-recent-actions-group\s*\{[\s\S]*width: 188px/);
    assert.match(css, /\.zd-recent-action-btn--view\s*\{[\s\S]*width: 76px/);
    assert.match(css, /\.zd-recent-action-btn--pdf\s*\{[\s\S]*width: 104px/);
    assert.match(css, /\.zd-recent-action-btn\s*\{[\s\S]*height: 32px[\s\S]*flex-shrink: 0/);
  });

  test('retains the existing View and status-dependent PDF behavior', () => {
    assert.match(screen, /onClick=\{\(\) => handleViewAgreement\(agr\)\}/);
    assert.match(screen, /onClick=\{\(\) => handleDownloadPdf\(agr\)\}/);
    assert.match(screen, /t\('btn_draft_pdf', 'Draft PDF'\)/);
    assert.match(screen, /t\('btn_pdf', 'PDF'\)/);
  });
});

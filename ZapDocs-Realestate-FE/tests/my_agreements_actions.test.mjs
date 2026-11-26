import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAgreementPdfBytes } from '../src/utils/pdfGenerator.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const screenSource = fs.readFileSync(
  path.join(dirname, '..', 'src', 'screens', 'MyAgreements', 'MyAgreementsScreen.jsx'),
  'utf8'
);

describe('My Agreements quick actions and status presentation', () => {
  test('Universal Quick Actions exposes the certificate action and removes row renewal', () => {
    assert.ok(screenSource.includes('Generate Certificate'));
    assert.ok(screenSource.includes('Certificate Generated'));
    assert.ok(!screenSource.includes('btn-renew-'));
    assert.ok(!screenSource.includes("openModal('renewal-review', agr)"));
  });

  test('PDF action selects final or watermarked agreement download by row status', () => {
    assert.ok(screenSource.includes('onClick={() => handleDownloadAgreement(agr)}'));
    assert.ok(screenSource.includes('downloadLegalPdf(agr, agr.shaHash)'));
    assert.ok(screenSource.includes('downloadWatermarkedDraft(agr)'));
  });

  test('Real-Time Status keeps the primary label and removes secondary badges', () => {
    assert.ok(screenSource.includes('<span>{agr.status}</span>'));
    assert.ok(!screenSource.includes('agr.badges.map'));
  });

  test('agreement PDF bytes remain isolated to the selected agreement', () => {
    const first = {
      id: 'ZD-8991',
      tenantName: 'Vikram Joshi',
      ownerName: 'Prakash Rao',
      propertyArea: 'HSR Layout Sector 2',
      status: 'Completed',
      shaHash: 'hash-for-8991'
    };
    const second = {
      id: 'ZD-8845',
      tenantName: 'Rohit Khandelwal',
      ownerName: 'Balaji Towers LLC',
      propertyArea: 'Koramangala 4th Block',
      status: 'Completed',
      shaHash: 'hash-for-8845'
    };

    const firstPdf = new TextDecoder().decode(createAgreementPdfBytes(first, { shaHash: first.shaHash }));
    const secondPdf = new TextDecoder().decode(createAgreementPdfBytes(second, { shaHash: second.shaHash }));

    assert.ok(firstPdf.startsWith('%PDF-1.4'));
    assert.ok(secondPdf.startsWith('%PDF-1.4'));
    assert.ok(firstPdf.includes(first.id));
    assert.ok(firstPdf.includes(first.tenantName));
    assert.ok(firstPdf.includes(first.shaHash));
    assert.ok(!firstPdf.includes(second.id));
    assert.ok(secondPdf.includes(second.id));
    assert.ok(secondPdf.includes(second.tenantName));
    assert.ok(secondPdf.includes(second.shaHash));
    assert.ok(!secondPdf.includes(first.id));
  });
});

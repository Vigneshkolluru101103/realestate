import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSection63CertificatePdfBytes,
  generateSection63Certificate,
  migrateCertificateStore
} from '../src/utils/section63Generator.js';

const agreements = {
  pending: {
    id: 'ZD-PENDING', date: '12 Oct 2026', tenantName: 'Siddharth Rao', ownerName: 'Sunita Mehra',
    propertyArea: 'Indiranagar 100ft Rd', type: 'Residential 11M', status: 'Pending e-Sign',
    shaHash: 'pending-hash', rent: 42000, deposit: 200000
  },
  completed: {
    id: 'ZD-COMPLETE', date: '10 Oct 2026', tenantName: 'Vikram Joshi', ownerName: 'Prakash Rao',
    propertyArea: 'HSR Layout Sector 2', type: 'Residential 11M', status: 'Completed',
    shaHash: 'completed-hash', rent: 38000, deposit: 190000
  },
  expiring: {
    id: 'ZD-EXPIRING', date: '28 Sep 2026', tenantName: 'Kavita Nair', ownerName: 'M. S. Murthy',
    propertyArea: 'Whitefield EPIP Zone', type: 'Residential 11M', status: 'Expiring Soon',
    shaHash: 'expiring-hash', rent: 35000, deposit: 150000
  }
};

describe('locally generated Section 63 certificate records', () => {
  test('rejects a missing agreement ID', () => {
    assert.throws(() => generateSection63Certificate(null), /unique ID/);
    assert.throws(() => generateSection63Certificate({}), /unique ID/);
  });

  test('generates an agreement-specific record with verification pending', () => {
    const record = generateSection63Certificate(agreements.pending);
    assert.equal(record.agreementDetails.agreementId, agreements.pending.id);
    assert.equal(record.agreementDetails.status, 'Pending e-Sign');
    assert.equal(record.agreementDetails.recordHash, 'pending-hash');
    assert.equal(record.verification.status, 'pending');
    assert.match(record.verification.note, /not been independently verified/i);
    assert.equal('cryptographicIntegrity' in record, false);
    assert.equal('statutoryFramework' in record, false);
  });

  test('uses the same locally generated, verification-pending record for every agreement status', () => {
    for (const agreement of Object.values(agreements)) {
      const record = generateSection63Certificate(agreement);
      assert.equal(record.agreementDetails.status, agreement.status);
      assert.equal(record.verification.status, 'pending');
    }
  });

  test('migrates legacy ready records without retaining their unsupported verification claims', () => {
    const { records, changed } = migrateCertificateStore({
      [agreements.completed.id]: {
        status: 'ready',
        generatedAt: '2026-11-01T00:00:00.000Z',
        data: {
          certificateId: 'BSA63-CERT-ZD-COMPLETE-OLD',
          issuedAt: '2026-11-01T00:00:00.000Z',
          agreementDetails: {
            agreementId: agreements.completed.id,
            agreementType: agreements.completed.type,
            status: agreements.completed.status,
            parties: { tenantName: agreements.completed.tenantName, ownerName: agreements.completed.ownerName }
          },
          cryptographicIntegrity: { integrityAuditStatus: 'VERIFIED_UNALTERED', uidaiESignCompliant: true }
        }
      }
    });

    const migrated = records[agreements.completed.id];
    assert.equal(changed, true);
    assert.equal(migrated.status, 'generated');
    assert.equal(migrated.data.verification.status, 'pending');
    assert.equal('cryptographicIntegrity' in migrated.data, false);
    assert.equal(migrated.data.agreementDetails.agreementId, agreements.completed.id);
  });

  test('renders a readable PDF without unsupported verification or legal-compliance claims', () => {
    const pdfSource = new TextDecoder().decode(createSection63CertificatePdfBytes(generateSection63Certificate(agreements.expiring)));
    assert.ok(pdfSource.startsWith('%PDF-1.4'));
    assert.ok(pdfSource.includes('SECTION 63 CERTIFICATE RECORD'));
    assert.ok(pdfSource.includes('Certificate generated'));
    assert.ok(pdfSource.includes('verification pending'));
    assert.ok(pdfSource.includes(agreements.expiring.id));
    assert.ok(pdfSource.includes(agreements.expiring.tenantName));
    assert.ok(!pdfSource.includes('VERIFIED_UNALTERED'));
    assert.ok(!pdfSource.includes('UIDAI e-Sign Compliant'));
    assert.ok(pdfSource.includes('does not confirm compliance'));
  });

  test('sanitizes a legacy payload again at PDF download time', () => {
    const legacyPdf = new TextDecoder().decode(createSection63CertificatePdfBytes({
      agreementDetails: { agreementId: 'ZD-LEGACY', parties: {} },
      cryptographicIntegrity: { integrityAuditStatus: 'VERIFIED_UNALTERED', uidaiESignCompliant: true },
      evidentiaryDeclaration: 'The integrity of the electronic record is certified.'
    }));

    assert.ok(legacyPdf.includes('verification pending'));
    assert.ok(!legacyPdf.includes('VERIFIED_UNALTERED'));
    assert.ok(!legacyPdf.includes('uidaiESignCompliant'));
    assert.ok(!legacyPdf.includes('The integrity of the electronic record is certified.'));
  });

  test('leaves an already migrated record unchanged for refresh persistence', () => {
    const generated = generateSection63Certificate(agreements.completed);
    const original = { [agreements.completed.id]: { status: 'generated', data: generated, generatedAt: generated.generatedAt } };
    const { records, changed } = migrateCertificateStore(original);

    assert.equal(changed, false);
    assert.deepEqual(records, original);
  });

  test('drops malformed legacy records instead of presenting them as generated', () => {
    const { records, changed } = migrateCertificateStore({
      'ZD-BAD': { status: 'ready', data: { agreementDetails: { agreementId: 'ZD-OTHER' } } }
    });

    assert.equal(changed, true);
    assert.deepEqual(records, {});
  });
});

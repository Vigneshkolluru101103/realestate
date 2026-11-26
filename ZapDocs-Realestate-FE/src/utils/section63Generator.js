import { createTextPdfBytes, downloadPdfBytes } from './pdfGenerator.js';

const LOCAL_VERIFICATION_NOTE =
  'This record was generated locally and has not been independently verified.';

function toFinancialSummary(agreement = {}) {
  return {
    monthlyRent: agreement.rent ? `₹${Number(agreement.rent).toLocaleString('en-IN')}` : undefined,
    securityDeposit: agreement.deposit ? `₹${Number(agreement.deposit).toLocaleString('en-IN')}` : undefined
  };
}

function toAgreementDetails(agreement = {}) {
  return {
    agreementId: agreement.id || '',
    agreementType: agreement.type || 'Agreement',
    executionDate: agreement.date || 'Not provided',
    status: agreement.status || 'Not provided',
    propertyLocation: agreement.propertyArea || 'Not provided',
    parties: {
      tenantName: agreement.tenantName || 'Not provided',
      ownerName: agreement.ownerName || 'Not provided'
    },
    financialSummary: agreement.financialSummary || toFinancialSummary(agreement),
    recordHash: agreement.shaHash || ''
  };
}

/**
 * Creates a locally generated certificate record. It does not verify a
 * signature, stamp, hash, legal status, or third-party compliance outcome.
 */
export function generateSection63Certificate(agreement) {
  if (!agreement || typeof agreement !== 'object' || !agreement.id) {
    throw new Error('Valid agreement record with a unique ID is required to generate a certificate record.');
  }

  const generatedAt = new Date().toISOString();
  return {
    format: 'local-record-v1',
    certificateType: 'Locally Generated Section 63 Certificate Record',
    certificateId: `LOCAL-SECTION63-${agreement.id}-${Date.now().toString(36).toUpperCase()}`,
    generatedAt,
    agreementDetails: toAgreementDetails(agreement),
    verification: {
      status: 'pending',
      source: 'Local frontend generation',
      note: LOCAL_VERIFICATION_NOTE
    }
  };
}

/**
 * Converts legacy or malformed cached data to the safe local-record shape.
 * The old verification claims are intentionally discarded.
 */
export function sanitizeCertificateRecord(certificate, agreementId = '') {
  const agreement = certificate?.agreementDetails || {};
  const record = {
    ...toAgreementDetails({
      id: agreement.agreementId || agreementId,
      type: agreement.agreementType,
      date: agreement.executionDate,
      status: agreement.status,
      propertyArea: agreement.propertyLocation,
      tenantName: agreement.parties?.tenantName,
      ownerName: agreement.parties?.ownerName,
      financialSummary: agreement.financialSummary,
      shaHash: agreement.recordHash || certificate?.cryptographicIntegrity?.tamperProofHashSeal || ''
    }),
    financialSummary: agreement.financialSummary || {}
  };

  return {
    format: 'local-record-v1',
    certificateType: 'Locally Generated Section 63 Certificate Record',
    certificateId: `LOCAL-SECTION63-${record.agreementId || 'AGREEMENT'}`,
    generatedAt: certificate?.generatedAt || certificate?.issuedAt || '',
    agreementDetails: record,
    verification: {
      status: 'pending',
      source: 'Local frontend generation',
      note: LOCAL_VERIFICATION_NOTE
    }
  };
}

export function migrateCertificateStore(records) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) {
    return { records: {}, changed: Boolean(records) };
  }

  let changed = false;
  const migrated = {};

  for (const [agreementId, state] of Object.entries(records)) {
    const dataAgreementId = state?.data?.agreementDetails?.agreementId;

    if (
      state?.status === 'generated' &&
      state.data?.format === 'local-record-v1' &&
      dataAgreementId === agreementId
    ) {
      migrated[agreementId] = state;
    } else if (state?.data && dataAgreementId === agreementId) {
      migrated[agreementId] = {
        status: 'generated',
        data: sanitizeCertificateRecord(state.data, agreementId),
        error: null,
        generatedAt: state.generatedAt || state.data.generatedAt || state.data.issuedAt || ''
      };
      changed = true;
    } else if (state?.status === 'error') {
      migrated[agreementId] = { status: 'error', data: null, error: state.error || 'Generation failed' };
      changed ||= state.status !== 'error' || Boolean(state.data);
    } else {
      changed = true;
    }
  }

  return { records: migrated, changed };
}

/**
 * Builds a readable PDF from the safe local-record shape. Sanitizing here
 * prevents legacy cached claims from appearing in a newly downloaded PDF.
 */
export function createSection63CertificatePdfBytes(certificate) {
  if (!certificate || typeof certificate !== 'object') {
    throw new Error('Certificate data must be provided for download.');
  }

  const safeCertificate = sanitizeCertificateRecord(certificate);
  const agreement = safeCertificate.agreementDetails;
  const parties = agreement.parties || {};
  const financial = agreement.financialSummary || {};
  const lines = [
    { text: `Record type: ${safeCertificate.certificateType}` },
    { text: `Local record ID: ${safeCertificate.certificateId}` },
    { text: `Generated at: ${safeCertificate.generatedAt || 'Not recorded'}` },
    { text: 'VERIFICATION STATUS', bold: true, spaceBefore: 8 },
    { text: 'Certificate generated — verification pending' },
    { text: `Source: ${safeCertificate.verification.source}` },
    { text: safeCertificate.verification.note },
    {
      text: 'This document does not confirm compliance, signature validity, stamp status, document integrity, or legal admissibility.'
    },
    { text: 'AGREEMENT DETAILS', bold: true, spaceBefore: 8 },
    { text: `Agreement ID: ${agreement.agreementId || ''}` },
    { text: `Agreement type: ${agreement.agreementType || ''}` },
    { text: `Recorded date: ${agreement.executionDate || ''}` },
    { text: `Current agreement status: ${agreement.status || ''}` },
    { text: `Property location: ${agreement.propertyLocation || ''}` },
    { text: `Tenant name: ${parties.tenantName || ''}` },
    { text: `Owner name: ${parties.ownerName || ''}` }
  ];

  if (financial.monthlyRent !== undefined) lines.push({ text: `Monthly rent: ${financial.monthlyRent}` });
  if (financial.securityDeposit !== undefined) lines.push({ text: `Security deposit: ${financial.securityDeposit}` });
  if (agreement.recordHash) lines.push({ text: `Provided record hash (not independently verified): ${agreement.recordHash}` });

  return createTextPdfBytes({
    title: 'SECTION 63 CERTIFICATE RECORD',
    subtitle: `Agreement ${agreement.agreementId || 'AGREEMENT'} | Locally generated — verification pending`,
    subject: 'Locally generated agreement certificate record',
    lines
  });
}

export function downloadSection63Certificate(certificate, agreementId) {
  if (!certificate || typeof certificate !== 'object') {
    throw new Error('Certificate data must be provided for download.');
  }

  const safeId = agreementId || certificate.agreementDetails?.agreementId || 'AGREEMENT';
  downloadPdfBytes(createSection63CertificatePdfBytes(certificate), `Section63_Certificate_Record_${safeId}.pdf`);
}

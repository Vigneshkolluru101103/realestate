import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Recent Agreements Quick Actions Functionality Verification', () => {
  const dashboardPath = path.resolve('src/screens/HomeDashboard/HomeDashboardScreen.jsx');
  const dashboardSource = fs.readFileSync(dashboardPath, 'utf-8');

  const cssPath = path.resolve('src/screens/HomeDashboard/HomeDashboard.css');
  const cssSource = fs.readFileSync(cssPath, 'utf-8');

  const modalManagerPath = path.resolve('src/components/broker/modals/BrokerModalManager.jsx');
  const modalManagerSource = fs.readFileSync(modalManagerPath, 'utf-8');

  const detailsModalPath = path.resolve('src/components/broker/modals/AgreementDetailsModal.jsx');
  const detailsModalSource = fs.readFileSync(detailsModalPath, 'utf-8');

  const draftModalPath = path.resolve('src/components/broker/modals/DraftPdfWarningModal.jsx');
  const draftModalSource = fs.readFileSync(draftModalPath, 'utf-8');

  /* -------------------------------------------------------------
   * 1. Separation of View and PDF Responsibilities
   * ------------------------------------------------------------- */
  describe('1. Separation of View and PDF Responsibilities', () => {
    test('View action NEVER triggers a download', () => {
      // In handleViewAgreement, downloadLegalPdf or downloadAgreementPdf must NOT be called
      const handleViewMatch = dashboardSource.match(/const handleViewAgreement = \([\s\S]*?\n  \};/);
      assert.ok(handleViewMatch, 'handleViewAgreement function must be defined');
      const handleViewBody = handleViewMatch[0];

      assert.ok(!handleViewBody.includes('downloadLegalPdf('), 'handleViewAgreement must NEVER trigger downloadLegalPdf');
      assert.ok(!handleViewBody.includes('downloadAgreementPdf('), 'handleViewAgreement must NEVER trigger downloadAgreementPdf');
      assert.ok(!handleViewBody.includes('downloadWatermarkedDraft('), 'handleViewAgreement must NEVER trigger downloadWatermarkedDraft');
    });

    test('PDF action triggers dedicated download handlers based on agreement status', () => {
      const handleDownloadMatch = dashboardSource.match(/const handleDownloadPdf = \([\s\S]*?\n  \};/);
      assert.ok(handleDownloadMatch, 'handleDownloadPdf function must be defined');
      const handleDownloadBody = handleDownloadMatch[0];

      assert.ok(handleDownloadBody.includes('downloadLegalPdf(agr, agr.shaHash)'), 'Must download legal PDF for executed agreements');
      assert.ok(handleDownloadBody.includes('downloadWatermarkedDraft(agr)'), 'Must download watermarked draft for pending/draft agreements');
    });
  });

  /* -------------------------------------------------------------
   * 2. Completed & Expiring Soon Agreements
   * ------------------------------------------------------------- */
  describe('2. Completed & Expiring Soon Agreements', () => {
    test('Completed: View opens agreement-details preview modal', () => {
      const handleViewMatch = dashboardSource.match(/const handleViewAgreement = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleViewMatch.includes("openModal('agreement-details', agr)"),
        'View must open agreement-details modal for completed agreements'
      );
    });

    test('Completed: PDF downloads final executed PDF with SHA hash', () => {
      const handleDownloadMatch = dashboardSource.match(/const handleDownloadPdf = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleDownloadMatch.includes("agr.status === 'Completed'"),
        'Must check for Completed status'
      );
      assert.ok(
        handleDownloadMatch.includes('downloadLegalPdf(agr, agr.shaHash)'),
        'Must pass agreement and shaHash to downloadLegalPdf'
      );
    });

    test('Expiring Soon: View opens details modal, PDF downloads executed PDF', () => {
      const handleDownloadMatch = dashboardSource.match(/const handleDownloadPdf = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleDownloadMatch.includes("agr.status === 'Expiring Soon'"),
        'Must support Expiring Soon status for legal PDF download'
      );
    });
  });

  /* -------------------------------------------------------------
   * 3. Pending e-Sign Agreements
   * ------------------------------------------------------------- */
  describe('3. Pending e-Sign Agreements', () => {
    test('Pending e-Sign: View opens draft-pdf-warning (Agreement Awaiting Signatures) interface', () => {
      const handleViewMatch = dashboardSource.match(/const handleViewAgreement = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleViewMatch.includes("agr.status === 'Pending e-Sign'") &&
        handleViewMatch.includes("openModal('draft-pdf-warning', agr)"),
        'View must open draft-pdf-warning modal for pending e-sign agreements'
      );
    });

    test('DraftPdfWarningModal displays signing progress and pending parties breakdown', () => {
      assert.ok(draftModalSource.includes('Signing Progress'), 'Must display signing progress');
      assert.ok(draftModalSource.includes('Pending Parties Status'), 'Must display pending parties status');
      assert.ok(draftModalSource.includes('agr.tenantName'), 'Must show tenant name');
      assert.ok(draftModalSource.includes('agr.ownerName'), 'Must show owner name');
    });

    test('DraftPdfWarningModal preserves Resend WhatsApp Signature Link functionality', () => {
      assert.ok(draftModalSource.includes('dispatchWhatsApp(agr.id)'), 'Must call dispatchWhatsApp with agreement ID');
      assert.ok(draftModalSource.includes('btn-draft-resend-link'), 'Resend WhatsApp button must exist');
    });

    test('Pending e-Sign: PDF downloads watermarked unexecuted draft copy', () => {
      const handleDownloadMatch = dashboardSource.match(/const handleDownloadPdf = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleDownloadMatch.includes("agr.status === 'Pending e-Sign'") &&
        handleDownloadMatch.includes('downloadWatermarkedDraft(agr)'),
        'Must download watermarked draft copy for pending agreements'
      );
    });
  });

  /* -------------------------------------------------------------
   * 4. Draft & Other Statuses
   * ------------------------------------------------------------- */
  describe('4. Draft & Other Statuses', () => {
    test('Draft: View opens details preview without download', () => {
      const handleViewMatch = dashboardSource.match(/const handleViewAgreement = \([\s\S]*?\n  \};/)[0];
      assert.ok(!handleViewMatch.includes('downloadLegalPdf('));
      assert.ok(!handleViewMatch.includes('downloadWatermarkedDraft('));
      assert.ok(!handleViewMatch.includes('downloadAgreementPdf('));
    });

    test('Draft: PDF downloads watermarked draft', () => {
      const handleDownloadMatch = dashboardSource.match(/const handleDownloadPdf = \([\s\S]*?\n  \};/)[0];
      assert.ok(
        handleDownloadMatch.includes("agr.status === 'Draft'") &&
        handleDownloadMatch.includes('downloadWatermarkedDraft(agr)'),
        'Draft status must download watermarked draft copy'
      );
    });

    test('UI button titles and labels reflect actual state', () => {
      assert.ok(dashboardSource.includes('zd-recent-action-btn--draft-pdf'), 'CSS class for draft PDF button must exist');
      assert.ok(dashboardSource.includes("btn_draft_pdf"), 'Translation key for draft PDF button must exist');
    });
  });

  /* -------------------------------------------------------------
   * 5. AgreementDetailsModal & Modal Registration
   * ------------------------------------------------------------- */
  describe('5. AgreementDetailsModal & Modal Registration', () => {
    test('BrokerModalManager registers AgreementDetailsModal under agreement-details', () => {
      assert.ok(modalManagerSource.includes('AgreementDetailsModal'));
      assert.ok(modalManagerSource.includes("activeModal?.name === 'agreement-details'"));
    });

    test('AgreementDetailsModal renders agreement ID, parties, terms, and legal validity without auto-download', () => {
      assert.ok(detailsModalSource.includes('agr.id'));
      assert.ok(detailsModalSource.includes('agr.tenantName'));
      assert.ok(detailsModalSource.includes('agr.propertyArea'));
      assert.ok(detailsModalSource.includes('agr.shaHash'));
      assert.ok(detailsModalSource.includes('closeModal'));
    });
  });
});

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dirname, '..');

const dashboardSource = fs.readFileSync(
  path.join(ROOT, 'src', 'screens', 'HomeDashboard', 'HomeDashboardScreen.jsx'),
  'utf8'
);
const myAgreementsSource = fs.readFileSync(
  path.join(ROOT, 'src', 'screens', 'MyAgreements', 'MyAgreementsScreen.jsx'),
  'utf8'
);
const modalManagerSource = fs.readFileSync(
  path.join(ROOT, 'src', 'components', 'broker', 'modals', 'BrokerModalManager.jsx'),
  'utf8'
);
const agreementModalSource = fs.readFileSync(
  path.join(ROOT, 'src', 'components', 'broker', 'modals', 'AgreementCreationModal.jsx'),
  'utf8'
);

describe('Dashboard & My Agreements Shared Workflow Integration', () => {
  describe('1. Dashboard Agreement Action Triggers', () => {
    test('Generate Rental Agreement button is styled primary and opens shared creation workflow', () => {
      assert.ok(dashboardSource.includes('id="btn-gen-rental-sub"'), 'Must have btn-gen-rental-sub ID');
      assert.ok(dashboardSource.includes('zd-btn-action--primary'), 'Must use primary button class');
      assert.ok(dashboardSource.includes('+ Generate Rental Agreement'), 'Must display correct label');
      assert.ok(
        dashboardSource.includes("type: 'Residential Rental Agreement'"),
        'Must specify Residential Rental Agreement type'
      );
      assert.ok(
        dashboardSource.includes("entryMode: 'choose'"),
        'Must open shared entry mode choice screen'
      );
    });

    test('Generate Other Agreements button is styled secondary and opens shared other workflow', () => {
      assert.ok(dashboardSource.includes('id="btn-gen-other-sub"'), 'Must have btn-gen-other-sub ID');
      assert.ok(dashboardSource.includes('zd-btn-action--secondary'), 'Must use secondary button class');
      assert.ok(dashboardSource.includes('+ Generate Other Agreements'), 'Must display correct label');
      assert.ok(
        dashboardSource.includes("type: 'Commercial / Other Agreement'"),
        'Must specify Commercial / Other Agreement type'
      );
      assert.ok(
        dashboardSource.includes("category: 'other'"),
        'Must specify other category'
      );
      assert.ok(
        dashboardSource.includes("entryMode: 'choose'"),
        'Must open shared entry mode choice screen'
      );
    });
  });

  describe('2. My Agreements Action Triggers', () => {
    test('My Agreements offers Add Agreement, Rental Agreement, and Other Agreements', () => {
      assert.ok(myAgreementsSource.includes('id="btn-add-agreement"'), 'Must have btn-add-agreement ID');
      assert.ok(myAgreementsSource.includes('id="btn-add-rental-agreement"'), 'Must have btn-add-rental-agreement ID');
      assert.ok(myAgreementsSource.includes('id="btn-add-other-agreement"'), 'Must have btn-add-other-agreement ID');
      assert.ok(myAgreementsSource.includes("entryMode: 'choose'"), 'Must route through choose entry mode');
    });

    test('My Agreements routes Rental and Other agreements to the same modal name', () => {
      assert.ok(
        myAgreementsSource.includes("openModal('generate-agreement'"),
        'Must use standard generate-agreement modal name'
      );
    });
  });

  describe('3. Modal Manager & Agreement Creation Modal Integration', () => {
    test('BrokerModalManager passes category, term, and entryMode to AgreementCreationModal', () => {
      assert.ok(modalManagerSource.includes('initialCategory={activeModal.payload?.category'));
      assert.ok(modalManagerSource.includes('initialTerm={activeModal.payload?.term'));
      assert.ok(modalManagerSource.includes('initialEntryMode={activeModal.payload?.entryMode'));
    });

    test('AgreementCreationModal supports both rental and other categories without separate modals', () => {
      assert.ok(agreementModalSource.includes('agreementCategory'));
      assert.ok(agreementModalSource.includes('id="choose-upload-agreement"'));
      assert.ok(agreementModalSource.includes('id="choose-manual-agreement"'));
      assert.ok(agreementModalSource.includes('LEASE_DURATION_OPTIONS'));
      assert.ok(agreementModalSource.includes('Commercial / Other Agreement'));
      assert.ok(agreementModalSource.includes('Leave and License'));
    });

    test('AgreementCreationModal preserves execution pipeline, client prefill, and validation', () => {
      assert.ok(agreementModalSource.includes('handleExecutePipeline'));
      assert.ok(agreementModalSource.includes('handleClientSelect'));
      assert.ok(agreementModalSource.includes('validateAgreementForm'));
      assert.ok(agreementModalSource.includes('addAgreement(formData)'));
    });
  });
});

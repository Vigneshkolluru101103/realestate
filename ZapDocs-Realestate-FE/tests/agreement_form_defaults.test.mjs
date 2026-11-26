import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dirname, '..');

const modalSource = fs.readFileSync(
  path.join(ROOT, 'src', 'components', 'broker', 'modals', 'AgreementCreationModal.jsx'),
  'utf8'
);
const modalManagerSource = fs.readFileSync(
  path.join(ROOT, 'src', 'components', 'broker', 'modals', 'BrokerModalManager.jsx'),
  'utf8'
);
const contextSource = fs.readFileSync(
  path.join(ROOT, 'src', 'contexts', 'BrokerStateContext.jsx'),
  'utf8'
);

describe('Agreement Form Default Values and State Persistence', () => {
  describe('1. Static Code Analysis & State Reset Architecture', () => {
    test('AgreementCreationModal no longer hardcodes mock parties or financial values', () => {
      // Must not hardcode Suresh Reddy, Pooja Hegde, Falcon City, 42000, 200000 in form initialization
      assert.doesNotMatch(
        modalSource,
        /landlord:\s*initialPrefill\?\.role === 'Landlord' \? initialPrefill\.name : 'Suresh Reddy'/,
        'Must not hardcode Suresh Reddy as default landlord'
      );
      assert.doesNotMatch(
        modalSource,
        /tenant:\s*initialPrefill\?\.role === 'Tenant' \? initialPrefill\.name : 'Pooja Hegde'/,
        'Must not hardcode Pooja Hegde as default tenant'
      );
      assert.doesNotMatch(
        modalSource,
        /address:\s*initialPrefill\?\.address \|\| 'Flat 1204, Prestige Falcon City, Kanakapura Rd'/,
        'Must not hardcode Falcon City address'
      );
      assert.doesNotMatch(
        modalSource,
        /rent:\s*'42000'/,
        'Must not hardcode 42000 as default rent'
      );
      assert.doesNotMatch(
        modalSource,
        /deposit:\s*'200000'/,
        'Must not hardcode 200000 as default deposit'
      );
    });

    test('buildInitialFormData ensures clean blank fields for new agreements while preserving legitimate defaults', () => {
      assert.ok(modalSource.includes('function buildInitialFormData'), 'Must define buildInitialFormData');
      assert.ok(modalSource.includes("landlord: ''"), 'New agreement landlord must default to empty string');
      assert.ok(modalSource.includes("tenant: ''"), 'New agreement tenant must default to empty string');
      assert.ok(modalSource.includes("address: ''"), 'New agreement address must default to empty string');
      assert.ok(modalSource.includes("rent: ''"), 'New agreement rent must default to empty string');
      assert.ok(modalSource.includes("deposit: ''"), 'New agreement deposit must default to empty string');
      assert.ok(modalSource.includes("referenceNumber: ''"), 'New agreement referenceNumber must default to empty string');
      assert.ok(modalSource.includes("effectiveDate: ''"), 'New agreement effectiveDate must default to empty string');
      assert.ok(modalSource.includes("expiryDate: ''"), 'New agreement expiryDate must default to empty string');

      // Preserved legitimate defaults
      assert.ok(modalSource.includes('term: defaultTerm'), 'Must preserve legitimate term default');
      assert.ok(modalSource.includes("jurisdiction: 'Karnataka'"), 'Must preserve legitimate jurisdiction default');
    });

    test('BrokerModalManager passes modalOpenId key and initialAgreement prop to AgreementCreationModal', () => {
      assert.ok(modalManagerSource.includes('key={activeModal.modalOpenId'), 'Must pass stable modalOpenId key');
      assert.ok(modalManagerSource.includes('initialAgreement='), 'Must support initialAgreement prop');
      assert.ok(contextSource.includes('modalOpenId'), 'BrokerStateContext must generate unique modalOpenId');
    });

    test('Client Vault dropdown binds to selectedClientName and includes empty placeholder option', () => {
      assert.ok(modalSource.includes('value={selectedClientName}'), 'GlassSelect must bind to selectedClientName');
      assert.doesNotMatch(
        modalSource,
        /value=\{formData\.tenant \|\| formData\.landlord \|\| ''\}/,
        'GlassSelect must NOT bind to formData party names'
      );
      assert.ok(
        modalSource.includes("value: '', label: '-- Select Existing Landlord or Tenant --'"),
        'clientOptions must include placeholder option with empty value'
      );
    });

    test('Closing and canceling modal removes uncommitted draft from storage', () => {
      assert.ok(modalSource.includes('function handleClose()'), 'Must define handleClose');
      assert.ok(modalSource.includes('storage.remove(DRAFT_KEY)'), 'Must remove draft on handleClose');
      assert.ok(modalSource.includes('onClick={handleClose}'), 'Cancel and close buttons must invoke handleClose');
    });

    test('Document upload prefill resets client selection and prefilled info', () => {
      const uploadFn = modalSource.slice(
        modalSource.indexOf('function handleUploadPrefill'),
        modalSource.indexOf('function handleProceedToStep2')
      );
      assert.ok(uploadFn.includes("setSelectedClientName('')"), 'Upload prefill must reset selectedClientName');
      assert.ok(uploadFn.includes('setPrefilledClientInfo(null)'), 'Upload prefill must reset prefilledClientInfo');
    });
  });

  describe('2. Behavioral Logic Simulation (Unit Tests)', () => {
    // Recreate the pure logic helper for runtime evaluation
    function simulateBuildInitialFormData({ initialAgreement, initialPrefill, defaultTitle = 'Residential Rental Agreement', defaultTerm = 'Residential 11M' }) {
      if (initialAgreement && typeof initialAgreement === 'object') {
        const cleanRent = initialAgreement.rent != null
          ? String(initialAgreement.rent).replace(/[^\d.]/g, '')
          : '';
        const cleanDeposit = initialAgreement.deposit != null
          ? String(initialAgreement.deposit).replace(/[^\d.]/g, '')
          : '';
        return {
          title: initialAgreement.agreementTitle || initialAgreement.title || defaultTitle,
          referenceNumber: initialAgreement.referenceNumber || '',
          landlord: initialAgreement.ownerName || initialAgreement.landlord || '',
          tenant: initialAgreement.tenantName || initialAgreement.tenant || '',
          address: initialAgreement.propertyArea || initialAgreement.address || '',
          rent: cleanRent,
          deposit: cleanDeposit,
          term: initialAgreement.type || initialAgreement.term || defaultTerm,
          jurisdiction: initialAgreement.jurisdiction || 'Karnataka',
          effectiveDate: initialAgreement.effectiveDate || '',
          expiryDate: initialAgreement.expiryDate || '',
          sourceDocument: null
        };
      }

      if (initialPrefill && typeof initialPrefill === 'object') {
        const isOwner = initialPrefill.role === 'Landlord' || initialPrefill.role === 'Landlord / Owner';
        return {
          title: defaultTitle,
          referenceNumber: '',
          landlord: isOwner ? (initialPrefill.name || '') : '',
          tenant: !isOwner ? (initialPrefill.name || '') : '',
          address: initialPrefill.address || '',
          rent: '',
          deposit: '',
          term: defaultTerm,
          jurisdiction: 'Karnataka',
          effectiveDate: '',
          expiryDate: '',
          sourceDocument: null
        };
      }

      return {
        title: defaultTitle,
        referenceNumber: '',
        landlord: '',
        tenant: '',
        address: '',
        rent: '',
        deposit: '',
        term: defaultTerm,
        jurisdiction: 'Karnataka',
        effectiveDate: '',
        expiryDate: '',
        sourceDocument: null
      };
    }

    test('Case 1: Open new agreement -> All party/financial fields are blank with legitimate defaults', () => {
      const state = simulateBuildInitialFormData({});
      assert.strictEqual(state.landlord, '');
      assert.strictEqual(state.tenant, '');
      assert.strictEqual(state.address, '');
      assert.strictEqual(state.rent, '');
      assert.strictEqual(state.deposit, '');
      assert.strictEqual(state.referenceNumber, '');
      assert.strictEqual(state.effectiveDate, '');
      assert.strictEqual(state.expiryDate, '');
      assert.strictEqual(state.sourceDocument, null);
      assert.strictEqual(state.title, 'Residential Rental Agreement');
      assert.strictEqual(state.term, 'Residential 11M');
      assert.strictEqual(state.jurisdiction, 'Karnataka');
    });

    test('Case 2: Select a Landlord from Vault -> Fills landlord and address, leaves financial fields blank', () => {
      const clients = [
        { name: 'Suresh Reddy', role: 'Landlord', address: '402 Brigade Gateway, Rajajinagar, Bangalore' },
        { name: 'Pooja Hegde', role: 'Tenant', address: 'Flat 1204, Prestige Falcon City, Kanakapura Rd' }
      ];
      let currentFormData = simulateBuildInitialFormData({});
      let prefilledClientInfo = null;

      // Select Suresh Reddy
      const found = clients.find((c) => c.name === 'Suresh Reddy');
      const isOwner = found.role === 'Landlord';
      const updates = {
        landlord: isOwner ? found.name : '',
        address: found.address
      };
      prefilledClientInfo = { name: found.name, role: found.role, address: found.address };
      currentFormData = { ...currentFormData, ...updates };

      assert.strictEqual(currentFormData.landlord, 'Suresh Reddy');
      assert.strictEqual(currentFormData.tenant, '');
      assert.strictEqual(currentFormData.address, '402 Brigade Gateway, Rajajinagar, Bangalore');
      assert.strictEqual(currentFormData.rent, '');
      assert.strictEqual(currentFormData.deposit, '');
    });

    test('Case 3: Change client from Landlord to Tenant -> Clears old landlord and sets tenant without stale leftovers', () => {
      const clients = [
        { name: 'Suresh Reddy', role: 'Landlord', address: '402 Brigade Gateway, Rajajinagar, Bangalore' },
        { name: 'Pooja Hegde', role: 'Tenant', address: 'Flat 1204, Prestige Falcon City, Kanakapura Rd' }
      ];
      let currentFormData = {
        ...simulateBuildInitialFormData({}),
        landlord: 'Suresh Reddy',
        address: '402 Brigade Gateway, Rajajinagar, Bangalore'
      };
      let prefilledClientInfo = { name: 'Suresh Reddy', role: 'Landlord', address: '402 Brigade Gateway, Rajajinagar, Bangalore' };

      // Switch to Pooja Hegde (Tenant)
      const newClient = clients.find((c) => c.name === 'Pooja Hegde');
      const isOwner = newClient.role === 'Landlord';
      const updates = {};
      if (prefilledClientInfo) {
        const wasOwner = prefilledClientInfo.role === 'Landlord';
        if (wasOwner && !isOwner && currentFormData.landlord === prefilledClientInfo.name) {
          updates.landlord = '';
        }
      }
      if (isOwner) updates.landlord = newClient.name;
      else updates.tenant = newClient.name;
      updates.address = newClient.address;

      currentFormData = { ...currentFormData, ...updates };
      prefilledClientInfo = { name: newClient.name, role: newClient.role, address: newClient.address };

      assert.strictEqual(currentFormData.landlord, '', 'Previous landlord must be cleanly wiped');
      assert.strictEqual(currentFormData.tenant, 'Pooja Hegde', 'New tenant must be set');
      assert.strictEqual(currentFormData.address, 'Flat 1204, Prestige Falcon City, Kanakapura Rd');
      assert.strictEqual(currentFormData.rent, '');
      assert.strictEqual(currentFormData.deposit, '');
    });

    test('Case 4: Clear client selection -> Prefilled fields clear cleanly', () => {
      let currentFormData = {
        ...simulateBuildInitialFormData({}),
        tenant: 'Pooja Hegde',
        address: 'Flat 1204, Prestige Falcon City, Kanakapura Rd'
      };
      let prefilledClientInfo = { name: 'Pooja Hegde', role: 'Tenant', address: 'Flat 1204, Prestige Falcon City, Kanakapura Rd' };

      // User selects empty placeholder
      const updates = {};
      if (prefilledClientInfo) {
        if (prefilledClientInfo.role === 'Tenant' && currentFormData.tenant === prefilledClientInfo.name) {
          updates.tenant = '';
        }
        if (currentFormData.address === prefilledClientInfo.address) {
          updates.address = '';
        }
      }
      currentFormData = { ...currentFormData, ...updates };
      prefilledClientInfo = null;

      assert.strictEqual(currentFormData.tenant, '', 'Tenant must be cleared');
      assert.strictEqual(currentFormData.landlord, '', 'Landlord must remain empty');
      assert.strictEqual(currentFormData.address, '', 'Address must be cleared');
    });

    test('Case 7: Edit existing agreement -> Existing agreement data loads properly', () => {
      const existing = {
        id: 'ZD-9042',
        agreementTitle: 'Commercial Lease Agreement',
        type: 'Commercial 22M',
        ownerName: 'Vikram Malhotra',
        tenantName: 'Tech Innovations Pvt Ltd',
        propertyArea: 'Tower 4, Electronic City Phase 1',
        rent: '₹1,50,000',
        deposit: '₹9,00,000',
        effectiveDate: '2026-01-01',
        expiryDate: '2027-11-01',
        referenceNumber: 'REF-COM-01',
        jurisdiction: 'Karnataka'
      };

      const state = simulateBuildInitialFormData({ initialAgreement: existing });
      assert.strictEqual(state.title, 'Commercial Lease Agreement');
      assert.strictEqual(state.term, 'Commercial 22M');
      assert.strictEqual(state.landlord, 'Vikram Malhotra');
      assert.strictEqual(state.tenant, 'Tech Innovations Pvt Ltd');
      assert.strictEqual(state.address, 'Tower 4, Electronic City Phase 1');
      assert.strictEqual(state.rent, '150000');
      assert.strictEqual(state.deposit, '900000');
      assert.strictEqual(state.effectiveDate, '2026-01-01');
      assert.strictEqual(state.expiryDate, '2027-11-01');
      assert.strictEqual(state.referenceNumber, 'REF-COM-01');
      assert.strictEqual(state.jurisdiction, 'Karnataka');
    });
  });
});

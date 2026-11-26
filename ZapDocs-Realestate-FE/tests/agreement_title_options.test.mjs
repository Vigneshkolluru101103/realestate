import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AGREEMENT_TITLE_OPTIONS,
  CUSTOM_AGREEMENT_TITLE,
  resolveAgreementTerm,
  resolveAgreementTitleSelection,
  usesGenericAgreementWorkflow
} from '../src/constants/agreementOptions.js';
import { validateAgreementForm } from '../src/utils/agreementFormValidation.js';

describe('agreement title options', () => {
  test('includes every approved category with custom last', () => {
    assert.deepStrictEqual(AGREEMENT_TITLE_OPTIONS.map(({ value }) => value), [
      'Residential Rental Agreement',
      'Commercial Rental Agreement',
      'Residential Lease Agreement',
      'Commercial Lease Agreement',
      'Leave and License Agreement',
      'Corporate / Company Lease Agreement',
      'Paying Guest (PG) Agreement',
      'Shared Accommodation / Co-living Agreement',
      'Warehouse / Industrial Lease Agreement',
      CUSTOM_AGREEMENT_TITLE
    ]);
  });

  test('maps only verified templates and uses the generic workflow otherwise', () => {
    assert.strictEqual(resolveAgreementTerm('Residential Rental Agreement'), 'Residential 11M');
    assert.strictEqual(resolveAgreementTerm('Commercial Lease Agreement'), 'Commercial 22M');
    assert.strictEqual(resolveAgreementTerm('Corporate / Company Lease Agreement'), 'Corporate 36M');
    assert.strictEqual(resolveAgreementTerm('Leave and License Agreement'), 'Leave and License');
    assert.strictEqual(resolveAgreementTerm('Paying Guest (PG) Agreement'), 'Commercial / Other Agreement');
    assert.strictEqual(usesGenericAgreementWorkflow('Warehouse / Industrial Lease Agreement'), true);
  });

  test('keeps saved custom titles editable and rejects an empty custom title', () => {
    assert.strictEqual(resolveAgreementTitleSelection('Broker Collaboration Agreement'), CUSTOM_AGREEMENT_TITLE);
    const errors = validateAgreementForm({
      title: '',
      term: 'Commercial / Other Agreement',
      landlord: 'Asha Rao',
      tenant: 'Ravi Kumar',
      address: '10 Lake Road, Bengaluru',
      rent: '25000',
      deposit: '75000'
    });
    assert.match(errors.title, /at least 3 characters/i);
  });
});

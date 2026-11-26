import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getComplianceCertificateState } from '../src/utils/complianceVerification.js';

describe('My Agreements certificate state presentation', () => {
  test('uses the honest not-generated, generating, generated, and failed states', () => {
    assert.equal(getComplianceCertificateState(undefined), 'not-generated');
    assert.equal(getComplianceCertificateState({ status: 'generating' }), 'generating');
    assert.equal(getComplianceCertificateState({ status: 'generated', data: { certificateId: 'LOCAL-1' } }), 'generated');
    assert.equal(getComplianceCertificateState({ status: 'error', error: 'Download failed' }), 'failed');
  });

  test('does not treat legacy ready records as verified or generated until migration', () => {
    assert.equal(getComplianceCertificateState({ status: 'ready', data: {} }), 'not-generated');
  });

  test('keeps certificate presentation independent of pending, completed, and expiring agreement statuses', () => {
    for (const status of ['Pending e-Sign', 'Completed', 'Expiring Soon']) {
      assert.equal(getComplianceCertificateState({ status: 'generated', data: { certificateId: status } }), 'generated');
    }
  });
});

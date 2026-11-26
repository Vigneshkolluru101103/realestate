export function getComplianceCertificateState(certState) {
  if (certState?.status === 'generating') return 'generating';
  if (certState?.status === 'generated' && certState?.data) return 'generated';
  if (certState?.status === 'error') return 'failed';
  return 'not-generated';
}

export const CUSTOM_AGREEMENT_TITLE = 'Other / Custom Agreement';

export const AGREEMENT_TITLE_OPTIONS = Object.freeze([
  { value: 'Residential Rental Agreement', label: 'Residential Rental Agreement', subtitle: 'Residential 11-month workflow' },
  { value: 'Commercial Rental Agreement', label: 'Commercial Rental Agreement', subtitle: 'Generic agreement workflow' },
  { value: 'Residential Lease Agreement', label: 'Residential Lease Agreement', subtitle: 'Generic agreement workflow' },
  { value: 'Commercial Lease Agreement', label: 'Commercial Lease Agreement', subtitle: 'Commercial 22-month workflow' },
  { value: 'Leave and License Agreement', label: 'Leave and License Agreement', subtitle: 'Leave and License workflow' },
  { value: 'Corporate / Company Lease Agreement', label: 'Corporate / Company Lease Agreement', subtitle: 'Corporate 36-month workflow' },
  { value: 'Paying Guest (PG) Agreement', label: 'Paying Guest (PG) Agreement', subtitle: 'Generic agreement workflow' },
  { value: 'Shared Accommodation / Co-living Agreement', label: 'Shared Accommodation / Co-living Agreement', subtitle: 'Generic agreement workflow' },
  { value: 'Warehouse / Industrial Lease Agreement', label: 'Warehouse / Industrial Lease Agreement', subtitle: 'Generic agreement workflow' },
  { value: CUSTOM_AGREEMENT_TITLE, label: CUSTOM_AGREEMENT_TITLE, subtitle: 'Enter your own agreement title' }
]);

const TEMPLATE_TERM_BY_TITLE = Object.freeze({
  'Residential Rental Agreement': 'Residential 11M',
  'Commercial Lease Agreement': 'Commercial 22M',
  'Leave and License Agreement': 'Leave and License',
  'Corporate / Company Lease Agreement': 'Corporate 36M'
});

export const DEFAULT_TITLE_BY_TERM = Object.freeze({
  'Residential 11M': 'Residential Rental Agreement',
  'Commercial 22M': 'Commercial Lease Agreement',
  'Corporate 36M': 'Corporate / Company Lease Agreement',
  'Leave and License': 'Leave and License Agreement'
});

export function resolveAgreementTitleSelection(title) {
  return AGREEMENT_TITLE_OPTIONS.some((option) => option.value === title)
    ? title
    : CUSTOM_AGREEMENT_TITLE;
}

export function resolveAgreementTerm(title) {
  return TEMPLATE_TERM_BY_TITLE[title] || 'Commercial / Other Agreement';
}

export function usesGenericAgreementWorkflow(title) {
  return !TEMPLATE_TERM_BY_TITLE[title];
}

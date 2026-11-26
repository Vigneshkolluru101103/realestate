import { validateAgreementForm } from './agreementFormValidation.js';

export const AGREEMENT_TYPE_CONFIG = Object.freeze({
  'Residential 11M': Object.freeze({
    label: 'Residential rental agreement',
    requiredFields: ['title', 'term', 'landlord', 'tenant', 'address', 'rent', 'deposit']
  }),
  'Commercial 22M': Object.freeze({
    label: 'Commercial lease agreement',
    requiredFields: ['title', 'term', 'landlord', 'tenant', 'address', 'rent', 'deposit']
  }),
  'Corporate 36M': Object.freeze({
    label: 'Corporate tenancy agreement',
    requiredFields: ['title', 'term', 'landlord', 'tenant', 'address', 'rent', 'deposit']
  }),
  'Commercial / Other Agreement': Object.freeze({
    label: 'Commercial / Other agreement',
    requiredFields: ['title', 'term', 'landlord', 'tenant', 'address', 'rent', 'deposit']
  }),
  'Leave and License': Object.freeze({
    label: 'Leave and License agreement',
    requiredFields: ['title', 'term', 'landlord', 'tenant', 'address', 'rent', 'deposit']
  })
});

export const VALIDATION_STATUS = Object.freeze({
  PASSED: 'Passed',
  FAILED: 'Invalid',
  MISSING: 'Missing',
  NEEDS_REVIEW: 'Needs Review',
  NOT_APPLICABLE: 'Optional / N/A',
  NOT_VERIFIED: 'Not Verified'
});

export const FIELD_DEFINITIONS = Object.freeze([
  {
    key: 'title',
    label: 'Agreement title',
    category: 'Agreement details',
    requirement: 'Mandatory',
    ruleDescription: 'Must be at least 3 characters identifying the agreement document.'
  },
  {
    key: 'term',
    label: 'Agreement type',
    category: 'Document identification',
    requirement: 'Mandatory',
    ruleDescription: 'Must match a supported tenure (11M, 22M, 36M or Commercial).'
  },
  {
    key: 'referenceNumber',
    label: 'Reference number',
    category: 'Agreement details',
    requirement: 'Optional',
    optional: true,
    ruleDescription: 'Optional identifier for external broker / registry tracking.'
  },
  {
    key: 'landlord',
    label: 'Landlord / owner / lessor',
    category: 'Party information',
    requirement: 'Mandatory',
    ruleDescription: 'Identified lessor or owner full name (min 3 characters).'
  },
  {
    key: 'tenant',
    label: 'Tenant / lessee',
    category: 'Party information',
    requirement: 'Conditional',
    conditionalRule: 'Must be a distinct individual or entity differing from the landlord.',
    ruleDescription: 'Identified lessee or tenant full name (min 3 characters).'
  },
  {
    key: 'address',
    label: 'Property address',
    category: 'Property information',
    requirement: 'Mandatory',
    ruleDescription: 'Complete physical demised premises address (min 10 characters).'
  },
  {
    key: 'rent',
    label: 'Monthly rent',
    category: 'Financial details',
    requirement: 'Mandatory',
    ruleDescription: 'Numeric monthly consideration (minimum ₹1,000).'
  },
  {
    key: 'deposit',
    label: 'Security deposit',
    category: 'Financial details',
    requirement: 'Mandatory',
    ruleDescription: 'Numeric security deposit amount (minimum ₹1,000).'
  },
  {
    key: 'effectiveDate',
    label: 'Effective / commencement date',
    category: 'Dates and consistency',
    requirement: 'Optional',
    optional: true,
    ruleDescription: 'Lease commencement date in valid ISO format (YYYY-MM-DD).'
  },
  {
    key: 'expiryDate',
    label: 'Expiry date',
    category: 'Dates and consistency',
    requirement: 'Conditional',
    optional: true,
    conditionalRule: 'When an effective date is present, expiry date must fall on or after that date. Optional for open-ended leases.',
    ruleDescription: 'Lease termination date in valid ISO format (YYYY-MM-DD).'
  },
  {
    key: 'jurisdiction',
    label: 'Jurisdiction',
    category: 'Jurisdiction',
    requirement: 'Conditional',
    optional: true,
    conditionalRule: 'Determines applicable state treasury and statutory e-stamping authority (Karnataka NeSL/KAVERI, Maharashtra IGR, Telangana).',
    ruleDescription: 'State jurisdiction controlling stamp duty rates.'
  }
]);

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function fieldStatus(field, value, errors, requiredFields, reviewFlags) {
  const isRequired = field.requirement === 'Mandatory';
  const isConditional = field.requirement === 'Conditional';
  const classification = field.requirement;

  if (errors[field.key]) {
    const isInvalid = hasValue(value);
    return {
      status: isInvalid ? VALIDATION_STATUS.FAILED : VALIDATION_STATUS.MISSING,
      explanation: errors[field.key],
      classification,
      isInvalid,
      isMissing: !isInvalid
    };
  }

  if (!hasValue(value)) {
    return {
      status: isRequired ? VALIDATION_STATUS.MISSING : VALIDATION_STATUS.NOT_APPLICABLE,
      explanation: isRequired
        ? 'Required by the existing agreement form.'
        : isConditional
          ? (field.conditionalRule || 'Conditional field not present in document.')
          : 'Optional in the existing agreement model.',
      classification,
      isMissing: isRequired,
      isInvalid: false
    };
  }

  if (field.key === 'jurisdiction') {
    return {
      status: VALIDATION_STATUS.NEEDS_REVIEW,
      explanation: 'Detected or selected jurisdiction; statutory e-stamp compliance must be verified with state treasury authority.',
      classification: 'Needs Review',
      isNeedsReview: true
    };
  }

  if (reviewFlags.some((flag) => flag.toLowerCase().includes(field.key.toLowerCase()))) {
    return {
      status: VALIDATION_STATUS.NEEDS_REVIEW,
      explanation: 'The document contained missing or conflicting evidence for this field.',
      classification: 'Needs Review',
      isNeedsReview: true
    };
  }

  return {
    status: VALIDATION_STATUS.PASSED,
    explanation: isRequired
      ? 'Meets the existing frontend form rule.'
      : isConditional
        ? `Meets conditional requirement: ${field.conditionalRule}`
        : 'A value was extracted; review it against the source document.',
    classification,
    isPassed: true
  };
}

export function validateExtractedAgreement({
  fields = {},
  evidence = {},
  reviewFlags = [],
  file = {},
  selectedAgreementType = ''
} = {}) {
  const agreementType = AGREEMENT_TYPE_CONFIG[selectedAgreementType]
    ? selectedAgreementType
    : AGREEMENT_TYPE_CONFIG[fields.term]
      ? fields.term
      : 'Residential 11M';
  const config = AGREEMENT_TYPE_CONFIG[agreementType] || AGREEMENT_TYPE_CONFIG['Residential 11M'];
  const normalizedFields = { ...fields, term: agreementType };
  const errors = validateAgreementForm(normalizedFields);

  const fieldResults = FIELD_DEFINITIONS.map((field) => {
    if (field.key === 'term' && fields.term && fields.term !== agreementType) {
      return {
        ...field,
        status: VALIDATION_STATUS.NEEDS_REVIEW,
        explanation: `The document appears to be ${fields.term}, while ${agreementType} is selected.`,
        classification: 'Needs Review',
        value: agreementType,
        source: 'Selected by broker',
        evidence: evidence[field.key] || null,
        isNeedsReview: true
      };
    }
    const result = fieldStatus(
      field,
      normalizedFields[field.key],
      errors,
      config.requiredFields,
      reviewFlags
    );
    return {
      ...field,
      ...result,
      value: normalizedFields[field.key] || '',
      source: hasValue(normalizedFields[field.key]) ? 'Extracted' : 'Not found',
      evidence: evidence[field.key] || null
    };
  });

  const checks = [
    {
      category: 'Document integrity',
      label: 'PDF structure and readable content',
      status: VALIDATION_STATUS.PASSED,
      explanation: `${file.pageCount || 'Document'} page${file.pageCount === 1 ? '' : 's'} opened and selectable text was extracted.`
    },
    ...fieldResults.map((field) => ({
      category: field.category,
      label: field.label,
      status: field.status,
      explanation: field.explanation,
      requirement: field.requirement
    })),
    {
      category: 'Signatures and execution',
      label: 'Signature authenticity and identity',
      status: VALIDATION_STATUS.NOT_VERIFIED,
      explanation: 'The frontend can read signature-related text but cannot verify a handwritten or digital signature.'
    },
    {
      category: 'eStamp / eSign',
      label: 'eStamp and eSign verification',
      status: VALIDATION_STATUS.NOT_VERIFIED,
      explanation: 'No verification API contract is connected to this upload step.'
    }
  ];

  const counts = {
    total: checks.length,
    [VALIDATION_STATUS.PASSED]: checks.filter((c) => c.status === VALIDATION_STATUS.PASSED).length,
    [VALIDATION_STATUS.FAILED]: checks.filter((c) => c.status === VALIDATION_STATUS.FAILED).length,
    [VALIDATION_STATUS.MISSING]: checks.filter((c) => c.status === VALIDATION_STATUS.MISSING).length,
    [VALIDATION_STATUS.NEEDS_REVIEW]: checks.filter((c) => c.status === VALIDATION_STATUS.NEEDS_REVIEW).length,
    [VALIDATION_STATUS.NOT_APPLICABLE]: checks.filter((c) => c.status === VALIDATION_STATUS.NOT_APPLICABLE).length,
    [VALIDATION_STATUS.NOT_VERIFIED]: checks.filter((c) => c.status === VALIDATION_STATUS.NOT_VERIFIED).length
  };

  const missingFields = fieldResults.filter((f) => f.status === VALIDATION_STATUS.MISSING);
  const invalidFields = fieldResults.filter((f) => f.status === VALIDATION_STATUS.FAILED);
  const reviewFields = fieldResults.filter((f) => f.status === VALIDATION_STATUS.NEEDS_REVIEW);

  const hasBlockingIssue = missingFields.length > 0 || invalidFields.length > 0;
  const needsReview = reviewFields.length > 0;

  return {
    agreementType,
    agreementTypeLabel: config.label,
    outcome: hasBlockingIssue || needsReview ? 'NEEDS_REVIEW' : 'VALID',
    outcomeExplanation: hasBlockingIssue
      ? 'Complete missing information or correct invalid fields before proceeding.'
      : needsReview
        ? 'Frontend checks passed, but one or more extracted values require confirmation.'
        : 'All confirmed mandatory frontend checks pass. This is not a legal-validity determination.',
    fields: fieldResults,
    checks,
    counts,
    summary: {
      mandatoryCount: fieldResults.filter((f) => f.requirement === 'Mandatory').length,
      conditionalCount: fieldResults.filter((f) => f.requirement === 'Conditional').length,
      optionalCount: fieldResults.filter((f) => f.requirement === 'Optional').length,
      missingFields: missingFields.map((f) => f.label),
      invalidFields: invalidFields.map((f) => f.label),
      reviewFields: reviewFields.map((f) => f.label)
    },
    totalChecks: checks.length
  };
}

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  CircleHelp,
  Edit3,
  FileSearch,
  Filter,
  ShieldAlert,
  X
} from 'lucide-react';
import {
  VALIDATION_STATUS,
  validateExtractedAgreement
} from '../../../utils/agreementDocumentValidation';

const STATUS_CONFIG = {
  [VALIDATION_STATUS.PASSED]: { icon: CheckCircle2, className: 'is-passed', label: 'Passed' },
  [VALIDATION_STATUS.FAILED]: { icon: ShieldAlert, className: 'is-invalid', label: 'Invalid Information' },
  [VALIDATION_STATUS.MISSING]: { icon: AlertCircle, className: 'is-missing', label: 'Missing Information' },
  [VALIDATION_STATUS.NEEDS_REVIEW]: { icon: AlertTriangle, className: 'is-needs-review', label: 'Needs Review' },
  [VALIDATION_STATUS.NOT_APPLICABLE]: { icon: CircleHelp, className: 'is-optional', label: 'Optional / N/A' },
  [VALIDATION_STATUS.NOT_VERIFIED]: { icon: CircleHelp, className: 'is-not-verified', label: 'Not Verified' }
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { icon: CircleHelp, className: 'is-optional', label: status };
  const Icon = config.icon;
  return (
    <span className={`zd-validation-status ${config.className}`}>
      <Icon size={12} /> {config.label}
    </span>
  );
}

function RequirementBadge({ requirement }) {
  const reqClass = String(requirement || 'optional').toLowerCase();
  return (
    <span className={`zd-field-req-tag is-${reqClass}`}>
      {requirement}
    </span>
  );
}

export default function AgreementDocumentValidation({
  result,
  selectedAgreementType,
  onContinue,
  onReplace,
  onManualEntry
}) {
  const [currentFields, setCurrentFields] = useState(() => ({ ...result.fields }));
  const [editedFieldsSet, setEditedFieldsSet] = useState(new Set());
  const [editingFieldKey, setEditingFieldKey] = useState(null);
  const [tempEditValue, setTempEditValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'MANDATORY' | 'CONDITIONAL' | 'OPTIONAL' | 'ISSUES'

  const validation = useMemo(() => validateExtractedAgreement({
    ...result,
    fields: currentFields,
    selectedAgreementType
  }), [result, currentFields, selectedAgreementType]);

  const groupedChecks = useMemo(() => {
    return validation.checks.reduce((groups, check) => {
      if (!groups[check.category]) groups[check.category] = [];
      groups[check.category].push(check);
      return groups;
    }, {});
  }, [validation.checks]);

  function startEdit(field) {
    setEditingFieldKey(field.key);
    setTempEditValue(currentFields[field.key] || '');
  }

  function saveEdit(fieldKey) {
    setCurrentFields((prev) => ({ ...prev, [fieldKey]: tempEditValue }));
    setEditedFieldsSet((prev) => new Set([...prev, fieldKey]));
    setEditingFieldKey(null);
  }

  function cancelEdit() {
    setEditingFieldKey(null);
    setTempEditValue('');
  }

  function handleProceed() {
    onContinue({
      ...currentFields,
      _editedFields: Array.from(editedFieldsSet)
    });
  }

  // Filter fields based on user selection
  const filteredFields = useMemo(() => {
    return validation.fields.filter((field) => {
      if (activeFilter === 'MANDATORY') return field.requirement === 'Mandatory';
      if (activeFilter === 'CONDITIONAL') return field.requirement === 'Conditional';
      if (activeFilter === 'OPTIONAL') return field.requirement === 'Optional';
      if (activeFilter === 'ISSUES') {
        return (
          field.status === VALIDATION_STATUS.FAILED ||
          field.status === VALIDATION_STATUS.MISSING ||
          field.status === VALIDATION_STATUS.NEEDS_REVIEW
        );
      }
      return true;
    });
  }, [validation.fields, activeFilter]);

  const issueCount =
    (validation.counts[VALIDATION_STATUS.FAILED] || 0) +
    (validation.counts[VALIDATION_STATUS.MISSING] || 0) +
    (validation.counts[VALIDATION_STATUS.NEEDS_REVIEW] || 0);

  return (
    <section className="zd-validation" aria-labelledby="agreement-validation-title">
      {/* 1. Overall Validation Outcome Banner */}
      <div className={`zd-validation-outcome is-${validation.outcome.toLowerCase()}`}>
        <div>
          <span className="zd-validation-eyebrow">Frontend validation result</span>
          <h3 id="agreement-validation-title">
            {validation.outcome === 'VALID' ? 'Ready for broker review' : 'Needs review before continuing'}
          </h3>
          <p>{validation.outcomeExplanation}</p>
        </div>
        <span className="zd-validation-type">{validation.agreementTypeLabel}</span>
      </div>

      {/* 2. Structured Summary Metrics (6 Cards) */}
      <div className="zd-validation-summary" aria-label="Validation check summary">
        <div>
          <strong>{validation.totalChecks}</strong>
          <span>Total checks</span>
        </div>
        <div className="is-passed">
          <strong>{validation.counts[VALIDATION_STATUS.PASSED] || 0}</strong>
          <span>Passed</span>
        </div>
        <div className="is-missing">
          <strong>{validation.counts[VALIDATION_STATUS.MISSING] || 0}</strong>
          <span>Missing info</span>
        </div>
        <div className="is-failed">
          <strong>{validation.counts[VALIDATION_STATUS.FAILED] || 0}</strong>
          <span>Invalid info</span>
        </div>
        <div className="is-review">
          <strong>{validation.counts[VALIDATION_STATUS.NEEDS_REVIEW] || 0}</strong>
          <span>Needs review</span>
        </div>
        <div className="is-not-verified">
          <strong>{validation.counts[VALIDATION_STATUS.NOT_VERIFIED] || 0}</strong>
          <span>Not verified</span>
        </div>
      </div>

      {/* 3. Extracted Information & Field Validation Section */}
      <div className="zd-validation-section">
        <div className="zd-validation-section__heading">
          <FileSearch size={18} />
          <div style={{ flex: 1 }}>
            <strong>Extracted information &amp; field rules</strong>
            <span>Review, verify, or correct field values inline before finalizing the agreement.</span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="zd-validation-filter-bar" role="tablist" aria-label="Filter agreement fields">
          <button
            type="button"
            className={`zd-filter-pill ${activeFilter === 'ALL' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Fields ({validation.fields.length})
          </button>
          <button
            type="button"
            className={`zd-filter-pill ${activeFilter === 'MANDATORY' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('MANDATORY')}
          >
            Required / Mandatory ({validation.summary.mandatoryCount})
          </button>
          <button
            type="button"
            className={`zd-filter-pill ${activeFilter === 'CONDITIONAL' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('CONDITIONAL')}
          >
            Conditional ({validation.summary.conditionalCount})
          </button>
          <button
            type="button"
            className={`zd-filter-pill ${activeFilter === 'OPTIONAL' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('OPTIONAL')}
          >
            Optional ({validation.summary.optionalCount})
          </button>
          <button
            type="button"
            className={`zd-filter-pill is-attention ${activeFilter === 'ISSUES' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('ISSUES')}
          >
            Attention Needed ({issueCount})
          </button>
        </div>

        {/* Field Cards Grid */}
        <div className="zd-validation-fields">
          {filteredFields.map((field) => {
            const isEditing = editingFieldKey === field.key;
            const wasEdited = editedFieldsSet.has(field.key);

            return (
              <article
                className={`zd-validation-field ${field.status === VALIDATION_STATUS.FAILED ? 'has-error' : ''} ${field.status === VALIDATION_STATUS.MISSING ? 'has-missing' : ''}`}
                key={field.key}
              >
                <div className="zd-validation-field__top">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{field.label}</strong>
                      <RequirementBadge requirement={field.requirement} />
                      {wasEdited && <span className="zd-field-edited-tag">Edited</span>}
                    </div>
                    <small>{field.category} · {field.source}</small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={field.status} />
                    {!isEditing && (
                      <button
                        type="button"
                        className="zd-btn-inline-edit"
                        title={`Correct ${field.label}`}
                        onClick={() => startEdit(field)}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Field Value Display or Inline Edit Form */}
                {isEditing ? (
                  <div className="zd-inline-edit-box">
                    <input
                      type="text"
                      className="zd-inline-edit-input"
                      value={tempEditValue}
                      placeholder={`Enter ${field.label}`}
                      autoFocus
                      onChange={(e) => setTempEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(field.key);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <div className="zd-inline-edit-actions">
                      <button
                        type="button"
                        className="zd-btn-inline-save"
                        title="Save correction"
                        onClick={() => saveEdit(field.key)}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        className="zd-btn-inline-cancel"
                        title="Cancel"
                        onClick={cancelEdit}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`zd-field-value-text ${!field.value ? 'is-empty' : ''}`}>
                    {field.value || 'Not found in document'}
                  </p>
                )}

                {/* Explanation / Rule Feedback */}
                <span className="zd-field-explanation">{field.explanation}</span>

                {/* Conditional Rule Description if applicable */}
                {field.conditionalRule && (
                  <small className="zd-field-conditional-rule">
                    Condition: {field.conditionalRule}
                  </small>
                )}

                {/* Source Document Evidence */}
                {field.evidence && (
                  <small className="zd-validation-evidence">
                    Page {field.evidence.pageNumber}: “{field.evidence.excerpt}”
                  </small>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* 4. Automated Validation Checks Grouped by Category */}
      <div className="zd-validation-section">
        <div className="zd-validation-section__heading">
          <ShieldAlert size={18} />
          <div>
            <strong>Compliance and integrity checks</strong>
            <span>Automated checks enforce project data models and highlight items needing manual review.</span>
          </div>
        </div>
        <div className="zd-validation-checks">
          {Object.entries(groupedChecks).map(([category, checks]) => (
            <div className="zd-validation-check" key={category}>
              <strong>{category}</strong>
              {checks.map((check) => (
                <div key={`${category}-${check.label}`}>
                  <div>
                    <span>{check.label}</span>
                    <small>{check.explanation}</small>
                  </div>
                  <StatusBadge status={check.status} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Original Extracted Text Viewer */}
      <details className="zd-validation-original-text">
        <summary>View original extracted text</summary>
        <pre>{result.extractedText || 'No extracted text is available.'}</pre>
      </details>

      {/* 6. Action Footer */}
      <div className="zd-gen-modal-footer zd-validation-actions">
        <button type="button" className="zd-gen-btn zd-gen-btn--outline" onClick={onManualEntry}>
          Enter Manually
        </button>
        <button type="button" className="zd-gen-btn zd-gen-btn--outline" onClick={onReplace}>
          Replace Document
        </button>
        <button type="button" className="zd-gen-btn zd-gen-btn--primary" onClick={handleProceed}>
          Review &amp; Correct Fields →
        </button>
      </div>
    </section>
  );
}

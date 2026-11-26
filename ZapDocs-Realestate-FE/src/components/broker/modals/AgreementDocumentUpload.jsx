import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, FileText, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import {
  MAX_AGREEMENT_FILE_SIZE,
  processAgreementDocument
} from '../../../utils/agreementDocumentProcessor';
import { AGREEMENT_TYPE_CONFIG } from '../../../utils/agreementDocumentValidation';
import AgreementDocumentValidation from './AgreementDocumentValidation';

const MANUAL_FALLBACK_CODES = new Set(['NO_TEXT', 'UNRELATED', 'EXTRACTION_FAILED', 'UNSUPPORTED_PDF']);
const ERROR_TITLES = {
  PASSWORD_PROTECTED: 'Password required',
  CORRUPT: 'Damaged or invalid document',
  MISMATCH: 'File type does not match',
  UNSUPPORTED: 'Unsupported file format',
  UNSUPPORTED_PDF: 'Unsupported PDF feature',
  NO_TEXT: 'No selectable text found',
  EXTRACTION_FAILED: 'Text extraction failed',
  UNRELATED: 'Agreement content not identified',
  OVERSIZED: 'File is too large',
  MISSING: 'Choose a document'
};

export default function AgreementDocumentUpload({
  agreementType,
  onAgreementTypeChange,
  onBack,
  onManualEntry,
  onPrefill
}) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!selectedFile || !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function selectFile(file) {
    setSelectedFile(file || null);
    setError(null);
    setResult(null);
    setProgress(file ? 15 : 0);
  }

  function removeFile() {
    selectFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleProcess() {
    if (!selectedFile) {
      setError({ code: 'MISSING', message: 'Select a PDF or DOCX agreement to continue.' });
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(40);
    try {
      const processed = await processAgreementDocument(selectedFile);
      setProgress(100);
      setResult(processed);
    } catch (processingError) {
      setProgress(0);
      setError({
        code: processingError?.code || 'EXTRACTION_FAILED',
        message: processingError?.message || 'The document could not be processed.'
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function continueWithExtractedFields(updatedFields) {
    const fieldsToUse = updatedFields || result.fields || {};
    const extractedType = fieldsToUse.term;
    const typeConflict = extractedType && agreementType && extractedType !== agreementType;
    onPrefill({
      ...result,
      fields: { ...fieldsToUse, term: agreementType || extractedType },
      reviewFlags: typeConflict
        ? [`The document appears to be ${extractedType}, but ${agreementType} was selected. Confirm the agreement type.`, ...result.reviewFlags]
        : result.reviewFlags
    });
  }

  return (
    <div className="zd-upload-panel" id="agreement-upload-panel">
      <button type="button" className="zd-upload-back" onClick={onBack}>
        <ArrowLeft size={14} /> Back to options
      </button>

      <div className="zd-upload-heading">
        <div className="zd-upload-icon"><Upload size={20} /></div>
        <div>
          <h3>Upload PDF or DOCX</h3>
          <p>Choose the existing agreement type, extract selectable text, then review every value before saving.</p>
        </div>
      </div>

      <div className="zd-upload-type">
        <label htmlFor="upload-agreement-type">Agreement type</label>
        <select
          id="upload-agreement-type"
          value={agreementType}
          onChange={(event) => onAgreementTypeChange(event.target.value)}
        >
          {Object.entries(AGREEMENT_TYPE_CONFIG).map(([value, config]) => (
            <option value={value} key={value}>{config.label}</option>
          ))}
        </select>
        <small>Validation uses the existing rules configured for this type.</small>
      </div>

      {!result && (
        <>
          <button
            type="button"
            className={`zd-upload-dropzone ${selectedFile ? 'has-file' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectFile(event.dataTransfer.files?.[0] || null);
            }}
          >
            <FileText size={28} />
            <strong>{selectedFile ? selectedFile.name : 'Drop an agreement here or browse files'}</strong>
            <span>
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                : `PDF or DOCX only · Maximum ${MAX_AGREEMENT_FILE_SIZE / 1024 / 1024} MB`}
            </span>
          </button>
          <input
            ref={inputRef}
            id="agreement-document-input"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onChange={(event) => selectFile(event.target.files?.[0] || null)}
          />

          {selectedFile && (
            <div className="zd-upload-file-card">
              <div><FileText size={18} /><span><strong>{selectedFile.name}</strong><small>{(selectedFile.size / 1024).toFixed(1)} KB · Ready to process</small></span></div>
              <div>
                <button type="button" onClick={() => inputRef.current?.click()}><RefreshCw size={14} /> Replace</button>
                <button type="button" onClick={removeFile}><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="zd-upload-preview">
              <div><strong>PDF preview</strong><span>Previewed locally in your browser</span></div>
              <object data={previewUrl} type="application/pdf" aria-label={`Preview of ${selectedFile.name}`}>
                <p>Preview is unavailable in this browser. The document can still be processed.</p>
              </object>
            </div>
          )}

          {(progress > 0 || isProcessing) && (
            <div className="zd-upload-progress" aria-live="polite">
              <div><span>{isProcessing ? 'Extracting selectable text…' : progress === 100 ? 'Processing complete' : 'Document selected'}</span><strong>{progress}%</strong></div>
              <progress max="100" value={progress}>{progress}%</progress>
            </div>
          )}

          {error && (
            <div className="zd-upload-error" role="alert" id={`agreement-upload-error-${error.code.toLowerCase()}`}>
              <AlertTriangle size={17} />
              <div>
                <strong>{ERROR_TITLES[error.code] || 'Document could not be processed'}</strong>
                <span>{error.message}</span>
                {MANUAL_FALLBACK_CODES.has(error.code) && (
                  <button type="button" onClick={onManualEntry}>Enter details manually</button>
                )}
              </div>
            </div>
          )}

          <div className="zd-gen-modal-footer zd-upload-footer">
            <button type="button" className="zd-gen-btn zd-gen-btn--outline" onClick={onManualEntry}>
              Enter Manually Instead
            </button>
            <button
              type="button"
              className="zd-gen-btn zd-gen-btn--primary"
              id="btn-process-agreement-upload"
              disabled={isProcessing}
              onClick={handleProcess}
            >
              {isProcessing ? <><Loader2 size={15} className="spin" /> Reading document...</> : 'Extract & Validate'}
            </button>
          </div>
        </>
      )}

      {result && (
        <>
          <div className="zd-upload-result-file">
            <FileText size={18} />
            <span><strong>{result.file.name}</strong><small>{(result.file.size / 1024).toFixed(1)} KB{result.file.pageCount ? ` · ${result.file.pageCount} pages` : ''}</small></span>
          </div>
          <AgreementDocumentValidation
            result={result}
            selectedAgreementType={agreementType}
            onContinue={continueWithExtractedFields}
            onReplace={() => { setResult(null); setProgress(15); inputRef.current?.click(); }}
            onManualEntry={onManualEntry}
          />
        </>
      )}
    </div>
  );
}

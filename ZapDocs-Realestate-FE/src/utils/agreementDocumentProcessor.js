export const MAX_AGREEMENT_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_AGREEMENT_EXTENSIONS = Object.freeze(['pdf', 'docx']);

export class AgreementDocumentError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AgreementDocumentError';
    this.code = code;
  }
}

function getExtension(filename = '') {
  const match = String(filename).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : '';
}

function startsWith(bytes, signature) {
  return signature.every((value, index) => bytes[index] === value);
}

let pdfJsModulePromise;

async function loadPdfJs() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = (async () => {
      const pdfJs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      if (typeof window !== 'undefined') {
        const worker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
        pdfJs.GlobalWorkerOptions.workerSrc = worker.default;
      }
      return pdfJs;
    })();
  }
  return pdfJsModulePromise;
}

function joinPdfLine(items) {
  const sortedItems = [...items].sort((left, right) => left.x - right.x);
  let line = '';
  let previousEnd = null;

  sortedItems.forEach((item) => {
    const value = item.text.trim();
    if (!value) return;

    if (previousEnd !== null) {
      const gap = item.x - previousEnd;
      if (gap > 12) line += '\t';
      else if (!/\s$/.test(line) && !/^[,.;:!?)]/.test(value)) line += ' ';
    }

    line += value;
    previousEnd = item.x + item.width;
  });

  return line.trim();
}

function textItemsToLines(items) {
  const lines = [];

  items.forEach((item) => {
    if (!item || typeof item.str !== 'string' || !item.str.trim()) return;
    const x = Number(item.transform?.[4]) || 0;
    const y = Number(item.transform?.[5]) || 0;
    let line = lines.find((candidate) => Math.abs(candidate.y - y) <= 1.5);
    if (!line) {
      line = { y, items: [] };
      lines.push(line);
    }
    line.items.push({ text: item.str, x, width: Number(item.width) || 0 });
  });

  return lines
    .sort((left, right) => right.y - left.y)
    .map((line) => joinPdfLine(line.items))
    .filter(Boolean)
    .join('\n');
}

export function classifyPdfExtractionError(error) {
  if (error instanceof AgreementDocumentError) return error;

  const name = String(error?.name || '');
  const message = String(error?.message || '');
  if (name === 'PasswordException') {
    return new AgreementDocumentError(
      'PASSWORD_PROTECTED',
      'This PDF is password-protected. Remove the password and upload the document again.'
    );
  }
  if (name === 'InvalidPDFException' || name === 'ResponseException') {
    return new AgreementDocumentError(
      'CORRUPT',
      'The PDF is damaged, incomplete, or not a valid PDF document.'
    );
  }
  if (/unsupported|not supported|unknown filter|not implemented/i.test(message)) {
    return new AgreementDocumentError(
      'UNSUPPORTED_PDF',
      'The PDF uses a feature this browser cannot process. Export it as a standard PDF and try again.'
    );
  }
  return new AgreementDocumentError(
    'EXTRACTION_FAILED',
    'The PDF opened, but its selectable text could not be extracted because of an unexpected processing error. Try exporting it again or enter the details manually.'
  );
}

async function extractPdfDocumentText(bytes) {
  let loadingTask;
  try {
    const pdfJs = await loadPdfJs();
    loadingTask = pdfJs.getDocument({
      data: bytes,
      isEvalSupported: false,
      stopAtErrors: false,
      verbosity: 0
    });
    const document = await loadingTask.promise;
    if (!document.numPages || document.numPages < 1) {
      throw new AgreementDocumentError(
        'CORRUPT',
        'The PDF document contains no pages or is empty.'
      );
    }
    const pages = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      try {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(textItemsToLines(content.items));
        page.cleanup();
      } catch (error) {
        const classified = classifyPdfExtractionError(error);
        if (classified.code === 'EXTRACTION_FAILED') {
          classified.message = `Page ${pageNumber} could not be read. ${classified.message}`;
        }
        throw classified;
      }
    }

    return {
      text: pages.filter(Boolean).join('\n\n').trim(),
      pages,
      pageCount: document.numPages
    };
  } catch (error) {
    throw classifyPdfExtractionError(error);
  } finally {
    try {
      await loadingTask?.destroy();
    } catch {
      // Cleanup must not replace the document-processing result.
    }
  }
}

export async function extractPdfSelectableText(bytes) {
  const result = await extractPdfDocumentText(bytes);
  return result.text;
}

function findEndOfCentralDirectory(view) {
  const minimumOffset = Math.max(0, view.byteLength - 65557);
  for (let offset = view.byteLength - 22; offset >= minimumOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) return offset;
  }
  return -1;
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') {
    throw new AgreementDocumentError('CORRUPT', 'This DOCX compression method is not supported by this browser.');
  }
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    throw new AgreementDocumentError('CORRUPT', 'The DOCX package is corrupt and could not be decompressed.');
  }
}

async function readZipEntry(bytes, targetName) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEndOfCentralDirectory(view);
  if (eocd < 0) {
    throw new AgreementDocumentError('CORRUPT', 'The DOCX package is corrupt or incomplete.');
  }

  const entryCount = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const compressionMethod = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = new TextDecoder().decode(bytes.slice(offset + 46, offset + 46 + nameLength));

    if (name === targetName) {
      if (view.getUint32(localOffset, true) !== 0x04034b50) {
        throw new AgreementDocumentError('CORRUPT', 'The DOCX package contains an invalid document entry.');
      }
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      if (compressionMethod === 0) return compressed;
      if (compressionMethod === 8) return inflateRaw(compressed);
      throw new AgreementDocumentError('CORRUPT', 'The DOCX uses an unsupported compression method.');
    }

    offset += 46 + nameLength + extraLength + commentLength;
  }

  return null;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

async function extractDocxText(bytes) {
  const xmlBytes = await readZipEntry(bytes, 'word/document.xml');
  if (!xmlBytes) {
    throw new AgreementDocumentError('CORRUPT', 'The DOCX does not contain a readable Word document body.');
  }

  const xml = new TextDecoder().decode(xmlBytes);
  return decodeXmlEntities(
    xml
      .replace(/<w:tab\s*\/>/g, '\t')
      .replace(/<w:br\s*\/>/g, '\n')
      .replace(/<\/w:tc>/g, '\t')
      .replace(/<\/w:tr>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

function normalizeDate(value) {
  const raw = String(value || '').trim().replace(/,/g, '');
  let match = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;

  match = raw.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/);
  if (match) {
    return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  }

  match = raw.match(/\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i);
  if (match) {
    const month = String(
      ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(match[2].toLowerCase()) + 1
    ).padStart(2, '0');
    return `${match[3]}-${month}-${match[1].padStart(2, '0')}`;
  }
  return '';
}

function collectLabeledValues(text, labels, valuePattern = '[^\\n|]{2,120}') {
  const pattern = new RegExp(`(?:^|\\n)\\s*(?:${labels})\\s*(?:[:-]|\\t)\\s*(${valuePattern})`, 'gim');
  const values = [];
  let match;
  while ((match = pattern.exec(text))) {
    const value = match[1].trim().replace(/\s+/g, ' ');
    const placeholderRemainder = value
      .replace(/\b(?:address|name|date|signature)\s*:/gi, '')
      .replace(/[_\s.\t-]/g, '');
    if (
      value &&
      placeholderRemainder &&
      !values.some((item) => item.toLowerCase() === value.toLowerCase())
    ) {
      values.push(value);
    }
  }
  return values;
}

function selectUnambiguous(values, fieldLabel, reviewFlags) {
  if (values.length === 1) return values[0];
  if (values.length > 1) reviewFlags.push(`${fieldLabel} has conflicting values and was left blank.`);
  return '';
}

function extractAmount(value) {
  const match = String(value || '').replace(/,/g, '').match(/(?:₹|rs\.?|inr)?\s*(\d{3,})/i);
  return match ? match[1] : '';
}

function extractContextDate(text, contextPattern) {
  const datePattern = '(\\d{4}-\\d{2}-\\d{2}|\\d{1,2}[/.-]\\d{1,2}[/.-]\\d{4}|\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4})';
  const match = String(text || '').match(new RegExp(`(?:${contextPattern})\\s+${datePattern}`, 'i'));
  return normalizeDate(match?.[1] || '');
}

function extractPartyTableValues(text) {
  const lines = String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (let index = 0; index < lines.length - 1; index += 1) {
    const headers = lines[index].split(/\t+/).map((cell) => cell.trim());
    const landlordIndex = headers.findIndex((cell) => /^(?:landlord|lessor|owner|licensor)$/i.test(cell));
    const tenantIndex = headers.findIndex((cell) => /^(?:tenant|lessee|licensee)$/i.test(cell));
    if (landlordIndex < 0 || tenantIndex < 0) continue;

    const values = lines[index + 1].split(/\t+/).map((cell) => cell.trim());
    const landlord = values[landlordIndex] || '';
    const tenant = values[tenantIndex] || '';
    if (landlord.length >= 3 && tenant.length >= 3) return { landlord, tenant };
  }

  return { landlord: '', tenant: '' };
}

function normalizeEvidenceValue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildFieldEvidence(fields, pages) {
  if (!Array.isArray(pages) || !pages.length) return {};
  const evidence = {};

  Object.entries(fields).forEach(([field, value]) => {
    if (!value || field === 'term' || field === 'jurisdiction') return;
    const normalizedValue = normalizeEvidenceValue(value);
    if (!normalizedValue) return;
    const numericValue = ['rent', 'deposit'].includes(field) ? String(value).replace(/\D/g, '') : '';

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
      const lines = String(pages[pageIndex] || '').split(/\r?\n/);
      const matchingLine = lines.find((line) => {
        const normalizedLine = normalizeEvidenceValue(line);
        return normalizedLine.includes(normalizedValue) ||
          (numericValue && normalizedLine.replace(/\D/g, '').includes(numericValue));
      });
      if (matchingLine) {
        evidence[field] = {
          pageNumber: pageIndex + 1,
          excerpt: matchingLine.trim().slice(0, 220)
        };
        break;
      }
    }
  });

  return evidence;
}

export function mapAgreementTextToFields(text) {
  const readableText = String(text || '').split(String.fromCharCode(0)).join('').trim();
  const reviewFlags = [];
  const tableParties = extractPartyTableValues(readableText);
  const landlordValues = [
    tableParties.landlord,
    ...collectLabeledValues(readableText, 'landlord|lessor|owner|licensor')
  ].filter((value) => value && !/^(?:tenant|lessee|licensee)$/i.test(value));
  const tenantValues = [
    tableParties.tenant,
    ...collectLabeledValues(readableText, 'tenant|lessee|licensee')
  ].filter(Boolean);
  const hasAgreementTerms = /\b(?:rental|lease|tenancy|agreement|contract|license)\b/i.test(readableText);
  const hasExecutionDetails = /\b(?:effective date|commencement date|execution date|monthly rent|security deposit|term)\b/i.test(readableText);

  if (!hasAgreementTerms || (!landlordValues.length && !tenantValues.length) || !hasExecutionDetails) {
    throw new AgreementDocumentError(
      'UNRELATED',
      'Readable text was found, but it does not contain enough identifiable agreement content. Include named parties plus agreement terms or execution details.'
    );
  }

  const titleLine = readableText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /\b(?:agreement|lease|contract)\b/i.test(line) && line.length >= 5 && line.length <= 100);
  const referenceValues = collectLabeledValues(readableText, 'agreement (?:reference|ref(?:erence)?(?: number| no[.]?)?)|reference (?:number|no[.]?)|document reference');
  const addressValues = collectLabeledValues(readableText, 'property (?:address|location)|premises|demised premises|address');
  const rentValues = collectLabeledValues(readableText, 'monthly rent|rent amount|rent');
  const depositValues = collectLabeledValues(readableText, 'security deposit|deposit amount|deposit');
  const effectiveValues = collectLabeledValues(readableText, 'effective date|commencement date|lease start date|start date');
  const expiryValues = collectLabeledValues(readableText, 'expiry date|expiration date|lease end date|end date');
  const effectiveDate = normalizeDate(selectUnambiguous(effectiveValues, 'Effective date', reviewFlags)) ||
    extractContextDate(readableText, '(?:tenancy|lease)\\s+(?:begins|commences|starts)\\s+on');
  const expiryDate = normalizeDate(selectUnambiguous(expiryValues, 'Expiry date', reviewFlags)) ||
    extractContextDate(readableText, '(?:ending|expiring|terminating)\\s+on');

  const fields = {
    title: titleLine || '',
    referenceNumber: selectUnambiguous(referenceValues, 'Reference number', reviewFlags),
    landlord: selectUnambiguous(landlordValues, 'Landlord', reviewFlags),
    tenant: selectUnambiguous(tenantValues, 'Tenant', reviewFlags),
    address: selectUnambiguous(addressValues, 'Property address', reviewFlags),
    rent: extractAmount(selectUnambiguous(rentValues, 'Monthly rent', reviewFlags)),
    deposit: extractAmount(selectUnambiguous(depositValues, 'Security deposit', reviewFlags)),
    effectiveDate,
    expiryDate
  };

  if (/\bcommercial\b/i.test(readableText)) fields.term = 'Commercial 22M';
  else if (/\bcorporate\b/i.test(readableText)) fields.term = 'Corporate 36M';
  else if (/\b(?:residential|rental|tenancy|leave and license)\b/i.test(readableText)) fields.term = 'Residential 11M';

  const jurisdictionText = fields.address || readableText;
  if (/\bmaharashtra\b/i.test(jurisdictionText)) fields.jurisdiction = 'Maharashtra';
  else if (/\btelangana\b/i.test(jurisdictionText)) fields.jurisdiction = 'Telangana';
  else if (/\bkarnataka\b|\bbengaluru\b|\bbangalore\b/i.test(jurisdictionText)) fields.jurisdiction = 'Karnataka';

  const extractedFieldNames = Object.keys(fields).filter((key) => fields[key]);
  const expectedFields = ['title', 'landlord', 'tenant', 'address', 'rent', 'deposit', 'effectiveDate', 'expiryDate'];
  const missingFields = expectedFields.filter((key) => !fields[key]);
  if (missingFields.length) reviewFlags.push(`Review and complete: ${missingFields.join(', ')}.`);

  return { fields, reviewFlags, extractedFieldNames };
}

export async function processAgreementDocument(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new AgreementDocumentError('CORRUPT', 'Select a valid PDF or DOCX file.');
  }

  const extension = getExtension(file.name);
  if (!ACCEPTED_AGREEMENT_EXTENSIONS.includes(extension)) {
    throw new AgreementDocumentError('UNSUPPORTED', 'Unsupported file type. Upload a PDF or DOCX document only.');
  }
  if (file.size > MAX_AGREEMENT_FILE_SIZE) {
    throw new AgreementDocumentError('OVERSIZED', 'The selected file exceeds the 10 MB upload limit.');
  }
  if (file.size < 8) {
    throw new AgreementDocumentError('CORRUPT', 'The selected document is empty or corrupt.');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const isPdf = startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  const isZip = startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]);
  const isEncryptedOffice = startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

  if (extension === 'pdf' && !isPdf) {
    throw new AgreementDocumentError('MISMATCH', 'The file is named as a PDF, but its contents are not a valid PDF.');
  }
  if (extension === 'docx' && isEncryptedOffice) {
    throw new AgreementDocumentError(
      'PASSWORD_PROTECTED',
      'Password-protected DOCX files are not supported. Remove the password and upload the document again.'
    );
  }
  if (extension === 'docx' && !isZip) {
    throw new AgreementDocumentError('MISMATCH', 'The file is named as a DOCX, but its contents are not a valid DOCX package.');
  }

  const extraction = extension === 'pdf'
    ? await extractPdfDocumentText(bytes)
    : { text: await extractDocxText(bytes), pages: [], pageCount: null };
  const text = extraction.text;
  const usableText = text.replace(/\s+/g, ' ').trim();
  if (!usableText) {
    throw new AgreementDocumentError(
      'NO_TEXT',
      extension === 'pdf'
        ? 'The PDF opened successfully, but it contains no selectable text. It may be scanned or image-only. OCR is not configured, so enter the agreement manually.'
        : 'No usable agreement text could be extracted from this DOCX. Enter the agreement manually.'
    );
  }

  const mapped = mapAgreementTextToFields(text);
  return {
    ...mapped,
    extractedText: text,
    pageTexts: extraction.pages,
    evidence: buildFieldEvidence(mapped.fields, extraction.pages),
    file: {
      name: file.name,
      size: file.size,
      format: extension.toUpperCase(),
      pageCount: extraction.pageCount
    }
  };
}

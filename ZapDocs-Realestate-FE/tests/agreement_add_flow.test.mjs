import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync, deflateSync } from 'node:zlib';
import {
  MAX_AGREEMENT_FILE_SIZE,
  classifyPdfExtractionError,
  mapAgreementTextToFields,
  processAgreementDocument
} from '../src/utils/agreementDocumentProcessor.js';
import { validateAgreementForm } from '../src/utils/agreementFormValidation.js';
import { createTextPdfBytes } from '../src/utils/pdfGenerator.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const modalSource = fs.readFileSync(
  path.join(dirname, '..', 'src', 'components', 'broker', 'modals', 'AgreementCreationModal.jsx'),
  'utf8'
);
const screenSource = fs.readFileSync(
  path.join(dirname, '..', 'src', 'screens', 'MyAgreements', 'MyAgreementsScreen.jsx'),
  'utf8'
);

function fileLike(name, bytes, type = '') {
  return {
    name,
    type,
    size: bytes.length,
    async arrayBuffer() {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    }
  };
}

function concatBytes(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(size);
  let offset = 0;
  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });
  return result;
}

function buildPdf(objects) {
  const encoder = new TextEncoder();
  let pdf = '%PDF-1.4\n%PDFTEST\n';
  const offsets = [];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const startxref = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return encoder.encode(pdf);
}

function pdfStream(content, dictionary = '') {
  const length = new TextEncoder().encode(content).length;
  return `<< /Length ${length}${dictionary ? ` ${dictionary}` : ''} >>\nstream\n${content}\nendstream`;
}

function ascii85Encode(bytes) {
  let result = '';
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const remaining = Math.min(4, bytes.length - offset);
    let value = 0;
    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (index < remaining ? bytes[offset + index] : 0);
    }
    if (remaining === 4 && value === 0) {
      result += 'z';
      continue;
    }
    const encoded = new Array(5);
    for (let index = 4; index >= 0; index -= 1) {
      encoded[index] = String.fromCharCode((value % 85) + 33);
      value = Math.floor(value / 85);
    }
    result += encoded.slice(0, remaining + 1).join('');
  }
  return `${result}~>`;
}

function createChainedFilterPdf() {
  const content = [
    'BT /F1 16 Tf 50 760 Td (RESIDENTIAL RENTAL AGREEMENT) Tj ET',
    'BT /F1 11 Tf 50 730 Td (Landlord: Ananya Rao) Tj ET',
    'BT /F1 11 Tf 50 710 Td (Tenant: Arjun Mehta) Tj ET',
    'BT /F1 11 Tf 50 690 Td (Property Address: Flat 304 Lake View Road Bengaluru Karnataka) Tj ET',
    'BT /F1 11 Tf 50 670 Td (Monthly Rent: Rs. 25000) Tj ET',
    'BT /F1 11 Tf 50 650 Td (Security Deposit: Rs. 75000) Tj ET',
    'BT /F1 11 Tf 50 630 Td (Effective Date: 1 December 2026) Tj ET'
  ].join('\n');
  const encoded = ascii85Encode(new Uint8Array(deflateSync(new TextEncoder().encode(content))));
  return buildPdf([
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    pdfStream(encoded, '/Filter [/ASCII85Decode /FlateDecode]')
  ]);
}

function createMultiPagePdf() {
  const firstPage = [
    'BT /F1 16 Tf 50 760 Td (COMMERCIAL LEASE AGREEMENT) Tj ET',
    'BT /F1 11 Tf 50 730 Td (Landlord: Brigade Ventures) Tj ET',
    'BT /F1 11 Tf 50 710 Td (Tenant: TechWave Solutions) Tj ET'
  ].join('\n');
  const secondPage = [
    'BT /F1 11 Tf 50 760 Td (Property Address: Unit 304 Whitefield Bengaluru Karnataka) Tj ET',
    'BT /F1 11 Tf 50 740 Td (Monthly Rent: INR 85000) Tj ET',
    'BT /F1 11 Tf 50 720 Td (Security Deposit: INR 510000) Tj ET',
    'BT /F1 11 Tf 50 700 Td (Effective Date: 2026-12-01) Tj ET'
  ].join('\n');
  return buildPdf([
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    pdfStream(firstPage),
    pdfStream(secondPage)
  ]);
}

function createImageOnlyPdf() {
  const imageData = 'FF>';
  const drawImage = 'q 100 0 0 100 50 650 cm /Im1 Do Q';
  return buildPdf([
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>',
    pdfStream(imageData, '/Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /ASCIIHexDecode'),
    pdfStream(drawImage)
  ]);
}

const PASSWORD_PROTECTED_PDF = Uint8Array.from(Buffer.from(
  'JVBERi0xLjMKJeLjz9MKMSAwIG9iago8PAovUHJvZHVjZXIgPDYxNTcxNmNjNTA+Cj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbIDQgMCBSIF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9SZXNvdXJjZXMgPDwKPj4KL01lZGlhQm94IFsgMC4wIDAuMCA1OTUgODQyIF0KL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovViAyCi9SIDMKL0xlbmd0aCAxMjgKL1AgNDI5NDk2NzI5MgovRmlsdGVyIC9TdGFuZGFyZAovTyA8MGU1MjI5MjVhM2U0ZTg3NGMzY2ZhY2JlZjUxMWE3M2FjNGVjMmJkODY1ZGNkM2Q0NjI3NjE0OTE3YWJmZDdlND4KL1UgPDcyNzcyYmI2NGE3M2E2NzI0YjY0M2JlOTE5OTI3YWQ2MjhiZjRlNWU0ZTc1OGE0MTY0MDA0ZTU2ZmZmYTAxMDg+Cj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA1OSAwMDAwMCBuIAowMDAwMDAwMTE4IDAwMDAwIG4gCjAwMDAwMDAxNjcgMDAwMDAgbiAKMDAwMDAwMDI2MSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMyAwIFIKL0luZm8gMSAwIFIKL0lEIFsgPDM0MzEzNzMzMzAzMDY1MzM2MTMyMzM2MjY2NjYzMzM5NjI2NjY0MzQ2NDM3NjEzOTM0MzEzNDM4MzkzMTYzMzQ+IDwzNDMxMzczMzMwMzA2NTMzNjEzMjMzNjI2NjY2MzMzOTYyNjY2NDM0NjQzNzYxMzkzNDMxMzQzODM5MzE2MzM0PiBdCi9FbmNyeXB0IDUgMCBSCj4+CnN0YXJ0eHJlZgo0NzYKJSVFT0YK',
  'base64'
));

function zipArchive(entries, compressionMethod = 0) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  Object.entries(entries).forEach(([filename, content]) => {
    const name = encoder.encode(filename);
    const data = content instanceof Uint8Array ? content : encoder.encode(content);
    const payload = compressionMethod === 8 ? new Uint8Array(deflateRawSync(data)) : data;
    const local = new Uint8Array(30 + name.length + payload.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(8, compressionMethod, true);
    localView.setUint32(18, payload.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(payload, 30 + name.length);
    localParts.push(local);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(10, compressionMethod, true);
    centralView.setUint32(20, payload.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, localOffset, true);
    central.set(name, 46);
    centralParts.push(central);
    localOffset += local.length;
  });

  const localData = concatBytes(localParts);
  const centralData = concatBytes(centralParts);
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(8, centralParts.length, true);
  eocdView.setUint16(10, centralParts.length, true);
  eocdView.setUint32(12, centralData.length, true);
  eocdView.setUint32(16, localData.length, true);
  return concatBytes([localData, centralData, eocd]);
}

const agreementLines = [
  { text: 'RESIDENTIAL RENTAL AGREEMENT', bold: true },
  { text: 'Agreement Reference: REF-2026-77' },
  { text: 'Landlord: Suresh Reddy' },
  { text: 'Tenant: Pooja Hegde' },
  { text: 'Property Address: Flat 1204 Prestige Falcon City Bangalore Karnataka' },
  { text: 'Monthly Rent: Rs. 42000' },
  { text: 'Security Deposit: Rs. 200000' },
  { text: 'Effective Date: 15 October 2026' },
  { text: 'Expiry Date: 14 September 2027' }
];

const validForm = {
  title: 'Residential Rental Agreement',
  term: 'Residential 11M',
  landlord: 'Suresh Reddy',
  tenant: 'Pooja Hegde',
  address: 'Flat 1204 Prestige Falcon City Bangalore',
  rent: '42000',
  deposit: '200000',
  effectiveDate: '2026-10-15',
  expiryDate: '2027-09-14'
};

describe('My Agreements Add Agreement entry flow', () => {
  test('offers Upload PDF or DOCX and Enter Manually before opening the shared form', () => {
    assert.ok(screenSource.includes("entryMode: 'choose'"));
    assert.ok(modalSource.includes('Upload PDF or DOCX'));
    assert.ok(modalSource.includes('Enter Manually'));
    assert.ok(modalSource.includes('Save &amp; Execute Agreement'));

    const uploadPrefill = modalSource.slice(
      modalSource.indexOf('function handleUploadPrefill'),
      modalSource.indexOf('function handleProceedToStep2')
    );
    const explicitSave = modalSource.slice(
      modalSource.indexOf('function handleExecutePipeline'),
      modalSource.indexOf('return (')
    );
    assert.doesNotMatch(uploadPrefill, /addAgreement\(/);
    assert.match(explicitSave, /addAgreement\(formData\)/);
  });

  test('manual validation preserves existing required rules and accepts an open-ended date', () => {
    assert.deepStrictEqual(validateAgreementForm({ ...validForm, expiryDate: '' }), {});
    const missing = validateAgreementForm({});
    assert.ok(missing.title);
    assert.ok(missing.term);
    assert.ok(missing.landlord);
    assert.ok(missing.tenant);
    assert.ok(missing.address);
    assert.ok(missing.rent);
    assert.ok(missing.deposit);
  });

  test('manual validation rejects an expiry date before the effective date', () => {
    const errors = validateAgreementForm({
      ...validForm,
      effectiveDate: '2027-09-14',
      expiryDate: '2026-10-15'
    });
    assert.match(errors.expiryDate, /on or after/);
  });

  test('extracts clearly labeled values from a readable text PDF', async () => {
    const pdf = createTextPdfBytes({
      title: 'AGREEMENT DOCUMENT',
      subtitle: 'Text-based validation fixture',
      lines: agreementLines
    });
    const result = await processAgreementDocument(fileLike('rental.pdf', pdf, 'application/pdf'));
    assert.strictEqual(result.fields.landlord, 'Suresh Reddy');
    assert.strictEqual(result.fields.tenant, 'Pooja Hegde');
    assert.strictEqual(result.fields.referenceNumber, 'REF-2026-77');
    assert.strictEqual(result.fields.effectiveDate, '2026-10-15');
    assert.strictEqual(result.fields.expiryDate, '2027-09-14');
  });

  test('extracts a PDF using chained ASCII85Decode and FlateDecode filters', async () => {
    const result = await processAgreementDocument(fileLike('chained-filter.pdf', createChainedFilterPdf()));
    assert.strictEqual(result.fields.landlord, 'Ananya Rao');
    assert.strictEqual(result.fields.tenant, 'Arjun Mehta');
    assert.strictEqual(result.fields.rent, '25000');
    assert.strictEqual(result.fields.jurisdiction, 'Karnataka');
  });

  test('extracts and maps agreement content across multiple PDF pages', async () => {
    const result = await processAgreementDocument(fileLike('multi-page.pdf', createMultiPagePdf()));
    assert.strictEqual(result.fields.landlord, 'Brigade Ventures');
    assert.strictEqual(result.fields.tenant, 'TechWave Solutions');
    assert.strictEqual(result.fields.address, 'Unit 304 Whitefield Bengaluru Karnataka');
    assert.strictEqual(result.fields.rent, '85000');
    assert.strictEqual(result.fields.term, 'Commercial 22M');
  });

  test('extracts paragraphs and table values from a DOCX containing images', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
      <w:p><w:r><w:t>COMMERCIAL LEASE AGREEMENT</w:t></w:r></w:p>
      <w:tbl>
        <w:tr><w:tc><w:p><w:r><w:t>Landlord: Brigade Commercial Ventures</w:t></w:r></w:p></w:tc></w:tr>
        <w:tr><w:tc><w:p><w:r><w:t>Tenant: TechWave Solutions LLP</w:t></w:r></w:p></w:tc></w:tr>
        <w:tr><w:tc><w:p><w:r><w:t>Property Address: Unit 304 IT Park Whitefield Bengaluru Karnataka</w:t></w:r></w:p></w:tc></w:tr>
        <w:tr><w:tc><w:p><w:r><w:t>Monthly Rent: INR 85000</w:t></w:r></w:p></w:tc></w:tr>
        <w:tr><w:tc><w:p><w:r><w:t>Security Deposit: INR 510000</w:t></w:r></w:p></w:tc></w:tr>
        <w:tr><w:tc><w:p><w:r><w:t>Effective Date: 2026-10-10</w:t></w:r></w:p></w:tc></w:tr>
      </w:tbl><w:p><w:r><w:drawing/></w:r></w:p></w:body></w:document>`;
    const docx = zipArchive({
      '[Content_Types].xml': '<Types/>',
      'word/document.xml': xml,
      'word/media/logo.png': new Uint8Array([137, 80, 78, 71])
    }, 8);
    const result = await processAgreementDocument(fileLike('commercial.docx', docx));
    assert.strictEqual(result.fields.landlord, 'Brigade Commercial Ventures');
    assert.strictEqual(result.fields.tenant, 'TechWave Solutions LLP');
    assert.strictEqual(result.fields.term, 'Commercial 22M');
    assert.strictEqual(result.fields.rent, '85000');
  });

  test('extracts the relevant agreement section when unrelated material is also readable', () => {
    const result = mapAgreementTextToFields(`Company brochure and decorative cover\n
      RESIDENTIAL RENTAL AGREEMENT\nLandlord: Asha Nair\nTenant: Ravi Kumar\n
      Monthly Rent: Rs. 30000\nSecurity Deposit: Rs. 150000\n
      Property Address: 10 Lake Road Bengaluru Karnataka\nExecution Date: 2026-11-01`);
    assert.strictEqual(result.fields.landlord, 'Asha Nair');
    assert.strictEqual(result.fields.tenant, 'Ravi Kumar');
  });

  test('classifies scanned PDFs separately from readable unrelated documents', async () => {
    await assert.rejects(
      processAgreementDocument(fileLike('scan.pdf', createImageOnlyPdf())),
      (error) => error.code === 'NO_TEXT' && /no selectable text/i.test(error.message)
    );

    const unrelatedPdf = createTextPdfBytes({
      title: 'QUARTERLY SALES REPORT',
      subtitle: 'Readable but unrelated',
      lines: [{ text: 'Revenue increased this quarter and the board approved the marketing plan.' }]
    });
    await assert.rejects(
      processAgreementDocument(fileLike('report.pdf', unrelatedPdf)),
      (error) => error.code === 'UNRELATED' && /identifiable agreement content/i.test(error.message)
    );
  });

  test('reports unsupported, oversized, corrupt, password-protected and mislabeled files specifically', async () => {
    await assert.rejects(
      processAgreementDocument(fileLike('notes.txt', new TextEncoder().encode('plain text document'))),
      (error) => error.code === 'UNSUPPORTED'
    );
    await assert.rejects(
      processAgreementDocument({ name: 'huge.pdf', size: MAX_AGREEMENT_FILE_SIZE + 1, arrayBuffer: async () => new ArrayBuffer(0) }),
      (error) => error.code === 'OVERSIZED'
    );
    await assert.rejects(
      processAgreementDocument(fileLike('broken.pdf', new TextEncoder().encode('%PDF-1.4 broken'))),
      (error) => error.code === 'CORRUPT'
    );
    await assert.rejects(
      processAgreementDocument(fileLike('locked.pdf', PASSWORD_PROTECTED_PDF)),
      (error) => error.code === 'PASSWORD_PROTECTED'
    );
    await assert.rejects(
      processAgreementDocument(fileLike('renamed.pdf', new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 4]))),
      (error) => error.code === 'MISMATCH'
    );
  });

  test('does not mislabel genuine extraction errors as scanned documents', () => {
    const error = classifyPdfExtractionError(new Error('Unexpected text worker failure'));
    assert.strictEqual(error.code, 'EXTRACTION_FAILED');
    assert.doesNotMatch(error.message, /scanned|image-only/i);

    const unsupported = classifyPdfExtractionError(new Error('Unknown filter is not supported'));
    assert.strictEqual(unsupported.code, 'UNSUPPORTED_PDF');
  });
});

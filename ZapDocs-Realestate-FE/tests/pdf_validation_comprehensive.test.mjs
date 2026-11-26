import { describe, test } from 'node:test';
import assert from 'node:assert';
import { deflateSync } from 'node:zlib';
import {
  MAX_AGREEMENT_FILE_SIZE,
  classifyPdfExtractionError,
  mapAgreementTextToFields,
  processAgreementDocument
} from '../src/utils/agreementDocumentProcessor.js';
import {
  AGREEMENT_TYPE_CONFIG,
  FIELD_DEFINITIONS,
  VALIDATION_STATUS,
  validateExtractedAgreement
} from '../src/utils/agreementDocumentValidation.js';
import { validateAgreementForm } from '../src/utils/agreementFormValidation.js';
import { createTextPdfBytes } from '../src/utils/pdfGenerator.js';

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
    'BT /F1 11 Tf 50 730 Td (Landlord: Sunita Mehra) Tj ET',
    'BT /F1 11 Tf 50 710 Td (Tenant: Rahul Varma) Tj ET',
    'BT /F1 11 Tf 50 690 Td (Property Address: Flat 502 Brigade Gateway Rajajinagar Bangalore) Tj ET',
    'BT /F1 11 Tf 50 670 Td (Monthly Rent: Rs. 38000) Tj ET',
    'BT /F1 11 Tf 50 650 Td (Security Deposit: Rs. 150000) Tj ET',
    'BT /F1 11 Tf 50 630 Td (Effective Date: 2026-11-01) Tj ET',
    'BT /F1 11 Tf 50 610 Td (Expiry Date: 2027-10-31) Tj ET'
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
  const p1 = [
    'BT /F1 16 Tf 50 760 Td (COMMERCIAL LEASE AGREEMENT) Tj ET',
    'BT /F1 11 Tf 50 730 Td (Landlord: Prestige Tech Park LLC) Tj ET',
    'BT /F1 11 Tf 50 710 Td (Tenant: CloudSphere Innovations) Tj ET'
  ].join('\n');
  const p2 = [
    'BT /F1 11 Tf 50 760 Td (Property Address: Outer Ring Road Marathahalli Bengaluru Karnataka) Tj ET',
    'BT /F1 11 Tf 50 740 Td (Monthly Rent: Rs. 95000) Tj ET',
    'BT /F1 11 Tf 50 720 Td (Security Deposit: Rs. 500000) Tj ET',
    'BT /F1 11 Tf 50 700 Td (Effective Date: 2026-10-01) Tj ET'
  ].join('\n');

  return buildPdf([
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    pdfStream(p1),
    pdfStream(p2)
  ]);
}

function createImageOnlyPdf() {
  const pixel = new Uint8Array([255, 0, 0]);
  return buildPdf([
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>',
    `<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ${pixel.length} >>\nstream\n${new TextDecoder('latin1').decode(pixel)}\nendstream`,
    pdfStream('q 100 0 0 100 50 700 cm /Im1 Do Q')
  ]);
}

const PASSWORD_PROTECTED_PDF = Uint8Array.from(Buffer.from(
  'JVBERi0xLjMKJeLjz9MKMSAwIG9iago8PAovUHJvZHVjZXIgPDYxNTcxNmNjNTA+Cj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbIDQgMCBSIF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9SZXNvdXJjZXMgPDwKPj4KL01lZGlhQm94IFsgMC4wIDAuMCA1OTUgODQyIF0KL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovViAyCi9SIDMKL0xlbmd0aCAxMjgKL1AgNDI5NDk2NzI5MgovRmlsdGVyIC9TdGFuZGFyZAovTyA8MGU1MjI5MjVhM2U0ZTg3NGMzY2ZhY2JlZjUxMWE3M2FjNGVjMmJkODY1ZGNkM2Q0NjI3NjE0OTE3YWJmZDdlND4KL1UgPDcyNzcyYmI2NGE3M2E2NzI0YjY0M2JlOTE5OTI3YWQ2MjhiZjRlNWU0ZTc1OGE0MTY0MDA0ZTU2ZmZmYTAxMDg+Cj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA1OSAwMDAwMCBuIAowMDAwMDAwMTE4IDAwMDAwIG4gCjAwMDAwMDAxNjcgMDAwMDAgbiAKMDAwMDAwMDI2MSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMyAwIFIKL0luZm8gMSAwIFIKL0lEIFsgPDM0MzEzNzMzMzAzMDY1MzM2MTMyMzM2MjY2NjYzMzM5NjI2NjY0MzQ2NDM3NjEzOTM0MzEzNDM4MzkzMTYzMzQ+IDwzNDMxMzczMzMwMzA2NTMzNjEzMjMzNjI2NjY2MzMzOTYyNjY2NDM0NjQzNzYxMzkzNDMxMzQzODM5MzE2MzM0PiBdCi9FbmNyeXB0IDUgMCBSCj4+CnN0YXJ0eHJlZgo0NzYKJSVFT0YK',
  'base64'
));

describe('Comprehensive PDF Text Extraction & Error Classification', () => {
  test('1. Normal text-based PDF extraction', async () => {
    const pdf = createTextPdfBytes({
      title: 'RESIDENTIAL RENTAL AGREEMENT',
      subtitle: 'Official Rental Deed',
      lines: [
        'Landlord: Rajesh Khanna',
        'Tenant: Priya Nair',
        'Property Address: Flat 102 Palm Grove Whitefield Bangalore Karnataka',
        'Monthly Rent: Rs. 35000',
        'Security Deposit: Rs. 150000',
        'Effective Date: 2026-11-01',
        'Expiry Date: 2027-09-30'
      ]
    });
    const result = await processAgreementDocument(fileLike('normal.pdf', pdf, 'application/pdf'));
    assert.strictEqual(result.fields.landlord, 'Rajesh Khanna');
    assert.strictEqual(result.fields.tenant, 'Priya Nair');
    assert.strictEqual(result.fields.rent, '35000');
    assert.strictEqual(result.fields.deposit, '150000');
    assert.strictEqual(result.fields.jurisdiction, 'Karnataka');
  });

  test('2. Multi-page PDF extraction across page boundaries', async () => {
    const multiPage = createMultiPagePdf();
    const result = await processAgreementDocument(fileLike('lease-multi.pdf', multiPage));
    assert.strictEqual(result.file.pageCount, 2);
    assert.strictEqual(result.fields.landlord, 'Prestige Tech Park LLC');
    assert.strictEqual(result.fields.tenant, 'CloudSphere Innovations');
    assert.strictEqual(result.fields.term, 'Commercial 22M');
    assert.strictEqual(result.fields.rent, '95000');
  });

  test('3. Chained PDF stream filters: ASCII85Decode followed by FlateDecode', async () => {
    const chained = createChainedFilterPdf();
    const result = await processAgreementDocument(fileLike('chained.pdf', chained));
    assert.strictEqual(result.fields.landlord, 'Sunita Mehra');
    assert.strictEqual(result.fields.tenant, 'Rahul Varma');
    assert.strictEqual(result.fields.rent, '38000');
    assert.strictEqual(result.fields.deposit, '150000');
    assert.strictEqual(result.fields.term, 'Residential 11M');
  });

  test('4. Empty or unreadable PDF rejects with CORRUPT', async () => {
    const emptyBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // 5 bytes < 8
    await assert.rejects(
      processAgreementDocument(fileLike('empty.pdf', emptyBytes)),
      (error) => error.code === 'CORRUPT' && /empty or corrupt/i.test(error.message)
    );
  });

  test('5. Password-protected PDF correctly identified with PASSWORD_PROTECTED', async () => {
    await assert.rejects(
      processAgreementDocument(fileLike('protected.pdf', PASSWORD_PROTECTED_PDF)),
      (error) => error.code === 'PASSWORD_PROTECTED' && /password/i.test(error.message)
    );
  });

  test('6. Image-only/scanned PDF classified as NO_TEXT with OCR recommendation', async () => {
    const scan = createImageOnlyPdf();
    await assert.rejects(
      processAgreementDocument(fileLike('scan_doc.pdf', scan)),
      (error) => error.code === 'NO_TEXT' && /OCR is not configured/i.test(error.message)
    );
  });

  test('7. Unrelated readable text classified as UNRELATED', async () => {
    const brochure = createTextPdfBytes({
      title: 'GLOBAL REAL ESTATE MARKET OUTLOOK 2026',
      subtitle: 'Annual research whitepaper',
      lines: ['Commercial vacancy declined across major metropolitan sub-markets.']
    });
    await assert.rejects(
      processAgreementDocument(fileLike('brochure.pdf', brochure)),
      (error) => error.code === 'UNRELATED' && /identifiable agreement content/i.test(error.message)
    );
  });

  test('8. Leave and License agreement detection in Maharashtra', () => {
    const text = `LEAVE AND LICENSE AGREEMENT
      This Leave and License Agreement is executed in Mumbai, Maharashtra.
      Licensor: Dilip Joshi
      Licensee: Amit Shah
      Demised Premises: Flat 402 Sea Face Towers Worli Mumbai Maharashtra
      Monthly Rent: Rs. 75000
      Security Deposit: Rs. 300000
      Effective Date: 2026-11-15`;
    const mapped = mapAgreementTextToFields(text);
    assert.strictEqual(mapped.fields.term, 'Residential 11M');
    assert.strictEqual(mapped.fields.jurisdiction, 'Maharashtra');
    assert.strictEqual(mapped.fields.landlord, 'Dilip Joshi');
    assert.strictEqual(mapped.fields.tenant, 'Amit Shah');
  });
});

describe('Agreement Validation Rules & Type Configurations', () => {
  test('1. Validates all supported agreement types in AGREEMENT_TYPE_CONFIG', () => {
    const expectedTypes = [
      'Residential 11M',
      'Commercial 22M',
      'Corporate 36M',
      'Commercial / Other Agreement',
      'Leave and License'
    ];
    expectedTypes.forEach((type) => {
      assert.ok(AGREEMENT_TYPE_CONFIG[type], `Missing agreement type: ${type}`);
      assert.ok(AGREEMENT_TYPE_CONFIG[type].requiredFields.includes('landlord'));
      assert.ok(AGREEMENT_TYPE_CONFIG[type].requiredFields.includes('rent'));
    });
  });

  test('2. Required, Conditional, and Optional fields are defined in FIELD_DEFINITIONS', () => {
    const mandatory = FIELD_DEFINITIONS.filter((f) => f.requirement === 'Mandatory');
    const conditional = FIELD_DEFINITIONS.filter((f) => f.requirement === 'Conditional');
    const optional = FIELD_DEFINITIONS.filter((f) => f.requirement === 'Optional');

    assert.ok(mandatory.some((f) => f.key === 'landlord'));
    assert.ok(mandatory.some((f) => f.key === 'rent'));
    assert.ok(mandatory.some((f) => f.key === 'address'));

    assert.ok(conditional.some((f) => f.key === 'tenant')); // conditional on landlord != tenant
    assert.ok(conditional.some((f) => f.key === 'expiryDate')); // conditional on effectiveDate
    assert.ok(conditional.some((f) => f.key === 'jurisdiction')); // conditional on state treasury

    assert.ok(optional.some((f) => f.key === 'referenceNumber'));
    assert.ok(optional.some((f) => f.key === 'effectiveDate'));
  });

  test('3. Clearly separates Missing Information from Invalid Information', () => {
    // Missing required rent and invalid tenant (tenant === landlord)
    const result = validateExtractedAgreement({
      fields: {
        title: 'Residential Rental Agreement',
        term: 'Residential 11M',
        landlord: 'Suresh Reddy',
        tenant: 'Suresh Reddy', // Invalid: equals landlord
        address: 'Flat 1204 Prestige Falcon City Bangalore',
        rent: '', // Missing: rent is empty
        deposit: '200000'
      }
    });

    assert.strictEqual(result.outcome, 'NEEDS_REVIEW');
    assert.ok(result.counts[VALIDATION_STATUS.FAILED] >= 1, 'Should have invalid count');
    assert.ok(result.counts[VALIDATION_STATUS.MISSING] >= 1, 'Should have missing count');
    assert.ok(result.summary.missingFields.includes('Monthly rent'));
    assert.ok(result.summary.invalidFields.includes('Tenant / lessee'));
  });

  test('4. Correctly validates valid agreement and returns VALID outcome', () => {
    const result = validateExtractedAgreement({
      fields: {
        title: 'Residential Rental Agreement',
        term: 'Residential 11M',
        landlord: 'Suresh Reddy',
        tenant: 'Pooja Hegde',
        address: 'Flat 1204 Prestige Falcon City Bangalore',
        rent: '42000',
        deposit: '200000',
        effectiveDate: '2026-11-01',
        expiryDate: '2027-10-31'
      }
    });

    assert.strictEqual(result.outcome, 'VALID');
    assert.strictEqual(result.counts[VALIDATION_STATUS.FAILED], 0);
    assert.strictEqual(result.counts[VALIDATION_STATUS.MISSING], 0);
    assert.ok(result.counts[VALIDATION_STATUS.PASSED] > 0);
  });
});

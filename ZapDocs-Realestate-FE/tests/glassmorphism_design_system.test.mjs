import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('c:/ZAPDOCS-ADMIN-FE/ZapDocs-Realestate-FE');

describe('Master Task: Complete Glassmorphism Design System & Custom Dropdowns', () => {
  const glassSelectSource = fs.readFileSync(path.join(ROOT, 'src/components/common/GlassSelect.jsx'), 'utf-8');
  const glassSelectCss = fs.readFileSync(path.join(ROOT, 'src/components/common/GlassSelect.css'), 'utf-8');
  const modalSource = fs.readFileSync(path.join(ROOT, 'src/components/broker/modals/AgreementCreationModal.jsx'), 'utf-8');
  const modalCss = fs.readFileSync(path.join(ROOT, 'src/components/broker/modals/AgreementCreationModal.css'), 'utf-8');
  const addClientSource = fs.readFileSync(path.join(ROOT, 'src/components/broker/modals/AddClientModal.jsx'), 'utf-8');
  const editClientSource = fs.readFileSync(path.join(ROOT, 'src/components/broker/modals/EditClientModal.jsx'), 'utf-8');

  /* -------------------------------------------------------------
   * 1. Reusable GlassSelect Component & Architecture
   * ------------------------------------------------------------- */
  describe('1. Reusable GlassSelect Component & Architecture', () => {
    test('GlassSelect component exports correctly with required props', () => {
      assert.ok(glassSelectSource.includes('export default function GlassSelect'), 'Must export GlassSelect component');
      assert.ok(glassSelectSource.includes('normalizedOptions'), 'Must normalize options array');
      assert.ok(glassSelectSource.includes('syntheticEvent'), 'Must emit synthetic event for input/select compatibility');
    });

    test('GlassSelect includes hidden native select for DOM querying and form compatibility', () => {
      assert.ok(glassSelectSource.includes('zd-glass-select-native'), 'Must render hidden native select element');
      assert.ok(glassSelectSource.includes('tabIndex={-1}'), 'Native select must be hidden from tab order');
    });

    test('GlassSelect supports custom icons, subtitles, and keyboard accessibility', () => {
      assert.ok(glassSelectSource.includes('PrefixIcon'), 'Must support prefix icon');
      assert.ok(glassSelectSource.includes('handleKeyDown'), 'Must implement keyboard navigation');
      assert.ok(glassSelectSource.includes('ArrowDown'), 'Must handle ArrowDown key');
      assert.ok(glassSelectSource.includes('ArrowUp'), 'Must handle ArrowUp key');
      assert.ok(glassSelectSource.includes('Escape'), 'Must handle Escape key');
      assert.ok(glassSelectSource.includes('role="listbox"'), 'Must have accessible listbox role');
      assert.ok(glassSelectSource.includes('role="option"'), 'Must have accessible option role');
    });

    test('GlassSelect CSS provides backdrop-filter blur, translucent surfaces, and floating shadow', () => {
      assert.ok(glassSelectCss.includes('backdrop-filter: blur('), 'Must provide backdrop-filter blur on trigger/panel');
      assert.ok(glassSelectCss.includes('zd-glass-select-panel'), 'Must define floating panel styles');
      assert.ok(glassSelectCss.includes('zd-glass-select-option:hover'), 'Must provide soft hover highlight');
      assert.ok(glassSelectCss.includes('#dbeafe'), 'Must highlight options with soft blue pill background');
    });
  });

  /* -------------------------------------------------------------
   * 2. Agreement Creation Modal Redesign & Select Replacement
   * ------------------------------------------------------------- */
  describe('2. Agreement Creation Modal Redesign & Select Replacement', () => {
    test('AgreementCreationModal imports GlassSelect and dedicated CSS', () => {
      assert.ok(modalSource.includes("import GlassSelect from '../../common/GlassSelect'"), 'Must import GlassSelect');
      assert.ok(modalSource.includes("import './AgreementCreationModal.css'"), 'Must import AgreementCreationModal.css');
    });

    test('Replaces native client select with GlassSelect and preserves id gen-client-select', () => {
      assert.ok(modalSource.includes('id="gen-client-select"'), 'Must preserve id gen-client-select');
      assert.ok(!modalSource.includes('<select\n                    className="form-control"\n                    id="gen-client-select"'), 'Must not use native select for client pre-fill');
    });

    test('Replaces lease term and jurisdiction state with GlassSelect', () => {
      assert.ok(modalSource.includes('id="gen-lease-term"'), 'Must preserve id gen-lease-term');
      assert.ok(modalSource.includes('id="gen-stamp-state"'), 'Must preserve id gen-stamp-state');
      assert.ok(!modalSource.includes('<select\n                      className="form-control"\n                      id="gen-lease-term"'), 'Must not use native select for lease term');
      assert.ok(!modalSource.includes('<select\n                      className="form-control"\n                      id="gen-stamp-state"'), 'Must not use native select for jurisdiction state');
    });

    test('Strict Requirement: State treasury stamp duty card is completely REMOVED from Step 1', () => {
      assert.ok(
        !modalSource.includes('State treasury stamp duty is calculated automatically in Step 2 based on tenure and monthly rental consideration.'),
        'The stamp duty card in Step 1 must be completely removed as instructed'
      );
    });

    test('Preserves 3-step indicators (1. Details, 2. Review & Stamp, 3. Execution)', () => {
      assert.ok(modalSource.includes('agr-pill-step-1'), 'Step 1 pill must exist');
      assert.ok(modalSource.includes('agr-pill-step-2'), 'Step 2 pill must exist');
      assert.ok(modalSource.includes('agr-pill-step-3'), 'Step 3 pill must exist');
      assert.ok(modalSource.includes('1. Details'), 'Label 1. Details must exist');
      assert.ok(modalSource.includes('2. Review &amp; Stamp'), 'Label 2. Review & Stamp must exist');
      assert.ok(modalSource.includes('3. Execution'), 'Label 3. Execution must exist');
    });

    test('Preserves essential form validation and step progression handlers', () => {
      assert.ok(modalSource.includes('validate()'), 'Validation function must exist');
      assert.ok(modalSource.includes('btn-goto-step2'), 'Step 2 progression button must exist');
      assert.ok(modalSource.includes('btn-confirm-execute'), 'Execution trigger button must exist');
    });
  });

  /* -------------------------------------------------------------
   * 3. AddClientModal & EditClientModal Upgrades
   * ------------------------------------------------------------- */
  describe('3. AddClientModal & EditClientModal Upgrades', () => {
    test('AddClientModal uses GlassSelect for new-client-role', () => {
      assert.ok(addClientSource.includes("import GlassSelect from '../../common/GlassSelect'"));
      assert.ok(addClientSource.includes('id="new-client-role"'));
      assert.ok(addClientSource.includes('options='));
    });

    test('EditClientModal uses GlassSelect for edit-client-role', () => {
      assert.ok(editClientSource.includes("import GlassSelect from '../../common/GlassSelect'"));
      assert.ok(editClientSource.includes('id="edit-client-role"'));
      assert.ok(editClientSource.includes('options='));
    });
  });

  /* -------------------------------------------------------------
   * 4. Glassmorphism Design System CSS
   * ------------------------------------------------------------- */
  describe('4. Glassmorphism Design System CSS', () => {
    test('AgreementCreationModal.css provides rounded-2xl glass card and elegant shadows', () => {
      assert.ok(modalCss.includes('.zd-gen-modal-card'));
      assert.ok(modalCss.includes('border-radius: 24px'));
      assert.ok(modalCss.includes('backdrop-filter: blur(24px)'));
      assert.ok(modalCss.includes('box-shadow: 0 25px 60px'));
    });

    test('Provides responsive media queries for mobile viewports', () => {
      assert.ok(modalCss.includes('@media (max-width: 640px)'));
    });
  });
});

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  isValidIFSC,
  isValidAccountNumber,
  isValidUPI,
  maskAccountNumber,
  getSavedBankAccount,
  saveBankAccount,
  getSavedUPI,
  saveUPI
} from '../src/mock/bankUpiData.js';

describe('Master Task: Broker Profile, Billing Navigation & Subscription Cleanup Verification', () => {
  const headerPath = path.resolve('src/components/layout/Header/Header.jsx');
  const headerSource = fs.readFileSync(headerPath, 'utf-8');

  const navItemsPath = path.resolve('src/components/layout/navigationItems.js');
  const navItemsSource = fs.readFileSync(navItemsPath, 'utf-8');

  const billingNavTabsPath = path.resolve('src/components/BillingNavTabs.jsx');
  const billingNavTabsSource = fs.readFileSync(billingNavTabsPath, 'utf-8');

  const planBillingPath = path.resolve('src/screens/PlanBilling/PlanBillingScreen.jsx');
  const planBillingSource = fs.readFileSync(planBillingPath, 'utf-8');

  const bankUpiPath = path.resolve('src/screens/BankUpiSettings/BankUpiSettingsScreen.jsx');
  const bankUpiSource = fs.readFileSync(bankUpiPath, 'utf-8');

  const mobileDrawerPath = path.resolve('src/components/layout/MobileDrawer/MobileDrawer.jsx');
  const mobileDrawerSource = fs.readFileSync(mobileDrawerPath, 'utf-8');

  /* -------------------------------------------------------------
   * 1. Profile Dropdown Modifications
   * ------------------------------------------------------------- */
  describe('1. Profile Dropdown Modifications', () => {
    test('Broker profile identity (initials, name, email, Broker ID) is preserved', () => {
      assert.ok(headerSource.includes('initials'), 'Avatar initials must be preserved');
      assert.ok(headerSource.includes('user?.name'), 'Broker name must be preserved');
      assert.ok(headerSource.includes('user?.identifier'), 'Broker email/identifier must be preserved');
      assert.ok(headerSource.includes('user?.id') || headerSource.includes('BRK-9042'), 'Broker ID must be preserved');
    });

    test('Document Quota is completely REMOVED from profile dropdown', () => {
      assert.ok(!headerSource.includes('profile_quota_label'), 'profile_quota_label must not appear in Header.jsx');
      assert.ok(!headerSource.includes('Active Quota'), 'Active Quota text must not appear in Header.jsx');
      assert.ok(!headerSource.includes('remainingQuota} / ${allocatedQuota} docs'), 'Quota depletion numbers must not appear in profile dropdown');
    });

    test('View Plan & Invoices is completely REMOVED from profile dropdown', () => {
      assert.ok(!headerSource.includes('id="btn-profile-billing"'), 'btn-profile-billing button must be removed');
      assert.ok(!headerSource.includes('profile_view_billing'), 'profile_view_billing translation key must be removed from dropdown');
    });

    test('Manage Bank & Settlement UPI is preserved and navigates to /broker/bank-upi', () => {
      assert.ok(headerSource.includes('id="btn-profile-bank"'), 'btn-profile-bank button must exist');
      assert.ok(headerSource.includes("navigate('/broker/bank-upi')"), 'Must navigate to /broker/bank-upi');
      assert.ok(
        headerSource.includes('Manage Bank & Settlement UPI'),
        'Must display "Manage Bank & Settlement UPI"'
      );
    });
  });

  /* -------------------------------------------------------------
   * 2. Logout Confirmation Dialog
   * ------------------------------------------------------------- */
  describe('2. Logout Confirmation Dialog', () => {
    test('Clicking Log Out opens confirmation dialog instead of immediate logout', () => {
      assert.ok(headerSource.includes('setShowLogoutDialog(true)'), 'Logout button must set showLogoutDialog to true');
      assert.ok(headerSource.includes('showLogoutDialog &&'), 'Must render dialog conditionally when showLogoutDialog is true');
    });

    test('Dialog contains required title, confirmation message, and action buttons', () => {
      assert.ok(headerSource.includes('Confirm Logout'), 'Must display Title "Confirm Logout"');
      assert.ok(
        headerSource.includes('Are you sure you want to log out of your ZapDocs Broker account?'),
        'Must display confirmation message'
      );
      assert.ok(headerSource.includes('Cancel'), 'Must have Cancel button');
      assert.ok(headerSource.includes('Yes, Log Out'), 'Must have "Yes, Log Out" button');
      assert.ok(headerSource.includes('id="btn-close-logout-modal"'), 'Must have close icon button');
    });

    test('Double-submit prevention and loading state are implemented', () => {
      assert.ok(headerSource.includes('isLoggingOut'), 'Must track isLoggingOut state');
      assert.ok(headerSource.includes('disabled={isLoggingOut}'), 'Buttons must be disabled while logout is in progress');
    });
  });

  /* -------------------------------------------------------------
   * 3. Earn & Refer Navbar Feature
   * ------------------------------------------------------------- */
  describe('3. Earn & Refer Navbar Feature', () => {
    test('Top navigation button preserves gift icon, green styling, and uses label "Earn & Refer"', () => {
      assert.ok(headerSource.includes('id="nav-tab-refer"'), 'nav-tab-refer button must exist in top navigation');
      assert.ok(headerSource.includes('Gift'), 'Gift icon must be present');
      assert.ok(headerSource.includes('zd-nav-tab--refer'), 'Green pill highlight styling must be preserved');
      assert.ok(headerSource.includes('Earn & Refer'), 'Label must be "Earn & Refer"');
      assert.ok(!headerSource.includes('Refer & Earn ₹50'), 'Must remove ₹50 from navbar');
    });

    test('Top navigation button is fully functional and clickable (navigates to /broker/refer)', () => {
      assert.ok(
        headerSource.includes("onNavigate('refer')") || headerSource.includes("navigate('/broker/refer')"),
        'onClick must trigger navigation to refer route'
      );
    });

    test('Mobile drawer refer item does not open refer modal and navigates to refer', () => {
      assert.ok(
        !mobileDrawerSource.includes("openModal('refer-earn')"),
        'Mobile drawer must not trigger openModal("refer-earn")'
      );
      assert.ok(
        mobileDrawerSource.includes('Earn & Refer'),
        'Mobile drawer must use "Earn & Refer"'
      );
      assert.ok(
        !mobileDrawerSource.includes('zd-drawer__nav-pill--refer'),
        'Mobile drawer must remove ₹50 pill badge'
      );
    });
  });

  /* -------------------------------------------------------------
   * 4. Remove Subscription & Quota UI
   * ------------------------------------------------------------- */
  describe('4. Remove Subscription & Quota UI', () => {
    test('BillingNavTabs returns null so Subscription & Quota tab is eliminated', () => {
      assert.ok(billingNavTabsSource.includes('return null;'), 'BillingNavTabs must return null');
      assert.ok(!billingNavTabsSource.includes('Subscription & Quota'), 'Must not render Subscription & Quota tab');
    });

    test('NAV_ITEMS in navigationItems.js removes Plan & Billing link', () => {
      assert.ok(!navItemsSource.includes("id: 'billing'"), 'NAV_ITEMS must not contain billing');
      assert.ok(!navItemsSource.includes('Plan & Billing'), 'NAV_ITEMS must not contain Plan & Billing');
    });

    test('PlanBillingScreen renders BankUpiSettingsScreen as primary and only section', () => {
      assert.ok(
        planBillingSource.includes('BankUpiSettingsScreen'),
        'PlanBillingScreen must render BankUpiSettingsScreen'
      );
      assert.ok(
        !planBillingSource.includes('Active Subscription Summary'),
        'Must not contain Active Subscription Summary'
      );
      assert.ok(
        !planBillingSource.includes('Professional Tier'),
        'Must not contain Professional Tier card'
      );
      assert.ok(
        !planBillingSource.includes('Live Quota Metrics'),
        'Must not contain Live Quota Metrics'
      );
      assert.ok(
        !planBillingSource.includes('billing-auto-renew'),
        'Must not contain Auto-Renew switch'
      );
      assert.ok(
        !planBillingSource.includes('Buy Instant Top-Up Pack'),
        'Must not contain Top-Up Pack cards'
      );
    });
  });

  /* -------------------------------------------------------------
   * 5. Keep Bank & UPI Settings Functional
   * ------------------------------------------------------------- */
  describe('5. Keep Bank & UPI Settings Functional', () => {
    test('Bank & UPI screen component exists and has required form elements', () => {
      assert.ok(bankUpiSource.includes('bankFormData'), 'Must manage bank form state');
      assert.ok(bankUpiSource.includes('validateBankForm'), 'Must have bank validation logic');
      assert.ok(bankUpiSource.includes('handleSaveBank'), 'Must have bank save handler');
      assert.ok(bankUpiSource.includes('upiInput'), 'Must manage UPI input state');
      assert.ok(bankUpiSource.includes('showToast'), 'Must provide user feedback');
    });

    test('Bank and UPI validators function correctly', () => {
      // IFSC
      assert.strictEqual(isValidIFSC('HDFC0001248'), true);
      assert.strictEqual(isValidIFSC('SBIN0000001'), true);
      assert.strictEqual(isValidIFSC('invalid'), false);
      assert.strictEqual(isValidIFSC('HDFC1001248'), false); // 5th char must be 0

      // Account number
      assert.strictEqual(isValidAccountNumber('123456789'), true);
      assert.strictEqual(isValidAccountNumber('1234567890123456'), true);
      assert.strictEqual(isValidAccountNumber('12345'), false); // < 9 digits
      assert.strictEqual(isValidAccountNumber('abc12345678'), false);

      // UPI
      assert.strictEqual(isValidUPI('broker@okaxis'), true);
      assert.strictEqual(isValidUPI('rajesh.sharma@icici'), true);
      assert.strictEqual(isValidUPI('notanupi'), false);
    });

    test('Bank and UPI storage functions work as expected', () => {
      const brokerId = 'BRK-TEST-999';
      const testAccount = {
        accountHolderName: 'Test Broker',
        accountNumber: '987654321012',
        ifscCode: 'HDFC0001248'
      };

      saveBankAccount(brokerId, testAccount);
      const retrievedBank = getSavedBankAccount(brokerId);
      assert.strictEqual(retrievedBank.accountHolderName, 'Test Broker');
      assert.strictEqual(retrievedBank.accountNumber, '987654321012');
      assert.strictEqual(retrievedBank.ifscCode, 'HDFC0001248');

      const testUpi = 'testbroker@okaxis';
      saveUPI(brokerId, testUpi);
      const retrievedUpi = getSavedUPI(brokerId);
      assert.strictEqual(retrievedUpi, testUpi);
    });
  });
});

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getReferralRecords } from '../src/mock/referralData.js';
import { UI_TRANSLATIONS } from '../src/constants/translations.js';

describe('Navbar Earn & Refer Feature Verification Suite', () => {
  const headerPath = path.resolve('src/components/layout/Header/Header.jsx');
  const headerSource = fs.readFileSync(headerPath, 'utf-8');

  const headerCssPath = path.resolve('src/components/layout/Header/Header.css');
  const headerCssSource = fs.readFileSync(headerCssPath, 'utf-8');

  const navItemsPath = path.resolve('src/components/layout/navigationItems.js');
  const navItemsSource = fs.readFileSync(navItemsPath, 'utf-8');

  const mobileDrawerPath = path.resolve('src/components/layout/MobileDrawer/MobileDrawer.jsx');
  const mobileDrawerSource = fs.readFileSync(mobileDrawerPath, 'utf-8');

  const sidebarPath = path.resolve('src/components/layout/Sidebar/Sidebar.jsx');
  const sidebarSource = fs.readFileSync(sidebarPath, 'utf-8');

  const appRouterPath = path.resolve('src/routes/AppRouter.jsx');
  const appRouterSource = fs.readFileSync(appRouterPath, 'utf-8');

  const brokerPagesPath = path.resolve('src/pages/broker/brokerPages.jsx');
  const brokerPagesSource = fs.readFileSync(brokerPagesPath, 'utf-8');

  const brokerLayoutPath = path.resolve('src/layouts/BrokerLayout.jsx');
  const brokerLayoutSource = fs.readFileSync(brokerLayoutPath, 'utf-8');

  const referEarnPath = path.resolve('src/screens/ReferEarn/ReferEarnScreen.jsx');
  const referEarnSource = fs.readFileSync(referEarnPath, 'utf-8');

  const referEarnCssPath = path.resolve('src/screens/ReferEarn/ReferEarn.css');
  const referEarnCssSource = fs.readFileSync(referEarnCssPath, 'utf-8');

  /* -------------------------------------------------------------
   * 1. Navbar Label & ₹50 Removal Requirements
   * ------------------------------------------------------------- */
  describe('1. Navbar Label & ₹50 Removal', () => {
    test('Header.jsx renders "Earn & Refer" and removes "Refer & Earn ₹50"', () => {
      assert.ok(headerSource.includes('Earn & Refer'), 'Header must contain "Earn & Refer"');
      assert.ok(!headerSource.includes('Refer & Earn ₹50'), 'Header must NOT contain "Refer & Earn ₹50"');
      assert.ok(!headerSource.includes('₹50'), 'Header navbar must NOT contain any ₹50 reference');
    });

    test('navigationItems.js defines refer item with label "Earn & Refer"', () => {
      assert.ok(navItemsSource.includes("id: 'refer'"));
      assert.ok(navItemsSource.includes("label: 'Earn & Refer'"));
      assert.ok(!navItemsSource.includes('Refer & Earn ₹50'));
    });

    test('MobileDrawer.jsx renders "Earn & Refer" and eliminates ₹50 badge', () => {
      assert.ok(mobileDrawerSource.includes('Earn & Refer'));
      assert.ok(!mobileDrawerSource.includes('₹50'));
      assert.ok(!mobileDrawerSource.includes('zd-drawer__nav-pill--refer'));
    });

    test('Translations across all 5 languages define nav_refer without ₹50', () => {
      assert.equal(UI_TRANSLATIONS.en.nav_refer, 'Earn & Refer');
      assert.ok(UI_TRANSLATIONS.hi.nav_refer && !UI_TRANSLATIONS.hi.nav_refer.includes('₹50'));
      assert.ok(UI_TRANSLATIONS.te.nav_refer && !UI_TRANSLATIONS.te.nav_refer.includes('₹50'));
      assert.ok(UI_TRANSLATIONS.kn.nav_refer && !UI_TRANSLATIONS.kn.nav_refer.includes('₹50'));
      assert.ok(UI_TRANSLATIONS.mr.nav_refer && !UI_TRANSLATIONS.mr.nav_refer.includes('₹50'));
    });
  });

  /* -------------------------------------------------------------
   * 2. Fully Functional & Clickable Navigation
   * ------------------------------------------------------------- */
  describe('2. Fully Functional & Clickable Navigation', () => {
    test('Header.jsx refer button navigates to "refer" / "/broker/refer"', () => {
      assert.ok(
        headerSource.includes("onNavigate ? onNavigate('refer') : navigate('/broker/refer')") ||
        headerSource.includes("onNavigate('refer')"),
        'Header refer button must trigger navigation to refer route'
      );
      assert.ok(!headerSource.includes('e.preventDefault()'), 'Must not prevent click action');
    });

    test('BrokerLayout.jsx maps "refer" to "/broker/refer"', () => {
      assert.ok(brokerLayoutSource.includes('"refer": "/broker/refer"'));
      assert.ok(brokerLayoutSource.includes('"refer": "refer"'));
    });

    test('AppRouter.jsx routes "/broker/refer" to BrokerReferPage', () => {
      assert.ok(appRouterSource.includes('path="refer" element={<BrokerReferPage />}'));
    });

    test('brokerPages.jsx maps BrokerReferPage to ReferEarnScreen', () => {
      assert.ok(brokerPagesSource.includes('ReferEarnScreen'));
      assert.ok(brokerPagesSource.includes('export function BrokerReferPage()'));
    });

    test('MobileDrawer.jsx navigates when clicking refer link', () => {
      assert.ok(
        !mobileDrawerSource.includes('if (isRefer) {'),
        'MobileDrawer must not block refer navigation'
      );
    });

    test('Sidebar.jsx allows navigation on refer click', () => {
      assert.ok(
        !sidebarSource.includes("if (item.id === 'refer') return"),
        'Sidebar must not block refer navigation'
      );
    });
  });

  /* -------------------------------------------------------------
   * 3. Reuse Existing Verified Implementation (No Invented Data)
   * ------------------------------------------------------------- */
  describe('3. Verified Referral Implementation Reuse', () => {
    test('ReferEarnScreen exists and uses existing getReferralRecords data source', () => {
      assert.ok(referEarnSource.includes('getReferralRecords'));
      assert.ok(referEarnSource.includes('getSavedUPI'));
    });

    test('getReferralRecords safely retrieves verified records or empty array', () => {
      const recordsBrk1 = getReferralRecords('brk_1');
      assert.ok(Array.isArray(recordsBrk1));
      assert.ok(recordsBrk1.length > 0);

      const recordsUnknown = getReferralRecords('unknown_broker_999');
      assert.deepEqual(recordsUnknown, []);

      const recordsNull = getReferralRecords(null);
      assert.deepEqual(recordsNull, []);
    });

    test('ReferEarnScreen computes metrics strictly from existing records', () => {
      assert.ok(referEarnSource.includes('totalReferrals = records.length'));
      assert.ok(referEarnSource.includes('totalRewardsEarned = records'));
      assert.ok(referEarnSource.includes('filteredRecords'));
    });
  });

  /* -------------------------------------------------------------
   * 4. Glassmorphism Design System & Responsiveness
   * ------------------------------------------------------------- */
  describe('4. Glassmorphism Design System & Responsiveness', () => {
    test('Header.css provides active and hover styles for .zd-nav-tab--refer', () => {
      assert.ok(headerCssSource.includes('.zd-nav-tab--refer'));
      assert.ok(headerCssSource.includes('.zd-nav-tab--refer:hover'));
      assert.ok(headerCssSource.includes('.zd-nav-tab--refer.active'));
    });

    test('ReferEarn.css implements glassmorphism and responsive breakpoints', () => {
      assert.ok(referEarnCssSource.includes('.zd-refer-hero'));
      assert.ok(referEarnCssSource.includes('backdrop-filter'));
      assert.ok(referEarnCssSource.includes('@media (max-width: 1024px)'));
      assert.ok(referEarnCssSource.includes('@media (max-width: 768px)'));
      assert.ok(referEarnCssSource.includes('@media (max-width: 640px)'));
    });
  });
});

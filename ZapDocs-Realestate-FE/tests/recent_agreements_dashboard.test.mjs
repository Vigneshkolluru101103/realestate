import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Broker Home Dashboard - Recent Agreements Section Verification', () => {
  const componentPath = path.resolve('src/screens/HomeDashboard/HomeDashboardScreen.jsx');
  const cssPath = path.resolve('src/screens/HomeDashboard/HomeDashboard.css');
  const componentSource = fs.readFileSync(componentPath, 'utf-8');
  const cssSource = fs.readFileSync(cssPath, 'utf-8');

  test('1. Layout Order: Sections appear in exact required sequence', () => {
    const resourceIdx = componentSource.indexOf('id="resources-dashboard-container"');
    const actionsIdx = componentSource.indexOf('className="zd-quota-actions"');
    const analyticsIdx = componentSource.indexOf('id="analytics-section"');
    const recentAgreementsIdx = componentSource.indexOf('id="card-recent-agreements"');

    assert.ok(resourceIdx !== -1, 'eStamp/eSign resource cards must exist');
    assert.ok(actionsIdx !== -1, 'Action buttons must exist');
    assert.ok(analyticsIdx !== -1, 'Analytics section must exist');
    assert.ok(recentAgreementsIdx !== -1, 'Recent Agreements section must exist');

    assert.ok(
      resourceIdx < actionsIdx && actionsIdx < analyticsIdx && analyticsIdx < recentAgreementsIdx,
      'Sections must follow exact sequential order: Resources -> Actions -> Analytics -> Recent Agreements'
    );
  });

  test('2. Card Content: Required heading, subtitle, and View All link', () => {
    assert.match(
      componentSource,
      /Recent Agreements/,
      'Must contain Heading "Recent Agreements"'
    );
    assert.match(
      componentSource,
      /Recently created and updated agreements\./,
      'Must contain Subtitle "Recently created and updated agreements."'
    );
    assert.match(
      componentSource,
      /navigate\(['"]\/broker\/agreements['"]\)/,
      'View All Agreements must navigate to /broker/agreements'
    );
  });

  test('3. Table Columns: All 6 required columns are defined in the thead', () => {
    const requiredColumns = [
      'Agreement ID',
      'Customer / Property',
      'Agreement Type',
      'Created Date',
      'Status',
      'Quick Actions'
    ];

    for (const col of requiredColumns) {
      assert.ok(
        componentSource.includes(col),
        `Table header must include column: ${col}`
      );
    }
  });

  test('4. Data Requirements: Dynamically maps over agreements from useBrokerState without mock hardcoding', () => {
    assert.match(
      componentSource,
      /useBrokerState\(\)/,
      'Must consume live agreements from useBrokerState context'
    );
    assert.match(
      componentSource,
      /agreements\s*=\s*\[\]/,
      'Must extract agreements array from useBrokerState'
    );
    assert.match(
      componentSource,
      /agreements\.map\(\(agr\)\s*=>/,
      'Must dynamically map over agreements array'
    );
    assert.match(
      componentSource,
      /agr\.id/,
      'Must render dynamic agreement ID'
    );
    assert.match(
      componentSource,
      /agr\.tenantName/,
      'Must render dynamic tenant name'
    );
    assert.match(
      componentSource,
      /agr\.status/,
      'Must render dynamic status'
    );
  });

  test('5. Empty State: Displays a clean empty state when no agreements exist', () => {
    assert.match(
      componentSource,
      /agreements\.length\s*===\s*0\s*\?/,
      'Must check for empty agreements array'
    );
    assert.match(
      componentSource,
      /No Recent Agreements/,
      'Must provide an empty state title'
    );
    assert.match(
      componentSource,
      /generate-agreement/,
      'Must provide action button to generate an agreement from empty state'
    );
  });

  test('6. Quick Actions: View Agreement and Download PDF functionality', () => {
    assert.match(
      componentSource,
      /handleViewAgreement\(agr\)/,
      'Must provide View action handler'
    );
    assert.match(
      componentSource,
      /downloadLegalPdf\(agr,\s*agr\.shaHash\)/,
      'Must provide Download PDF action handler with SHA hash'
    );
  });

  test('7. Glassmorphism UI & Responsive Styling', () => {
    assert.match(
      cssSource,
      /\.zd-recent-agreements-card/,
      'CSS must define .zd-recent-agreements-card'
    );
    assert.match(
      cssSource,
      /\.zd-recent-table-wrap/,
      'CSS must define responsive .zd-recent-table-wrap with overflow-x: auto'
    );
    assert.match(
      cssSource,
      /@media\s*\(max-width:\s*640px\)/,
      'CSS must define mobile responsive adaptations'
    );
  });

  test('8. Single Primary Status Badge: Removes all secondary sub-status and workflow badges', () => {
    // Verify primary status badge is rendered
    assert.ok(
      componentSource.includes('zd-recent-status-badge'),
      'Must render primary status badge'
    );

    // Verify subbadges (e.g. Tenant Signed, Link Dispatched, e-Stamp Issued, etc.) are removed
    assert.ok(
      !componentSource.includes('zd-recent-subbadge'),
      'Must NOT render any secondary zd-recent-subbadge in HomeDashboardScreen'
    );
    assert.ok(
      !componentSource.includes('agr.badges.map'),
      'Must NOT map over agr.badges in Recent Agreements table'
    );

    // Verify primary status badges are styled for Completed, Pending e-Sign, Expiring Soon, and Draft
    assert.ok(cssSource.includes('.zd-recent-status-badge--completed'));
    assert.ok(cssSource.includes('.zd-recent-status-badge--pending'));
    assert.ok(cssSource.includes('.zd-recent-status-badge--expiring'));
    assert.ok(cssSource.includes('.zd-recent-status-badge--draft'));
  });
});

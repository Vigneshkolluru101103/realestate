import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateUsageTrend,
  getCurvedPath,
  getAreaPath,
  LINE_CHART_BASELINE_USAGE
} from '../src/utils/usageAnalytics.js';

describe('Usage Trend Line Chart Redesign Verification', () => {
  const dashboardPath = path.resolve('src/screens/HomeDashboard/HomeDashboardScreen.jsx');
  const dashboardSource = fs.readFileSync(dashboardPath, 'utf-8');

  const cssPath = path.resolve('src/screens/HomeDashboard/HomeDashboard.css');
  const cssSource = fs.readFileSync(cssPath, 'utf-8');

  /* -------------------------------------------------------------
   * 1. Data Calculation & Range Filtering
   * ------------------------------------------------------------- */
  describe('1. Data Calculation & Range Filtering', () => {
    test('LINE_CHART_BASELINE_USAGE matches target reference values (18, 26, 31, 36, 45, 58)', () => {
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-06'], 18);
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-07'], 26);
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-08'], 31);
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-09'], 36);
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-10'], 45);
      assert.equal(LINE_CHART_BASELINE_USAGE['2026-11'], 58);
    });

    test('6M range returns exactly 6 rolling months Jun–Nov with baseline counts', () => {
      const result = calculateUsageTrend({
        agreements: [],
        currentUsedQuota: 58,
        range: '6m',
        referenceDate: new Date(2026, 10, 15),
        overrideHistorical: LINE_CHART_BASELINE_USAGE
      });

      assert.equal(result.trendData.length, 6);
      assert.deepEqual(
        result.trendData.map(d => d.month),
        ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
      );
      assert.deepEqual(
        result.trendData.map(d => d.count),
        [18, 26, 31, 36, 45, 58]
      );
      assert.equal(result.yAxisMax, 100);
      assert.deepEqual(result.ticks, [100, 80, 60, 40, 20, 0]);
    });

    test('3M range returns exactly 3 rolling months Sep–Nov', () => {
      const result = calculateUsageTrend({
        agreements: [],
        currentUsedQuota: 58,
        range: '3m',
        referenceDate: new Date(2026, 10, 15),
        overrideHistorical: LINE_CHART_BASELINE_USAGE
      });

      assert.equal(result.trendData.length, 3);
      assert.deepEqual(
        result.trendData.map(d => d.month),
        ['Sep', 'Oct', 'Nov']
      );
      assert.deepEqual(
        result.trendData.map(d => d.count),
        [36, 45, 58]
      );
    });

    test('1M range returns exactly 1 month (Nov)', () => {
      const result = calculateUsageTrend({
        agreements: [],
        currentUsedQuota: 58,
        range: '1m',
        referenceDate: new Date(2026, 10, 15),
        overrideHistorical: LINE_CHART_BASELINE_USAGE
      });

      assert.equal(result.trendData.length, 1);
      assert.equal(result.trendData[0].month, 'Nov');
      assert.equal(result.trendData[0].count, 58);
    });

    test('Dynamic calculation increments current month count reactively', () => {
      const result = calculateUsageTrend({
        agreements: [
          { id: 'ZD-101', date: '18 Nov 2026', status: 'In Progress' },
          { id: 'ZD-102', date: '18 Nov 2026', status: 'Pending e-Sign' }
        ],
        currentUsedQuota: 60,
        range: '6m',
        referenceDate: new Date(2026, 10, 15),
        overrideHistorical: LINE_CHART_BASELINE_USAGE
      });

      const nov = result.trendData.find(d => d.month === 'Nov');
      assert.equal(nov.count, 60, 'Nov count should reflect dynamic updates');
    });
  });

  /* -------------------------------------------------------------
   * 2. Smooth SVG Spline Geometry Generation
   * ------------------------------------------------------------- */
  describe('2. SVG Spline Geometry Generation', () => {
    test('getCurvedPath returns valid SVG cubic Bezier curve string', () => {
      const points = [
        { x: 50, y: 150 },
        { x: 150, y: 130 },
        { x: 250, y: 110 },
        { x: 350, y: 90 },
        { x: 450, y: 70 },
        { x: 550, y: 50 }
      ];
      const path = getCurvedPath(points);
      assert.ok(typeof path === 'string');
      assert.ok(path.startsWith('M 50.0 150.0'));
      assert.ok(path.includes('C '));
    });

    test('getAreaPath returns closed SVG polygon bounding the bottom', () => {
      const points = [
        { x: 50, y: 150 },
        { x: 150, y: 130 },
        { x: 250, y: 110 }
      ];
      const bottomY = 200;
      const areaPath = getAreaPath(points, bottomY);
      assert.ok(typeof areaPath === 'string');
      assert.ok(areaPath.startsWith('M 50.0 150.0'));
      assert.ok(areaPath.includes(`L 250.0 ${bottomY.toFixed(1)}`));
      assert.ok(areaPath.includes(`L 50.0 ${bottomY.toFixed(1)} Z`));
    });

    test('Handles single-point edge case safely', () => {
      const singlePoint = [{ x: 300, y: 80 }];
      const path = getCurvedPath(singlePoint);
      assert.equal(path, 'M 300.0 80.0');
      const area = getAreaPath(singlePoint, 185);
      assert.ok(area.startsWith('M 275.0 80.0'));
      assert.ok(area.includes('Z'));
    });
  });

  /* -------------------------------------------------------------
   * 3. Component Architecture & UI Elements
   * ------------------------------------------------------------- */
  describe('3. Component Architecture & UI Elements', () => {
    test('HomeDashboardScreen imports TrendingUp icon and spline helpers', () => {
      assert.ok(dashboardSource.includes('TrendingUp'), 'Must import TrendingUp icon');
      assert.ok(dashboardSource.includes('getCurvedPath'), 'Must import getCurvedPath');
      assert.ok(dashboardSource.includes('getAreaPath'), 'Must import getAreaPath');
    });

    test('HomeDashboardScreen contains 6M / 3M / 1M range filter controls', () => {
      assert.ok(dashboardSource.includes("['6M', '3M', '1M']"), '6M, 3M, 1M options must be defined');
      assert.ok(dashboardSource.includes('btn-trend-range-'), 'Range button id template must exist');
      assert.ok(dashboardSource.includes('zd-trend-range-selector'), 'Range selector container class must exist');
      assert.ok(dashboardSource.includes('zd-trend-range-pill'), 'Range pill class must exist');
    });

    test('HomeDashboardScreen renders SVG line chart with linearGradient area fill', () => {
      assert.ok(dashboardSource.includes('zd-trend-svg'), 'Must render SVG chart element');
      assert.ok(dashboardSource.includes('usageTrendAreaGradient'), 'Must define area gradient');
      assert.ok(dashboardSource.includes('zd-trend-line-stroke'), 'Must render line path');
      assert.ok(dashboardSource.includes('zd-trend-area-fill'), 'Must render area path');
    });

    test('HomeDashboardScreen renders data point pills and latest month highlight marker', () => {
      assert.ok(dashboardSource.includes('zd-trend-val-badge'), 'Must render value pills');
      assert.ok(dashboardSource.includes('trend-latest-marker'), 'Must render latest month marker ID');
      assert.ok(dashboardSource.includes('zd-trend-latest-group'), 'Must render latest month group class');
    });

    test('HomeDashboardScreen preserves refresh icon button and accessibility', () => {
      assert.ok(dashboardSource.includes('zd-trend-refresh-btn'), 'Refresh button class must be present');
      assert.ok(dashboardSource.includes('handleRefreshTrend'), 'Refresh handler must be attached');
      assert.ok(dashboardSource.includes('isRefreshingTrend'), 'Refresh state must be tracked');
    });
  });

  /* -------------------------------------------------------------
   * 4. CSS Styling & Glassmorphism Design System
   * ------------------------------------------------------------- */
  describe('4. CSS Styling & Glassmorphism Design System', () => {
    test('CSS defines header, icon badge, range toggle, and SVG chart classes', () => {
      assert.ok(cssSource.includes('.zd-trend-header'), 'Header container class must exist');
      assert.ok(cssSource.includes('.zd-trend-icon-badge'), 'Icon badge class must exist');
      assert.ok(cssSource.includes('.zd-trend-range-selector'), 'Range selector container class must exist');
      assert.ok(cssSource.includes('.zd-trend-range-pill'), 'Range pill button class must exist');
      assert.ok(cssSource.includes('.zd-trend-svg-container'), 'SVG chart container class must exist');
      assert.ok(cssSource.includes('.zd-trend-line-stroke'), 'Line stroke class must exist');
      assert.ok(cssSource.includes('.zd-trend-area-fill'), 'Area fill class must exist');
    });

    test('CSS includes responsive media queries for layout adaptations', () => {
      assert.ok(cssSource.includes('@media (max-width: 768px)'), 'Mobile 768px media query must exist');
      assert.ok(cssSource.includes('@media (max-width: 960px)'), '960px two-column grid media query must exist');
    });
  });
});

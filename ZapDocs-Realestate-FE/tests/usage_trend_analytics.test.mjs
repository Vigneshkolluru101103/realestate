import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateUsageTrend,
  getRollingMonths,
  getYAxisScale,
  getMonthKeyFromDate,
  HISTORICAL_BASELINE_USAGE
} from '../src/utils/usageAnalytics.js';

test('1. Six months of historical usage with 0-100 scale', () => {
  const result = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15) // November 2026
  });

  assert.equal(result.trendData.length, 6, 'Must return exactly 6 rolling months');
  const monthLabels = result.trendData.map((d) => d.month);
  assert.deepEqual(monthLabels, ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], 'Rolling sequence must be Jun-Nov');

  // Verify counts match baseline
  assert.equal(result.trendData[0].count, 16, 'Jun count should be 16');
  assert.equal(result.trendData[1].count, 23, 'Jul count should be 23');
  assert.equal(result.trendData[2].count, 27, 'Aug count should be 27');
  assert.equal(result.trendData[3].count, 32, 'Sep count should be 32');
  assert.equal(result.trendData[4].count, 39, 'Oct count should be 39');
  assert.equal(result.trendData[5].count, 50, 'Nov count should be 50');

  // Verify total usage and 0-100 scale
  const expectedTotal = 16 + 23 + 27 + 32 + 39 + 50;
  assert.equal(result.totalUsageInPeriod, expectedTotal);
  assert.equal(result.yAxisMax, 100, 'Y-axis max must be exactly 100');
  assert.deepEqual(result.ticks, [100, 80, 60, 40, 20, 0], 'Y-axis ticks must be 100, 80, 60, 40, 20, 0');
  assert.equal(result.trendData[5].heightPct, 50, 'Nov height is 50% against 0-100 scale');
  assert.equal(result.trendData[0].heightPct, 16, 'Jun height is 16% against 0-100 scale');
});

test('2. A month with zero usage', () => {
  const customBaseline = {
    '2026-06': 16,
    '2026-07': 0, // Zero usage month
    '2026-08': 20,
    '2026-09': 0, // Zero usage month
    '2026-10': 30,
    '2026-11': 40
  };

  const result = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 40,
    range: '6m',
    referenceDate: new Date(2026, 10, 15),
    overrideHistorical: customBaseline
  });

  const jul = result.trendData.find((d) => d.month === 'Jul');
  assert.equal(jul.count, 0, 'July count must be 0');
  assert.equal(jul.heightPct, 0, 'July bar height percentage must be 0');

  const sep = result.trendData.find((d) => d.month === 'Sep');
  assert.equal(sep.count, 0, 'September count must be 0');
  assert.equal(sep.heightPct, 0, 'September bar height percentage must be 0');
});

test('3. A successful agreement generation', () => {
  // Simulating user adding a new agreement in current month
  const initial = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // Action: Add agreement -> usedQuota increments to 51
  const updatedAgreements = [
    { id: 'ZD-9999', date: 'Today', status: 'Pending e-Sign' }
  ];
  const postAction = calculateUsageTrend({
    agreements: updatedAgreements,
    currentUsedQuota: 51,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  const novInitial = initial.trendData.find((d) => d.isCurrentMonth);
  const novPost = postAction.trendData.find((d) => d.isCurrentMonth);

  assert.equal(novInitial.count, 50);
  assert.equal(novPost.count, 51);
  assert.equal(postAction.totalUsageInPeriod, initial.totalUsageInPeriod + 1);
  assert.equal(postAction.yAxisMax, 100, 'Y-axis retains max of 100 within capacity');
  assert.equal(novPost.heightPct, 51, 'Nov bar height updates to 51%');
});

test('4. A failed agreement generation', () => {
  const initial = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // When agreement creation fails, usedQuota remains unchanged
  const postFailed = calculateUsageTrend({
    agreements: [], // No agreement added
    currentUsedQuota: 50, // Unchanged
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  assert.deepEqual(initial.trendData, postFailed.trendData);
  assert.equal(initial.totalUsageInPeriod, postFailed.totalUsageInPeriod);
});

test('5. A completed agreement', () => {
  // Agreement transitions from 'Pending e-Sign' to 'Completed'
  const agreementPending = [
    { id: 'ZD-9042', date: '12 Oct 2026', status: 'Pending e-Sign' }
  ];
  const agreementCompleted = [
    { id: 'ZD-9042', date: '12 Oct 2026', status: 'Completed' }
  ];

  const res1 = calculateUsageTrend({
    agreements: agreementPending,
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  const res2 = calculateUsageTrend({
    agreements: agreementCompleted,
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // Completing an agreement does not increment quota again (no double counting)
  assert.equal(res1.totalUsageInPeriod, res2.totalUsageInPeriod);
  assert.equal(res1.trendData[4].count, res2.trendData[4].count);
});

test('6. Duplicate status updates', () => {
  const singleDispatch = [
    { id: 'ZD-9042', date: '12 Oct 2026', whatsappDispatches: 1 }
  ];
  const tripleDispatch = [
    { id: 'ZD-9042', date: '12 Oct 2026', whatsappDispatches: 3 }
  ];

  const res1 = calculateUsageTrend({
    agreements: singleDispatch,
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  const res2 = calculateUsageTrend({
    agreements: tripleDispatch,
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // Multiple dispatches do NOT consume additional quota
  assert.deepEqual(res1.trendData, res2.trendData);
});

test('7. A cancellation or refund where applicable', () => {
  const beforeRefund = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 50,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // Quota reversal / cancellation reduces used quota by 1
  const afterRefund = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 49,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  const novBefore = beforeRefund.trendData.find((d) => d.isCurrentMonth);
  const novAfter = afterRefund.trendData.find((d) => d.isCurrentMonth);

  assert.equal(novBefore.count, 50);
  assert.equal(novAfter.count, 49);
  assert.equal(afterRefund.totalUsageInPeriod, beforeRefund.totalUsageInPeriod - 1);
});

test('8. Month and year transitions', () => {
  // Test reference date in February 2027 (crossing 2026/2027 boundary)
  const feb2027 = new Date(2027, 1, 10);
  const rolling = getRollingMonths(6, feb2027);

  assert.equal(rolling.length, 6);
  assert.deepEqual(
    rolling.map((m) => m.monthShort),
    ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  );
  assert.deepEqual(
    rolling.map((m) => m.year),
    [2026, 2026, 2026, 2026, 2027, 2027]
  );
  assert.equal(rolling[3].key, '2026-12');
  assert.equal(rolling[4].key, '2027-01');
  assert.equal(rolling[5].key, '2027-02');
  assert.equal(rolling[5].isCurrentMonth, true);
});

test('9. Dashboard reload and persistence', () => {
  // Simulating dashboard reload with saved quota state of 50
  const savedState = { usedQuota: 50, allocatedQuota: 100 };
  const result = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: savedState.usedQuota,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  assert.equal(result.currentMonthUsage, 50);
  assert.equal(result.trendData[5].count, 50);
  assert.ok(result.lastUpdated, 'Timestamp must be generated on render');
});

test('10. Returning to the dashboard after a successful action', () => {
  let state = { usedQuota: 50, agreements: [] };
  let trend1 = calculateUsageTrend({
    agreements: state.agreements,
    currentUsedQuota: state.usedQuota,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  // Action performed in another view (e.g. Agreement Generated)
  state = {
    usedQuota: 51,
    agreements: [{ id: 'ZD-9100', date: 'Today', status: 'Pending e-Sign' }]
  };

  // Navigating back to dashboard: state is reactive
  let trend2 = calculateUsageTrend({
    agreements: state.agreements,
    currentUsedQuota: state.usedQuota,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  assert.equal(trend2.trendData[5].count, 51);
  assert.equal(trend2.totalUsageInPeriod, trend1.totalUsageInPeriod + 1);
});

test('11. Safe dynamic handling of usage above 100 without clipping', () => {
  const scaleUnder100 = getYAxisScale(85);
  assert.equal(scaleUnder100.yAxisMax, 100);
  assert.deepEqual(scaleUnder100.ticks, [100, 80, 60, 40, 20, 0]);

  const scaleOver100 = getYAxisScale(115);
  assert.equal(scaleOver100.yAxisMax, 120, 'Scales up to multiple of 20 above 100');
  assert.deepEqual(scaleOver100.ticks, [120, 100, 80, 60, 40, 20, 0]);

  const result = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 115,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });
  assert.equal(result.yAxisMax, 120);
  assert.ok(result.trendData[5].heightPct <= 100, 'Bar height is proportionally scaled without clipping');
});

test('12. eStamp and eSign separate tracking and dual bar calculations', () => {
  const result = calculateUsageTrend({
    agreements: [],
    currentUsedQuota: 30,
    currentUsedEStamps: 30,
    currentUsedESigns: 30,
    range: '6m',
    referenceDate: new Date(2026, 10, 15)
  });

  const nov = result.trendData.find((d) => d.isCurrentMonth);
  assert.equal(nov.eStampCount, 30, 'Nov eStamp count should be 30');
  assert.equal(nov.eSignCount, 30, 'Nov eSign count should be 30');
  assert.equal(nov.eStampHeightPct, 30, 'Nov eStamp height should be 30% against 0-100 scale');
  assert.equal(nov.eSignHeightPct, 30, 'Nov eSign height should be 30% against 0-100 scale');

  // Verify historical months have eStamp and eSign values derived from baseline
  const oct = result.trendData.find((d) => d.month === 'Oct');
  assert.equal(oct.eStampCount, 39);
  assert.equal(oct.eSignCount, 39);
  assert.equal(oct.eStampHeightPct, 39);
  assert.equal(oct.eSignHeightPct, 39);
});

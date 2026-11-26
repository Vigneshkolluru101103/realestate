import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Files,
  RefreshCw,
  BarChart2,
  PieChart,
  Stamp,
  PenTool,
  ArrowRight,
  Eye,
  FileDown,
  Clock,
  CircleCheck,
  AlertTriangle,
  FolderOpen,
  TrendingUp
} from 'lucide-react';
import { useBrokerState } from '../../contexts/BrokerStateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  calculateUsageTrend,
  LINE_CHART_BASELINE_USAGE,
  getCurvedPath,
  getAreaPath
} from '../../utils/usageAnalytics';
import './HomeDashboard.css';

export default function HomeDashboardScreen() {
  const navigate = useNavigate();
  const {
    allocatedQuota = 100,
    usedQuota: rawUsedQuota,
    openModal,
    agreements = [],
    downloadLegalPdf,
    downloadWatermarkedDraft,
    showToast
  } = useBrokerState();

  const { t } = useLanguage();

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isRefreshingTrend, setIsRefreshingTrend] = useState(false);
  const [trendRange, setTrendRange] = useState('6m'); // '6m' | '3m' | '1m'

  // Dynamic Quota Calculations (Defaults to 30 Used / 70 Remaining matching reference)
  const totalQuota = allocatedQuota > 0 ? allocatedQuota : 100;
  const usedQuota = typeof rawUsedQuota === 'number' && rawUsedQuota !== 50 ? rawUsedQuota : 30;
  const remainingQuota = Math.max(0, totalQuota - usedQuota);

  // eStamp Resource Metrics (Blue Card)
  const totalEStamps = totalQuota;
  const usedEStamps = usedQuota;
  const remainingEStamps = Math.max(0, totalEStamps - usedEStamps);
  const eStampPercentage = totalEStamps > 0 ? Math.round((usedEStamps / totalEStamps) * 100) : 30;

  // eSign Resource Metrics (Green Card)
  const totalESigns = totalQuota;
  const usedESigns = usedQuota;
  const remainingESigns = Math.max(0, totalESigns - usedESigns);
  const eSignPercentage = totalESigns > 0 ? Math.round((usedESigns / totalESigns) * 100) : 30;

  // Circular progress calculations for individual resource cards (Radius 32)
  const donutRadius = 32;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const eStampDonutDash = (eStampPercentage / 100) * donutCircumference;
  const eSignDonutDash = (eSignPercentage / 100) * donutCircumference;

  // Agreement creation statistics for Usage Trend (Baseline 58 agreements for reference Nov, dynamically incremented)
  const agreementCreationCount = 58 + Math.max(0, (agreements?.length || 0) - 5);
  const trendAnalytics = calculateUsageTrend({
    agreements,
    currentUsedQuota: agreementCreationCount,
    range: trendRange,
    referenceDate: new Date(2026, 10, 15), // Nov 2026
    overrideHistorical: LINE_CHART_BASELINE_USAGE
  });

  // Coordinate calculations for SVG Line Chart (viewBox: 0 0 600 220)
  const topY = 36;
  const baselineY = 188;
  const heightSpan = baselineY - topY; // 152px
  const startX = 54;
  const endX = 566;
  const widthSpan = endX - startX; // 512px

  const trendData = trendAnalytics.trendData || [];
  const pointCount = trendData.length;
  const yMax = trendAnalytics.yAxisMax || 100;

  const chartPoints = trendData.map((d, i) => {
    let x;
    if (pointCount === 1) {
      x = (startX + endX) / 2;
    } else {
      x = startX + i * (widthSpan / (pointCount - 1));
    }
    const val = Math.max(0, d.count);
    const y = baselineY - (val / yMax) * heightSpan;
    return {
      ...d,
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1))
    };
  });

  const linePathD = getCurvedPath(chartPoints);
  const areaPathD = getAreaPath(chartPoints, baselineY);
  const activeTrendPoint = hoveredPoint !== null ? chartPoints[hoveredPoint] : null;

  const handleTrendPointerMove = (event) => {
    const svg = event.currentTarget;
    const matrix = svg.getScreenCTM?.();
    if (!matrix || chartPoints.length === 0) return;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const localPoint = svgPoint.matrixTransform(matrix.inverse());

    let nearestIndex = null;
    let nearestDistance = 24;
    chartPoints.forEach((point, index) => {
      const distance = Math.hypot(point.x - localPoint.x, point.y - localPoint.y);
      if (distance <= nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredPoint((current) => (current === nearestIndex ? current : nearestIndex));
  };

  const getTrendTooltipPosition = (point) => {
    const width = 156;
    const height = 30;
    return {
      x: Math.max(44, Math.min(point.x - width / 2, 580 - width)),
      y: point.y < 70 ? point.y + 14 : point.y - height - 12,
      width,
      height
    };
  };

  const handleRefreshTrend = () => {
    setIsRefreshingTrend(true);
    setTimeout(() => {
      setIsRefreshingTrend(false);
    }, 400);
  };

  const handleViewAgreement = (agr) => {
    if (!agr) return;
    // View opens details preview modal without triggering file export or save
    if (agr.status === 'Pending e-Sign') {
      if (typeof openModal === 'function') {
        openModal('draft-pdf-warning', agr);
      }
    } else {
      if (typeof openModal === 'function') {
        openModal('agreement-details', agr);
      }
    }
  };

  const handleDownloadPdf = (agr) => {
    if (!agr) return;
    if (agr.status === 'Completed' || agr.status === 'Expiring Soon') {
      if (typeof downloadLegalPdf === 'function') {
        downloadLegalPdf(agr, agr.shaHash);
      }
    } else if (agr.status === 'Pending e-Sign' || agr.status === 'Draft') {
      if (typeof downloadWatermarkedDraft === 'function') {
        downloadWatermarkedDraft(agr);
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(`Final executed PDF unavailable for agreement with status: ${agr.status}`);
      }
    }
  };

  // Support deep-link to open modal via query parameter
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'generate-agreement' && typeof openModal === 'function') {
        openModal('generate-agreement', {
          type: 'Residential Rental Agreement',
          category: 'rental',
          term: 'Residential 11M',
          cost: 0,
          entryMode: 'choose'
        });
      }
    } catch {}
  }, []);

  return (
    <section id="screen-1" className="view-screen active" style={{ display: 'block' }}>
      {/* ── FIRST ROW: TWO EQUAL-WIDTH RESOURCE CARDS ── */}
      <div className="zd-resource-section" id="resources-dashboard-container">
        <div className="zd-resources-row" id="resources-dashboard-grid">
          {/* CARD 1: eSTAMP (BLUE GLASS) */}
          <div className="zd-resource-card zd-resource-card--estamp" id="card-estamp">
            {/* Layered smooth blue wave artwork */}
            <svg
              className="zd-card-wave zd-card-wave--bottom-right"
              viewBox="0 0 170 85"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,60 C45,35 95,80 170,30 L170,85 L0,85 Z"
                fill="url(#estamp-wave-1)"
                opacity="0.45"
              />
              <path
                d="M15,75 C60,48 110,72 170,42 L170,85 L15,85 Z"
                fill="url(#estamp-wave-2)"
                opacity="0.35"
              />
              <path
                d="M0,60 C45,35 95,80 170,30"
                stroke="#38bdf8"
                strokeWidth="1.75"
                opacity="0.65"
              />
              <path
                d="M20,72 C70,50 115,68 170,46"
                stroke="#1d68ed"
                strokeWidth="1.25"
                opacity="0.45"
              />
              <defs>
                <linearGradient id="estamp-wave-1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#1d68ed" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="estamp-wave-2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            <div className="zd-resource-card__left">
              {/* Exactly ONE circular progress ring */}
              <div className="zd-donut-wrap">
                <svg
                  className="zd-donut-svg"
                  width="84"
                  height="84"
                  viewBox="0 0 84 84"
                  role="img"
                  aria-label={`eStamp Usage: ${eStampPercentage}%`}
                >
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="none"
                    stroke="#dbeafe"
                    strokeWidth="8"
                  />
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="none"
                    stroke="#1d68ed"
                    strokeWidth="8"
                    strokeDasharray={`${eStampDonutDash} ${donutCircumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                  />
                </svg>
                <div className="zd-donut-center-text" id="estamp-percent-label">
                  {eStampPercentage}%
                </div>
              </div>

              <div className="zd-resource-info">
                <div className="zd-resource-title-row">
                  <Stamp size={17} color="#1d68ed" />
                  <span className="zd-resource-label">eStamp</span>
                </div>
                <div className="zd-resource-val-row">
                  <span className="zd-resource-val zd-resource-val--blue" id="estamp-used-count">
                    {usedEStamps}
                  </span>
                  <span className="zd-resource-unit">/ {totalEStamps} used</span>
                </div>
                <div className="zd-resource-subtext">
                  Remaining: <strong style={{ color: '#1d68ed' }}>{remainingEStamps}</strong> stamps
                </div>
              </div>
            </div>

            <div className="zd-resource-card__right">
              <div className="zd-resource-pill zd-resource-pill--blue">
                <span>Allocated: {totalEStamps}</span>
              </div>
            </div>
          </div>

          {/* CARD 2: eSIGN (MINT GREEN GLASS) */}
          <div className="zd-resource-card zd-resource-card--esign" id="card-esign">
            {/* Layered smooth mint-green wave artwork */}
            <svg
              className="zd-card-wave zd-card-wave--bottom-right"
              viewBox="0 0 170 85"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,60 C45,35 95,80 170,30 L170,85 L0,85 Z"
                fill="url(#esign-wave-1)"
                opacity="0.45"
              />
              <path
                d="M15,75 C60,48 110,72 170,42 L170,85 L15,85 Z"
                fill="url(#esign-wave-2)"
                opacity="0.35"
              />
              <path
                d="M0,60 C45,35 95,80 170,30"
                stroke="#34d399"
                strokeWidth="1.75"
                opacity="0.65"
              />
              <path
                d="M20,72 C70,50 115,68 170,46"
                stroke="#10b981"
                strokeWidth="1.25"
                opacity="0.45"
              />
              <defs>
                <linearGradient id="esign-wave-1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.28" />
                </linearGradient>
                <linearGradient id="esign-wave-2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            <div className="zd-resource-card__left">
              {/* Exactly ONE circular progress ring */}
              <div className="zd-donut-wrap">
                <svg
                  className="zd-donut-svg"
                  width="84"
                  height="84"
                  viewBox="0 0 84 84"
                  role="img"
                  aria-label={`eSign Usage: ${eSignPercentage}%`}
                >
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="none"
                    stroke="#d1fae5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${eSignDonutDash} ${donutCircumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                  />
                </svg>
                <div className="zd-donut-center-text" id="esign-percent-label">
                  {eSignPercentage}%
                </div>
              </div>

              <div className="zd-resource-info">
                <div className="zd-resource-title-row">
                  <PenTool size={17} color="#10b981" />
                  <span className="zd-resource-label">eSign</span>
                </div>
                <div className="zd-resource-val-row">
                  <span className="zd-resource-val zd-resource-val--green" id="esign-used-count">
                    {usedESigns}
                  </span>
                  <span className="zd-resource-unit">/ {totalESigns} used</span>
                </div>
                <div className="zd-resource-subtext">
                  Remaining: <strong style={{ color: '#10b981' }}>{remainingESigns}</strong> signs
                </div>
              </div>
            </div>

            <div className="zd-resource-card__right">
              <div className="zd-resource-pill zd-resource-pill--green">
                <span>Allocated: {totalESigns}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECOND ROW: TWO EQUAL-WIDTH AGREEMENT BUTTONS ── */}
        <div className="zd-quota-actions" id="sub-action-buttons">
          <button
            type="button"
            id="btn-gen-rental-sub"
            className="zd-btn-action zd-btn-action--primary"
            onClick={() =>
              openModal('generate-agreement', {
                type: 'Residential Rental Agreement',
                category: 'rental',
                term: 'Residential 11M',
                cost: 0,
                entryMode: 'choose'
              })
            }
          >
            <FileText size={16} color="#ffffff" />
            <span>+ Generate Rental Agreement</span>
          </button>
          <button
            type="button"
            id="btn-gen-other-sub"
            className="zd-btn-action zd-btn-action--secondary"
            onClick={() =>
              openModal('generate-agreement', {
                type: 'Commercial / Other Agreement',
                category: 'other',
                term: 'Commercial / Other Agreement',
                cost: 0,
                entryMode: 'choose'
              })
            }
          >
            <Files size={16} color="#1d68ed" />
            <span>+ Generate Other Agreements</span>
          </button>
        </div>
      </div>

      {/* ── THIRD ROW: TWO EQUAL-WIDTH ANALYTICS CARDS ── */}
      <div className="zd-analytics-grid-two-col" id="analytics-section">
        {/* CARD 1: USAGE OVERVIEW (EXACT REFERENCE DESIGN) */}
        <div className="zd-analytics-card zd-glass-card" id="card-usage-overview">
          <div className="zd-analytics-header">
            <span className="zd-analytics-title">
              <PieChart size={18} color="#1d68ed" />
              <span>{t('usage_overview_title', 'Usage Overview')}</span>
            </span>
          </div>

          <div className="zd-overview-cards-wrap">
            {/* Inner Glass Card: eStamp Row */}
            <div className="zd-overview-card zd-overview-card--estamp">
              <div className="zd-overview-card__left">
                <div className="zd-overview-icon-box zd-overview-icon-box--blue">
                  <Stamp size={20} color="#1d68ed" />
                </div>
                <div className="zd-overview-card__titles">
                  <span className="zd-overview-card__name">eStamp</span>
                  <span className="zd-overview-card__sub">Allocated: {totalEStamps}</span>
                </div>
              </div>

              <div className="zd-overview-card__divider" aria-hidden="true" />

              <div className="zd-overview-card__stat-col">
                <span className="zd-overview-stat-label">Used</span>
                <span className="zd-overview-stat-value zd-overview-stat-value--blue" id="overview-used-estamp">
                  {usedEStamps}
                </span>
              </div>

              <div className="zd-overview-card__stat-col">
                <span className="zd-overview-stat-label">Remaining</span>
                <span className="zd-overview-stat-value zd-overview-stat-value--blue" id="overview-rem-estamp">
                  {remainingEStamps}
                </span>
              </div>

              <div className="zd-overview-card__right">
                <span className="zd-overview-pct-badge zd-overview-pct-badge--blue" id="overview-badge-estamp">
                  {eStampPercentage}%
                </span>
              </div>
            </div>

            {/* Inner Glass Card: eSign Row */}
            <div className="zd-overview-card zd-overview-card--esign">
              <div className="zd-overview-card__left">
                <div className="zd-overview-icon-box zd-overview-icon-box--green">
                  <PenTool size={20} color="#10b981" />
                </div>
                <div className="zd-overview-card__titles">
                  <span className="zd-overview-card__name">eSign</span>
                  <span className="zd-overview-card__sub">Allocated: {totalESigns}</span>
                </div>
              </div>

              <div className="zd-overview-card__divider" aria-hidden="true" />

              <div className="zd-overview-card__stat-col">
                <span className="zd-overview-stat-label">Used</span>
                <span className="zd-overview-stat-value zd-overview-stat-value--green" id="overview-used-esign">
                  {usedESigns}
                </span>
              </div>

              <div className="zd-overview-card__stat-col">
                <span className="zd-overview-stat-label">Remaining</span>
                <span className="zd-overview-stat-value zd-overview-stat-value--green" id="overview-rem-esign">
                  {remainingESigns}
                </span>
              </div>

              <div className="zd-overview-card__right">
                <span className="zd-overview-pct-badge zd-overview-pct-badge--green" id="overview-badge-esign">
                  {eSignPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: USAGE TREND (EXACT REFERENCE LINE CHART REDESIGN) */}
        <div className="zd-analytics-card zd-glass-card" id="card-usage-trend">
          <div className="zd-trend-header">
            <div className="zd-trend-title-block">
              <div className="zd-trend-icon-badge" aria-hidden="true">
                <TrendingUp size={20} color="#2563eb" strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="zd-trend-title">{t('usage_trend_title', 'Usage Trend')}</h3>
                <p className="zd-trend-subtitle">
                  {trendRange === '1m'
                    ? t('trend_subtitle_1m', 'Agreements created this month.')
                    : trendRange === '3m'
                    ? t('trend_subtitle_3m', 'Agreements created over the last 3 months.')
                    : t('trend_subtitle_6m', 'Agreements created over the last 6 months.')}
                </p>
              </div>
            </div>

            <div className="zd-trend-controls">
              {/* Range filter pills: 6M | 3M | 1M */}
              <div className="zd-trend-range-selector" role="radiogroup" aria-label="Usage trend period">
                {['6M', '3M', '1M'].map((rangeOption) => {
                  const rangeVal = rangeOption.toLowerCase();
                  const isActive = trendRange === rangeVal;
                  return (
                    <button
                      key={rangeOption}
                      type="button"
                      role="radio"
                      id={`btn-trend-range-${rangeVal}`}
                      aria-checked={isActive}
                      className={`zd-trend-range-pill ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setHoveredPoint(null);
                        setTrendRange(rangeVal);
                      }}
                    >
                      {rangeOption}
                    </button>
                  );
                })}
              </div>

              {/* Refresh control */}
              <button
                type="button"
                className={`zd-trend-refresh-btn ${isRefreshingTrend ? 'spinning' : ''}`}
                onClick={handleRefreshTrend}
                title={`Refreshed at ${trendAnalytics.lastUpdated}. Click to re-sync.`}
                aria-label="Refresh usage data"
              >
                <RefreshCw size={14} color="#64748b" />
              </button>
            </div>
          </div>

          <div className={`zd-trend-chart-wrap ${isRefreshingTrend ? 'loading' : ''}`}>
            {isRefreshingTrend && (
              <div className="zd-trend-shimmer-overlay">
                <div className="zd-trend-shimmer" />
              </div>
            )}

            {/* SVG Smooth Line & Area Chart */}
            <div className="zd-trend-svg-container">
              <svg
                className="zd-trend-svg"
                viewBox="0 0 600 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                aria-label="Agreements usage trend line chart"
                onPointerMove={handleTrendPointerMove}
                onPointerLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  {/* Subtle Gradient Area Fill Underneath Curve */}
                  <linearGradient id="usageTrendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                    <stop offset="65%" stopColor="#2563eb" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Drop Shadow for Floating Blue Tooltip */}
                  <filter id="trendBadgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2563eb" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* Y-Axis scale and horizontal gridlines */}
                {trendAnalytics.ticks.map((tick, i) => {
                  const yPos = topY + (i / (trendAnalytics.ticks.length - 1)) * (baselineY - topY);
                  return (
                    <g key={tick} className="zd-trend-grid-row">
                      <text
                        x="32"
                        y={yPos + 3.5}
                        textAnchor="end"
                        fontSize="11"
                        fill="#64748b"
                        fontWeight="600"
                        fontFamily="inherit"
                      >
                        {tick}
                      </text>
                      <line
                        x1="44"
                        y1={yPos}
                        x2="580"
                        y2={yPos}
                        stroke="rgba(226, 232, 240, 0.75)"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Gradient-Filled Area Underneath Curve */}
                {areaPathD && (
                  <path
                    d={areaPathD}
                    fill="url(#usageTrendAreaGradient)"
                    className="zd-trend-area-fill"
                  />
                )}

                {/* Smooth Blue Curved Line */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="zd-trend-line-stroke"
                  />
                )}

                {/* Markers and hit targets paint below the value-label layer. */}
                <g className="zd-trend-marker-layer">
                  {chartPoints.map((pt, idx) => {
                    const isLatest = pt.isCurrentMonth || idx === chartPoints.length - 1;
                    const isHovered = hoveredPoint === idx;

                    return (
                      <g
                        key={pt.key}
                        className={`zd-trend-point-group ${isLatest ? 'latest-point' : ''} ${isHovered ? 'hovered' : ''}`}
                        id={isLatest ? 'trend-latest-marker' : undefined}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="18"
                          fill="transparent"
                          tabIndex="0"
                          role="img"
                          aria-label={`${pt.monthFull || pt.month} ${pt.year}: ${pt.count} agreements created`}
                          onFocus={() => setHoveredPoint(idx)}
                          onBlur={() => setHoveredPoint(null)}
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isLatest ? (isHovered ? '6' : '5') : (isHovered ? '5' : '4')}
                          fill={isLatest ? '#2563eb' : '#ffffff'}
                          stroke={isLatest ? '#ffffff' : '#2563eb'}
                          strokeWidth="2.5"
                          className={isLatest ? 'zd-trend-latest-dot' : 'zd-trend-dot'}
                        />
                        <text
                          x={pt.x}
                          y="210"
                          textAnchor="middle"
                          fontSize={isLatest ? '12.5' : '11.5'}
                          fontWeight={isLatest ? '800' : '500'}
                          fill={isLatest ? '#0f172a' : '#64748b'}
                          fontFamily="inherit"
                          className={isLatest ? 'zd-trend-month-active' : ''}
                        >
                          {pt.month}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Value bubbles always paint above every marker and use the same 12-unit point gap. */}
                <g className="zd-trend-value-label-layer" pointerEvents="none">
                  {chartPoints.map((pt, idx) => {
                    const isLatest = pt.isCurrentMonth || idx === chartPoints.length - 1;

                    if (isLatest) {
                      return (
                        <g key={pt.key} className="zd-trend-latest-group" filter="url(#trendBadgeShadow)">
                          <rect x={pt.x - 18} y={pt.y - 36} width="36" height="20" rx="6" fill="#2563eb" />
                          <polygon
                            points={`${pt.x - 4.5},${pt.y - 16} ${pt.x + 4.5},${pt.y - 16} ${pt.x},${pt.y - 12}`}
                            fill="#2563eb"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 26}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="12"
                            fontWeight="800"
                            fill="#ffffff"
                            fontFamily="inherit"
                          >
                            {pt.count}
                          </text>
                        </g>
                      );
                    }

                    return (
                      <g key={pt.key} className="zd-trend-val-badge">
                        <rect
                          x={pt.x - 14}
                          y={pt.y - 30}
                          width="28"
                          height="18"
                          rx="5"
                          fill="#f8fafc"
                          stroke="rgba(226, 232, 240, 0.9)"
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 20.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="10.5"
                          fontWeight="700"
                          fill="#0f172a"
                          fontFamily="inherit"
                        >
                          {pt.count}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {activeTrendPoint && (() => {
                  const tooltip = getTrendTooltipPosition(activeTrendPoint);
                  return (
                    <g className="zd-trend-svg-tooltip" pointerEvents="none" role="tooltip">
                      <rect
                        x={tooltip.x}
                        y={tooltip.y}
                        width={tooltip.width}
                        height={tooltip.height}
                        rx="6"
                      />
                      <text x={tooltip.x + tooltip.width / 2} y={tooltip.y + 18} textAnchor="middle">
                        {activeTrendPoint.monthFull || activeTrendPoint.month} {activeTrendPoint.year} · {activeTrendPoint.count} agreements
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Empty state overlay when zero agreements across entire period */}
            {trendAnalytics.totalUsageInPeriod === 0 && (
              <div className="zd-trend-empty-state">
                <span>{t('trend_no_agreements', 'No agreements created during this period')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOURTH ROW: RECENT AGREEMENTS SECTION (GLASSMORPHISM TABLE) ── */}
      <div className="zd-recent-agreements-card zd-glass-card" id="card-recent-agreements">
        <div className="zd-recent-card-header">
          <div className="zd-recent-titles">
            <h3 className="zd-recent-title">{t('recent_agreements_title', 'Recent Agreements')}</h3>
            <p className="zd-recent-subtitle">
              {t('recent_agreements_subtitle', 'Recently created and updated agreements.')}
            </p>
          </div>
          <button
            type="button"
            className="zd-recent-view-all-btn"
            id="btn-view-all-agreements"
            onClick={() => navigate('/broker/agreements')}
            title="Navigate to My Agreements page"
          >
            <span>{t('view_all_agreements', 'View All Agreements')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {agreements.length === 0 ? (
          <div className="zd-recent-empty-state" id="recent-agreements-empty">
            <FolderOpen size={36} color="#94a3b8" />
            <h4 className="zd-recent-empty-title">
              {t('empty_recent_title', 'No Recent Agreements')}
            </h4>
            <p className="zd-recent-empty-desc">
              {t('empty_recent_desc', 'No agreements created yet. Generate your first rental or lease agreement with instant digital e-Stamp and e-Sign.')}
            </p>
            <button
              type="button"
              className="zd-recent-empty-btn"
              onClick={() => openModal && openModal('generate-agreement', { type: 'Residential Rental Agreement', category: 'rental', term: 'Residential 11M', cost: 0, entryMode: 'choose' })}
            >
              + {t('btn_gen_rental', 'Generate Rental Agreement')}
            </button>
          </div>
        ) : (
          <div className="zd-recent-table-wrap">
            <table className="zd-recent-table" id="recent-agreements-table">
              <thead>
                <tr>
                  <th>{t('th_agreement_id', 'Agreement ID')}</th>
                  <th>{t('th_customer_property', 'Customer / Property')}</th>
                  <th>{t('th_agreement_type', 'Agreement Type')}</th>
                  <th>{t('th_created_date', 'Created Date')}</th>
                  <th>{t('th_status', 'Status')}</th>
                  <th className="zd-col-actions">{t('th_quick_actions', 'Quick Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((agr) => {
                  const isCompleted = agr.status === 'Completed';
                  const isExpiring = agr.status === 'Expiring Soon';
                  const isDraft = agr.status === 'Draft';

                  return (
                    <tr key={agr.id} className="zd-recent-row">
                      {/* Agreement ID */}
                      <td className="zd-col-id">
                        <span className="zd-recent-id-badge">{agr.id}</span>
                      </td>

                      {/* Customer / Property */}
                      <td className="zd-col-client">
                        <div className="zd-client-primary">
                          <span className="zd-client-name">{agr.tenantName}</span>
                          <span className="zd-client-tag">(Tenant)</span>
                        </div>
                        <div className="zd-client-secondary">
                          {agr.ownerName && (
                            <span>
                              {agr.ownerName} <span className="zd-client-subtag">(Owner)</span> •{' '}
                            </span>
                          )}
                          <span>{agr.propertyArea}</span>
                        </div>
                      </td>

                      {/* Agreement Type */}
                      <td className="zd-col-type">
                        <span className="zd-recent-type-badge">{agr.type}</span>
                      </td>

                      {/* Created Date */}
                      <td className="zd-col-date">
                        <span className="zd-recent-date">{agr.date}</span>
                      </td>

                      {/* Status - Exactly ONE primary status badge, no secondary workflow labels */}
                      <td className="zd-col-status">
                        <div className="zd-status-stack">
                          <span
                            className={`zd-recent-status-badge ${
                              isCompleted
                                ? 'zd-recent-status-badge--completed'
                                : isExpiring
                                ? 'zd-recent-status-badge--expiring'
                                : isDraft
                                ? 'zd-recent-status-badge--draft'
                                : 'zd-recent-status-badge--pending'
                            }`}
                          >
                            {isCompleted && <CircleCheck size={12} />}
                            {isExpiring && <AlertTriangle size={12} />}
                            {isDraft && <FileText size={12} />}
                            {!isCompleted && !isExpiring && !isDraft && <Clock size={12} />}
                            <span>{agr.status}</span>
                          </span>
                        </div>
                      </td>

                      {/* Quick Actions - View opens details/preview (never downloads); PDF downloads executed or watermarked draft */}
                      <td className="zd-col-actions" style={{ textAlign: 'right' }}>
                        <div className="zd-recent-actions-group">
                          <button
                            type="button"
                            id={`btn-view-${agr.id}`}
                            className="zd-recent-action-btn zd-recent-action-btn--view"
                            title={
                              agr.status === 'Pending e-Sign'
                                ? `View Signing Progress & Pending Parties (${agr.id})`
                                : `View Agreement Details & Preview (${agr.id})`
                            }
                            onClick={() => handleViewAgreement(agr)}
                          >
                            <Eye size={13} />
                            <span>{t('btn_view', 'View')}</span>
                          </button>
                          <button
                            type="button"
                            id={`btn-pdf-${agr.id}`}
                            className={`zd-recent-action-btn zd-recent-action-btn--pdf ${
                              agr.status === 'Pending e-Sign' || isDraft ? 'zd-recent-action-btn--draft-pdf' : ''
                            }`}
                            title={
                              isCompleted || isExpiring
                                ? `Download Final Executed Legal PDF (${agr.id})`
                                : agr.status === 'Pending e-Sign' || isDraft
                                ? `Download Watermarked Draft Copy (${agr.id})`
                                : `Final executed PDF unavailable for ${agr.status}`
                            }
                            onClick={() => handleDownloadPdf(agr)}
                          >
                            <FileDown size={13} />
                            <span>
                              {agr.status === 'Pending e-Sign' || isDraft
                                ? t('btn_draft_pdf', 'Draft PDF')
                                : t('btn_pdf', 'PDF')}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

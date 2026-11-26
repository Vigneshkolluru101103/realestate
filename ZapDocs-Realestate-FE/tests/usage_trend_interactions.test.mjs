import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const screen = readFileSync(
  new URL('../src/screens/HomeDashboard/HomeDashboardScreen.jsx', import.meta.url),
  'utf8'
);
const css = readFileSync(
  new URL('../src/screens/HomeDashboard/HomeDashboard.css', import.meta.url),
  'utf8'
);

describe('Usage Trend chart interaction geometry', () => {
  test('translates pointer coordinates through the rendered SVG transform before selecting a point', () => {
    assert.match(screen, /getScreenCTM\?\.\(\)/);
    assert.match(screen, /createSVGPoint\(\)/);
    assert.match(screen, /matrixTransform\(matrix\.inverse\(\)\)/);
    assert.match(screen, /Math\.hypot\(point\.x - localPoint\.x, point\.y - localPoint\.y\)/);
  });

  test('uses one SVG-level pointer lifecycle and clears the active point on exit or range changes', () => {
    assert.match(screen, /onPointerMove=\{handleTrendPointerMove\}/);
    assert.match(screen, /onPointerLeave=\{\(\) => setHoveredPoint\(null\)\}/);
    assert.doesNotMatch(screen, /onMouseEnter/);
    assert.doesNotMatch(screen, /onMouseLeave/);
    assert.match(screen, /setHoveredPoint\(null\);\s*setTrendRange\(rangeVal\)/);
  });

  test('renders the active tooltip inside the SVG and removes duplicate hover markers', () => {
    assert.match(screen, /className="zd-trend-svg-tooltip"/);
    assert.match(screen, /getTrendTooltipPosition\(activeTrendPoint\)/);
    assert.doesNotMatch(screen, /r="9"/);
    assert.doesNotMatch(screen, /zd-trend-interactive-tooltip/);
    assert.doesNotMatch(css, /\.zd-trend-point-group:hover \.zd-trend-dot/);
  });

  test('keeps tooltip and marker output within the rendered chart surface', () => {
    assert.match(css, /\.zd-trend-svg-container\s*\{[\s\S]*overflow: hidden/);
    assert.match(css, /\.zd-trend-svg\s*\{[\s\S]*overflow: hidden/);
    assert.match(screen, /tabIndex="0"/);
    assert.match(screen, /onFocus=\{\(\) => setHoveredPoint\(idx\)\}/);
  });

  test('paints value bubbles in a dedicated foreground layer with a stable point gap', () => {
    const markerLayer = screen.indexOf('className="zd-trend-marker-layer"');
    const valueLayer = screen.indexOf('className="zd-trend-value-label-layer"');

    assert.ok(markerLayer >= 0, 'marker layer must exist');
    assert.ok(valueLayer > markerLayer, 'value labels must paint after markers');
    assert.match(screen, /y=\{pt\.y - 30\}[\s\S]*height="18"/);
    assert.match(screen, /y=\{pt\.y - 36\}[\s\S]*height="20"/);
    assert.match(screen, /\$\{pt\.x\},\$\{pt\.y - 12\}/);
  });
});

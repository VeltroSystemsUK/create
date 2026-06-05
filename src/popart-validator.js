/**
 * Pop Art Spec Validator
 * Comprehensive constraint checking and validation engine
 */

const PopArtValidator = {
  knowledgebase: null,

  async init() {
    try {
      const response = await fetch('/src/popart-knowledgebase.json');
      this.knowledgebase = await response.json();
      return true;
    } catch (err) {
      console.error('Failed to load knowledgebase for validator:', err);
      return false;
    }
  },

  /**
   * Complete validation report
   */
  validate(spec) {
    const report = {
      isValid: true,
      timestamp: new Date().toISOString(),
      checks: [],
      categories: {
        critical: { count: 0, items: [] },
        warning: { count: 0, items: [] },
        info: { count: 0, items: [] }
      }
    };

    if (!spec || typeof spec !== 'object') {
      report.isValid = false;
      report.checks.push({
        category: 'Structure',
        severity: 'critical',
        passed: false,
        message: 'Spec is not a valid object'
      });
      return report;
    }

    // Run all validation checks
    report.checks.push(...this.checkStructure(spec));
    report.checks.push(...this.checkPathComplexity(spec));
    report.checks.push(...this.checkLayerNesting(spec));
    report.checks.push(...this.checkAnimationLoop(spec));
    report.checks.push(...this.checkFramerate(spec));
    report.checks.push(...this.checkUnsupportedFeatures(spec));
    report.checks.push(...this.checkColorPalette(spec));
    report.checks.push(...this.checkTextHandling(spec));
    report.checks.push(...this.checkLinework(spec));
    report.checks.push(...this.checkPatternOptimization(spec));
    report.checks.push(...this.checkMotionPrinciples(spec));

    // Aggregate results
    report.checks.forEach(check => {
      const category = check.severity.toLowerCase();
      if (report.categories[category]) {
        report.categories[category].count++;
        report.categories[category].items.push(check);
      }

      if (!check.passed && check.severity === 'critical') {
        report.isValid = false;
      }
    });

    report.summary = `${report.categories.critical.count} critical, ${report.categories.warning.count} warnings, ${report.categories.info.count} info`;

    return report;
  },

  // ── VALIDATION CHECKS ──

  checkStructure(spec) {
    const checks = [];
    const requiredSections = [
      'concept_overview',
      'palette_textures',
      'vector_layer_hierarchy',
      'motion_keyframes'
    ];

    requiredSections.forEach(section => {
      checks.push({
        category: 'Structure',
        name: `Has ${section}`,
        severity: 'critical',
        passed: !!spec[section],
        message: spec[section]
          ? `✓ Section '${section}' present`
          : `✗ Missing required section: '${section}'`
      });
    });

    return checks;
  },

  checkPathComplexity(spec) {
    const checks = [];
    const nodeCountStr = JSON.stringify(spec).match(/(\d+)\s*(?:nodes|vertices|estimated_nodes)/gi);
    let totalNodes = 0;

    if (nodeCountStr) {
      nodeCountStr.forEach(str => {
        const num = parseInt(str.match(/\d+/)[0]);
        totalNodes += num;
      });
    } else {
      const hierarchyStr = JSON.stringify(spec.vector_layer_hierarchy || {});
      totalNodes = (hierarchyStr.match(/point|node|vertex/gi) || []).length * 20; // Rough estimate
    }

    const maxNodes = 2000;
    const passed = totalNodes <= maxNodes;

    checks.push({
      category: 'Path Complexity',
      name: 'Vector node count',
      severity: 'critical',
      passed,
      message: passed
        ? `✓ Estimated ${totalNodes} nodes (within ${maxNodes} limit)`
        : `✗ Estimated ${totalNodes} nodes exceeds ${maxNodes} limit`
    });

    return checks;
  },

  checkLayerNesting(spec) {
    const checks = [];
    const maxDepth = 3;

    let actualDepth = 0;
    const hierarchy = spec.vector_layer_hierarchy?.layer_tree || [];

    const measureDepth = (layers, depth = 0) => {
      actualDepth = Math.max(actualDepth, depth);
      if (Array.isArray(layers)) {
        layers.forEach(layer => {
          if (layer.children) {
            measureDepth(layer.children, depth + 1);
          }
        });
      }
    };

    measureDepth(hierarchy);

    checks.push({
      category: 'Layer Nesting',
      name: 'Max nesting depth',
      severity: 'critical',
      passed: actualDepth <= maxDepth,
      message: actualDepth <= maxDepth
        ? `✓ Nesting depth: ${actualDepth} levels (within ${maxDepth} limit)`
        : `✗ Nesting depth: ${actualDepth} levels exceeds ${maxDepth} limit`
    });

    return checks;
  },

  checkAnimationLoop(spec) {
    const checks = [];

    const seamlessLoop = JSON.stringify(spec).toLowerCase().includes('seamless_loop_check: pass')
      || JSON.stringify(spec).toLowerCase().includes('frame 0 == final frame');

    checks.push({
      category: 'Animation Loop',
      name: 'Seamless looping',
      severity: 'critical',
      passed: seamlessLoop,
      message: seamlessLoop
        ? `✓ Animation loops seamlessly (frame 0 = final frame)`
        : `⚠ Verify that frame 0 state matches final frame state for seamless looping`
    });

    return checks;
  },

  checkFramerate(spec) {
    const checks = [];
    const fps = spec.concept_overview?.fps || parseInt(JSON.stringify(spec).match(/fps[:\s]*(\d+)/i)?.[1]) || null;
    const validFps = [24, 30];

    checks.push({
      category: 'Framerate',
      name: 'FPS setting',
      severity: 'warning',
      passed: fps && validFps.includes(fps),
      message: fps && validFps.includes(fps)
        ? `✓ Framerate set to ${fps} fps (ideal for comic animation)`
        : `⚠ Framerate should be 24 or 30 fps. Current: ${fps || 'not specified'}`
    });

    return checks;
  },

  checkUnsupportedFeatures(spec) {
    const checks = [];
    const specStr = JSON.stringify(spec).toLowerCase();

    const unsupported = [
      { feature: 'blur', pattern: /blur/ },
      { feature: 'glow', pattern: /glow/ },
      { feature: 'shadow effect', pattern: /shadow\s*effect/ },
      { feature: 'gradient', pattern: /gradient(?!_)/ },
      { feature: 'raster mask', pattern: /raster\s*mask/ },
      { feature: 'layer style', pattern: /layer\s*style/ },
      { feature: 'bevel', pattern: /bevel/ }
    ];

    unsupported.forEach(({ feature, pattern }) => {
      const hasFeature = pattern.test(specStr);

      checks.push({
        category: 'Unsupported Features',
        name: feature,
        severity: 'critical',
        passed: !hasFeature,
        message: hasFeature
          ? `✗ Contains unsupported feature: ${feature} (not supported in Lottie)`
          : `✓ No ${feature} detected`
      });
    });

    return checks;
  },

  checkColorPalette(spec) {
    const checks = [];
    const paletteSec = spec.palette_textures || {};
    const colors = paletteSec.primary_colors || [];

    const validHex = colors.every(c =>
      typeof c === 'object' && /^#[0-9A-F]{6}$/.test(c.hex)
      || typeof c === 'string' && /^#[0-9A-F]{6}$/.test(c)
    );

    checks.push({
      category: 'Color Palette',
      name: 'Hex format compliance',
      severity: 'warning',
      passed: validHex || colors.length === 0,
      message: validHex || colors.length === 0
        ? `✓ All colors use valid hex format (#RRGGBB)`
        : `⚠ Some colors don't use hex format`
    });

    const isPrimaryColors = JSON.stringify(colors).match(/#(FF00FF|00FFFF|FFFF00)/i);

    checks.push({
      category: 'Color Palette',
      name: 'Primary color usage',
      severity: 'warning',
      passed: !!isPrimaryColors,
      message: isPrimaryColors
        ? `✓ Uses primary Pop Art colors (Magenta, Cyan, Yellow)`
        : `⚠ Consider using primary Pop Art colors for authentic aesthetic`
    });

    return checks;
  },

  checkTextHandling(spec) {
    const checks = [];
    const specStr = JSON.stringify(spec).toLowerCase();

    const hasFont = specStr.includes('font:') || specStr.includes('font_family');
    const convertedToPaths = specStr.includes('converted to paths')
      || specStr.includes('text_element') && specStr.includes('vector paths');

    checks.push({
      category: 'Text Handling',
      name: 'Text to vector paths conversion',
      severity: 'critical',
      passed: !hasFont || convertedToPaths,
      message: convertedToPaths
        ? `✓ Text converted to vector paths (no font dependencies)`
        : `✗ Text must be converted to vector paths before Lottie export`
    });

    return checks;
  },

  checkLinework(spec) {
    const checks = [];
    const strokeMatch = JSON.stringify(spec).match(/stroke[:\s]*(\d+)px/gi);
    const widths = [];

    if (strokeMatch) {
      strokeMatch.forEach(match => {
        const width = parseInt(match.match(/\d+/)[0]);
        widths.push(width);
      });
    }

    const validWidths = widths.every(w => w >= 3 && w <= 8);

    checks.push({
      category: 'Linework',
      name: 'Stroke width range',
      severity: 'warning',
      passed: widths.length === 0 || validWidths,
      message: validWidths || widths.length === 0
        ? `✓ Stroke widths in valid 3-8px range: ${widths.join(', ') || 'not specified'}`
        : `⚠ Some strokes outside 3-8px range (found: ${widths.join(', ')})`
    });

    return checks;
  },

  checkPatternOptimization(spec) {
    const checks = [];
    const patternType = spec.palette_textures?.pattern_type || '';

    const benDayWarning = patternType.toLowerCase().includes('ben_day') || patternType.toLowerCase().includes('dot');

    checks.push({
      category: 'Pattern Optimization',
      name: 'Pattern type choice',
      severity: 'warning',
      passed: !benDayWarning,
      message: benDayWarning
        ? `⚠ Ben-Day dots can impact performance. Consider diagonal_stripes for better Lottie compatibility`
        : `✓ Using optimized pattern type: ${patternType || 'not specified'}`
    });

    return checks;
  },

  checkMotionPrinciples(spec) {
    const checks = [];
    const keyframes = spec.motion_keyframes || {};
    const hasSections = keyframes.animation_segments && keyframes.animation_segments.length > 0;

    checks.push({
      category: 'Motion Principles',
      name: 'Animation segments defined',
      severity: 'info',
      passed: !!hasSections,
      message: hasSections
        ? `✓ Animation broken into ${keyframes.animation_segments.length} segments`
        : `⚠ Define animation segments for clearer motion breakdown`
    });

    const hasEasing = keyframes.easing_curves && Object.keys(keyframes.easing_curves).length > 0;

    checks.push({
      category: 'Motion Principles',
      name: 'Easing curves specified',
      severity: 'info',
      passed: !!hasEasing,
      message: hasEasing
        ? `✓ Easing curves defined for snappy motion`
        : `⚠ Consider specifying easing curves like [0.175, 0.885, 0.32, 1.275]`
    });

    return checks;
  },

  /**
   * Generate detailed validation report
   */
  generateReport(spec) {
    const validation = this.validate(spec);

    let reportHtml = `
      <h2>Validation Report</h2>
      <p><strong>Valid:</strong> ${validation.isValid ? 'YES ✓' : 'NO ✗'}</p>
      <p><strong>Summary:</strong> ${validation.summary}</p>

      <h3>Critical Issues (${validation.categories.critical.count})</h3>
      <ul>
        ${validation.categories.critical.items.map(item =>
          `<li><strong>${item.name}:</strong> ${item.message}</li>`
        ).join('') || '<li>None - all critical checks passed!</li>'}
      </ul>

      <h3>Warnings (${validation.categories.warning.count})</h3>
      <ul>
        ${validation.categories.warning.items.map(item =>
          `<li><strong>${item.name}:</strong> ${item.message}</li>`
        ).join('') || '<li>None - no warnings</li>'}
      </ul>

      <h3>Info (${validation.categories.info.count})</h3>
      <ul>
        ${validation.categories.info.items.map(item =>
          `<li><strong>${item.name}:</strong> ${item.message}</li>`
        ).join('') || '<li>None</li>'}
      </ul>
    `;

    return reportHtml;
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PopArtValidator.init());
} else {
  PopArtValidator.init();
}

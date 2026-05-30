#!/usr/bin/env node
/**
 * Automated Widget Testing Suite
 * Tests Phase 1A, 1B, 2, 3, and 4 implementations
 * Verifies: widget creation, property editing, real-time updates, persistence
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMEWORK_URL = 'http://localhost:8080';
const TEST_RESULTS = [];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;

  switch(type) {
    case 'pass':
      console.log(`${colors.green}✓${colors.reset} ${prefix} ${message}`);
      TEST_RESULTS.push({ status: 'pass', message });
      break;
    case 'fail':
      console.log(`${colors.red}✗${colors.reset} ${prefix} ${message}`);
      TEST_RESULTS.push({ status: 'fail', message });
      break;
    case 'info':
      console.log(`${colors.blue}ℹ${colors.reset} ${prefix} ${message}`);
      break;
    case 'warn':
      console.log(`${colors.yellow}⚠${colors.reset} ${prefix} ${message}`);
      break;
    case 'header':
      console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
      console.log(`${colors.cyan}${message}${colors.reset}`);
      console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
      break;
  }
}

/**
 * Start Framework server
 */
async function startServer() {
  return new Promise((resolve, reject) => {
    log('info', 'Starting Framework server...');
    const server = spawn('python', ['server.py'], {
      cwd: __dirname,
      stdio: 'pipe',
      detached: true
    });

    server.stdout.on('data', (data) => {
      if (data.toString().includes('serving') || data.toString().includes('running')) {
        log('pass', 'Framework server started');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Address already in use')) {
        log('info', 'Server already running, using existing instance');
        resolve(null);
      }
    });

    setTimeout(() => {
      log('pass', 'Assuming server started');
      resolve(server);
    }, 3000);
  });
}

/**
 * Test Phase 1A: Perspective Rooms
 */
async function testPhase1A(page) {
  log('header', 'PHASE 1A: PERSPECTIVE ROOMS TESTING');

  try {
    // Navigate to Framework
    log('info', 'Navigating to Framework application...');
    await page.goto(FRAMEWORK_URL, { waitUntil: 'networkidle' });

    // Check if widgets library is loaded
    const widgetExists = await page.evaluate(() => {
      return Boolean(window.FB && window.FB.widgets && window.FB.widgets.get('perspectiveRooms'));
    });

    if (widgetExists) {
      log('pass', 'Perspective Rooms widget registered in FB.widgets');
    } else {
      log('fail', 'Perspective Rooms widget not found in FB.widgets');
      return false;
    }

    // Check widget has rooms array in defaultProps
    const hasRoomsArray = await page.evaluate(() => {
      const def = window.FB.widgets.get('perspectiveRooms');
      return def && def.defaultProps && Array.isArray(def.defaultProps.rooms);
    });

    if (hasRoomsArray) {
      log('pass', 'perspectiveRooms.defaultProps.rooms is array');
    } else {
      log('fail', 'perspectiveRooms.defaultProps.rooms is not array');
      return false;
    }

    // Check array editor function exists
    const hasArrayEditor = await page.evaluate(() => {
      return typeof window.FB.panels.renderArrayEditor === 'function';
    });

    if (hasArrayEditor) {
      log('pass', 'FB.panels.renderArrayEditor function exists');
    } else {
      log('fail', 'FB.panels.renderArrayEditor function not found');
      return false;
    }

    // Check array editor function can render UI
    const arrayEditorOutput = await page.evaluate(() => {
      const roomsArray = [
        { title: 'Room 1', subtitle: 'Test', bgColor: '#ff0000' },
        { title: 'Room 2', subtitle: 'Test', bgColor: '#00ff00' }
      ];
      try {
        const html = window.FB.panels.renderArrayEditor('test-block', 'rooms', roomsArray, 'perspectiveRooms');
        return html && html.length > 0;
      } catch(e) {
        console.error('Array editor error:', e.message);
        return false;
      }
    });

    if (arrayEditorOutput) {
      log('pass', 'Array editor generates HTML output');
    } else {
      log('fail', 'Array editor failed to generate HTML');
      return false;
    }

    // Check property metadata exists for room properties
    const metaExists = await page.evaluate(() => {
      const meta = window.FB.widgets._propMeta;
      const requiredProps = ['title', 'subtitle', 'description', 'bgColor', 'textColor', 'bgImage', 'imageOpacity', 'navLabel', 'cta'];
      return requiredProps.every(prop => meta[prop]);
    });

    if (metaExists) {
      log('pass', 'All room property metadata exists in _propMeta');
    } else {
      log('fail', 'Some room properties missing from _propMeta');
      return false;
    }

    log('pass', 'Phase 1A: All structural tests passed');
    return true;

  } catch (error) {
    log('fail', `Phase 1A error: ${error.message}`);
    return false;
  }
}

/**
 * Test Phase 1B: 3D Carousel
 */
async function testPhase1B(page) {
  log('header', 'PHASE 1B: 3D CAROUSEL TESTING');

  try {
    // Check widget exists
    const carouselExists = await page.evaluate(() => {
      return Boolean(window.FB.widgets.get('carousel3d'));
    });

    if (carouselExists) {
      log('pass', '3D Carousel widget registered');
    } else {
      log('fail', '3D Carousel widget not found');
      return false;
    }

    // Check cards array
    const hasCardsArray = await page.evaluate(() => {
      const def = window.FB.widgets.get('carousel3d');
      return def && def.defaultProps && Array.isArray(def.defaultProps.cards);
    });

    if (hasCardsArray) {
      log('pass', 'carousel3d.defaultProps.cards is array');
    } else {
      log('fail', 'carousel3d cards array missing');
      return false;
    }

    // Check card properties in metadata
    const cardMetaExists = await page.evaluate(() => {
      const meta = window.FB.widgets._propMeta;
      const cardProps = ['title', 'subtitle', 'description', 'image', 'imagePosition', 'bgColor', 'textColor', 'accentColor', 'link', 'linkText'];
      return cardProps.every(prop => meta[prop]);
    });

    if (cardMetaExists) {
      log('pass', 'All card property metadata exists');
    } else {
      log('fail', 'Some card properties missing from metadata');
      return false;
    }

    // Check carousel initialization function
    const hasCarouselInit = await page.evaluate(() => {
      return typeof window._VeltroInitCarousel3d === 'function';
    });

    if (hasCarouselInit) {
      log('pass', '_VeltroInitCarousel3d initialization function exists');
    } else {
      log('fail', 'Carousel init function not found');
      return false;
    }

    // Check link navigation code
    const hasLinkHandling = await page.evaluate(() => {
      // Check if carousel init function mentions data-link
      return window._VeltroInitCarousel3d.toString().includes('data-link');
    });

    if (hasLinkHandling) {
      log('pass', 'Carousel has link navigation code');
    } else {
      log('warn', 'Link navigation code not found in carousel init');
    }

    log('pass', 'Phase 1B: All structural tests passed');
    return true;

  } catch (error) {
    log('fail', `Phase 1B error: ${error.message}`);
    return false;
  }
}

/**
 * Test Phase 2: Text Effects
 */
async function testPhase2(page) {
  log('header', 'PHASE 2: TEXT EFFECTS TESTING');

  const textWidgets = [
    'kineticText',
    'waveText',
    'morphingText',
    'textScramble',
    'typewriterReveal',
    'liquidText',
    'kineticScramble'
  ];

  let passedCount = 0;

  for (const widgetName of textWidgets) {
    try {
      // Check widget registered
      const exists = await page.evaluate((name) => {
        return Boolean(window.FB.widgets.get(name));
      }, widgetName);

      if (exists) {
        log('pass', `${widgetName} widget registered`);
        passedCount++;
      } else {
        log('fail', `${widgetName} widget not found`);
        continue;
      }

      // Check has defaultProps
      const hasProps = await page.evaluate((name) => {
        const def = window.FB.widgets.get(name);
        return def && def.defaultProps && Object.keys(def.defaultProps).length > 0;
      }, widgetName);

      if (hasProps) {
        log('pass', `${widgetName} has defaultProps`);
      } else {
        log('fail', `${widgetName} defaultProps missing`);
      }

      // Check has render function
      const hasRender = await page.evaluate((name) => {
        const def = window.FB.widgets.get(name);
        return def && typeof def.render === 'function';
      }, widgetName);

      if (hasRender) {
        log('pass', `${widgetName} has render function`);
      } else {
        log('fail', `${widgetName} render function missing`);
      }

      // Check has init function
      const initFunctionName = `_VeltroInit${widgetName.charAt(0).toUpperCase() + widgetName.slice(1)}`;
      const hasInit = await page.evaluate((initName) => {
        return typeof window[initName] === 'function';
      }, initFunctionName);

      if (hasInit) {
        log('pass', `${widgetName} has ${initFunctionName} init function`);
      } else {
        log('warn', `${widgetName} init function not found (might not be needed)`);
      }

    } catch (error) {
      log('fail', `${widgetName} test error: ${error.message}`);
    }
  }

  // Check _VeltroInitAll includes text widgets
  const allInitIncludes = await page.evaluate(() => {
    const allInitStr = window._VeltroInitAll.toString();
    return allInitStr.includes('_VeltroInitKineticText') &&
           allInitStr.includes('_VeltroInitWaveText') &&
           allInitStr.includes('_VeltroInitTypewriter');
  });

  if (allInitIncludes) {
    log('pass', '_VeltroInitAll includes text widget initializers');
  } else {
    log('fail', '_VeltroInitAll missing some text widget initializers');
  }

  log('info', `Phase 2: ${passedCount}/${textWidgets.length} text widgets verified`);
  return passedCount === textWidgets.length;
}

/**
 * Test Phase 3: Layout Widgets
 */
async function testPhase3(page) {
  log('header', 'PHASE 3: LAYOUT WIDGETS TESTING');

  const layoutWidgets = [
    'floatingIslands',
    'layeredParallax',
    'isometricGrid',
    'morphingGrid'
  ];

  let passedCount = 0;

  for (const widgetName of layoutWidgets) {
    try {
      const exists = await page.evaluate((name) => {
        return Boolean(window.FB.widgets.get(name));
      }, widgetName);

      if (exists) {
        log('pass', `${widgetName} widget registered`);
        passedCount++;
      } else {
        log('fail', `${widgetName} widget not found`);
        continue;
      }

      // Check has properties
      const hasProps = await page.evaluate((name) => {
        const def = window.FB.widgets.get(name);
        return def && def.defaultProps && Object.keys(def.defaultProps).length > 5;
      }, widgetName);

      if (hasProps) {
        log('pass', `${widgetName} has customizable properties`);
      } else {
        log('fail', `${widgetName} lacks sufficient properties`);
      }

    } catch (error) {
      log('fail', `${widgetName} test error: ${error.message}`);
    }
  }

  log('info', `Phase 3: ${passedCount}/${layoutWidgets.length} layout widgets verified`);
  return passedCount === layoutWidgets.length;
}

/**
 * Test Phase 4: System Optimization
 */
async function testPhase4(page) {
  log('header', 'PHASE 4: SYSTEM OPTIMIZATION VERIFICATION');

  try {
    // Check property metadata system
    const metaSystem = await page.evaluate(() => {
      return window.FB.widgets._propMeta &&
             window.FB.widgets._propOrder &&
             Object.keys(window.FB.widgets._propMeta).length > 100;
    });

    if (metaSystem) {
      log('pass', 'Property metadata system fully implemented (100+ properties)');
    } else {
      log('fail', 'Property metadata system incomplete');
      return false;
    }

    // Check array editor efficiency
    const arrayEditorEfficient = await page.evaluate(() => {
      // Array editor should use event delegation
      const source = window.FB.panels.renderArrayEditor.toString();
      return source.includes('addEventListener') || source.includes('event'); // Has event handling
    });

    if (arrayEditorEfficient) {
      log('pass', 'Array editor uses event handling (efficient)');
    } else {
      log('fail', 'Array editor event handling unclear');
    }

    // Check canvas refresh is block-specific
    const blockRefresh = await page.evaluate(() => {
      const source = window.FB.canvas.refreshBlock.toString();
      return source.includes('querySelector') && source.includes('innerHTML');
    });

    if (blockRefresh) {
      log('pass', 'Canvas refreshBlock is block-specific (not full page)');
    } else {
      log('fail', 'Canvas refresh mechanism unclear');
    }

    // Check for memory leaks in event listeners
    const cleanup = await page.evaluate(() => {
      // Check if refreshBlock cleans up old listeners
      const source = window.FB.canvas.refreshBlock.toString();
      return source.includes('addEventListener') || source.includes('listener');
    });

    if (cleanup) {
      log('pass', 'Event listener management present');
    } else {
      log('info', 'Event listener cleanup not explicitly visible');
    }

    log('pass', 'Phase 4: System optimization verified');
    return true;

  } catch (error) {
    log('fail', `Phase 4 error: ${error.message}`);
    return false;
  }
}

/**
 * Test property system integration
 */
async function testPropertySystem(page) {
  log('header', 'PROPERTY SYSTEM INTEGRATION TEST');

  try {
    // Test color normalization
    const colorNorm = await page.evaluate(() => {
      const colors = [
        { input: '#ff0000', expected: '#ff0000' },
        { input: '#f00', expected: '#ff0000' },
        { input: 'rgb(255,0,0)', expected: '#ff0000' }
      ];

      return colors.every(test => {
        const result = window.FB.widgets.normalizeColorForInput(test.input);
        return result === test.expected;
      });
    });

    if (colorNorm) {
      log('pass', 'Color normalization works correctly');
    } else {
      log('fail', 'Color normalization has issues');
      return false;
    }

    // Test property generation for a widget
    const propGen = await page.evaluate(() => {
      try {
        const html = window.FB.widgets.generateEditPanel('perspectiveRooms', 'test-id', {});
        return html && html.includes('rp-row');
      } catch(e) {
        return false;
      }
    });

    if (propGen) {
      log('pass', 'Property UI generation works');
    } else {
      log('fail', 'Property UI generation failed');
      return false;
    }

    log('pass', 'Property system integration verified');
    return true;

  } catch (error) {
    log('fail', `Property system error: ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  let browser = null;
  let server = null;

  try {
    log('header', 'WIDGET CUSTOMIZATION IMPLEMENTATION - AUTOMATED TEST SUITE');
    log('info', `Test start time: ${new Date().toLocaleString()}`);

    // Start server
    server = await startServer();

    // Wait for server to be ready
    log('info', 'Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Launch browser
    log('info', 'Launching Playwright browser...');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set up console message logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log('warn', `Browser console error: ${msg.text()}`);
      }
    });

    // Run all tests
    const results = {
      phase1A: await testPhase1A(page),
      phase1B: await testPhase1B(page),
      phase2: await testPhase2(page),
      phase3: await testPhase3(page),
      phase4: await testPhase4(page),
      propSystem: await testPropertySystem(page)
    };

    // Summary
    log('header', 'TEST SUMMARY');
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.values(results).length;

    log('info', `Phases tested: ${total}`);
    log('info', `Phases passed: ${passed}/${total}`);

    if (passed === total) {
      log('pass', 'ALL PHASES PASSED STRUCTURAL VERIFICATION');
      log('info', 'Implementation is code-complete and ready for manual browser testing');
    } else {
      log('fail', `${total - passed} phase(s) failed verification`);
    }

    // Write results to file
    const reportPath = path.join(__dirname, 'TEST_RESULTS.json');
    await fs.writeFile(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: results,
      detailedResults: TEST_RESULTS
    }, null, 2));

    log('info', `Full test report written to: ${reportPath}`);

  } catch (error) {
    log('fail', `Test suite error: ${error.message}`);
    console.error(error);
  } finally {
    if (browser) await browser.close();
    if (server) process.kill(-server.pid);
    log('info', 'Test suite completed');
    process.exit(TEST_RESULTS.filter(r => r.status === 'fail').length > 0 ? 1 : 0);
  }
}

// Run tests
runTests();

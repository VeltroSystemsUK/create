/**
 * Veltro Initializers - Lazy Loading Version
 * Refactored to use dynamic imports and reduce front-load evaluation
 *
 * This file replaces the monolithic inits.js (6000+ lines) with a lightweight
 * registry that loads initializers on-demand.
 */

import { veltroLoader } from './initializers/loader.js';

// ── Phase 1: Register Text Effect Initializers ──
// Lazy-loaded from batch-text.js when needed
const textEffectInits = [
  'KineticText',
  'TextScramble',
  'Typewriter',
  'TextMask',
  'Counter',
  'LiquidText',
  'WaveText',
  'RotatingText3d',
  'MorphingText',
  'KineticScramble',
  'MagText'
];

textEffectInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-text.js',
    init: `_VeltroInit${name}`,
    group: 'text-effects',
    priority: 10
  });
});

// ── Phase 2: Register Physics & Spatial Initializers ──
// Lazy-loaded from batch-physics.js and batch-spatial.js
const physicsInits = [
  'Physics',
  'ImagePhysics',
  'GravityWells',
  'FluidSimulation',
  'ClothSimulation',
  'MagneticFields',
  'PendulumWave',
  'CollisionChaos',
  'BlackHole',
  'Constellation',
  'InfiniteCanvas',
  'GeometryDraw',
  'MultiShapeTrail',
  'Spotlight'
];

physicsInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-physics.js',
    init: `_VeltroInit${name}`,
    group: 'physics-spatial',
    priority: 5
  });
});

// ── Phase 3: Register Cursor Interaction Initializers ──
// Lazy-loaded from batch-cursor.js
const cursorInits = [
  'MagneticCursor',
  'GravityCursor',
  'ParticleTrail',
  'CursorRipple',
  'CursorLens'
];

cursorInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-cursor.js',
    init: `_VeltroInit${name}`,
    group: 'cursor-effects',
    priority: 15
  });
});

// ── Phase 4: Register Scroll Effects Initializers ──
// Lazy-loaded from batch-scroll.js
const scrollInits = [
  'StickyScrollStack',
  'ScrollVelocitySkew',
  'ParallaxImageStack',
  'MosaicAssemble',
  'ScrollProgressRing',
  'MagneticScroll',
  'ParallaxDepth',
  'ScrollTriggered',
  'HorizontalScrollGallery',
  'VelocitySkew',
  'ScrollFluid',
  'VelocityFluidBg'
];

scrollInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-scroll.js',
    init: `_VeltroInit${name}`,
    group: 'scroll-effects',
    priority: 20
  });
});

// ── Phase 5: Register Ambient/Visual Effects ──
// Lazy-loaded from batch-ambient.js
const ambientInits = [
  'Shaders',
  'MorphBlob',
  'NoiseGrain',
  'GradientFlow',
  'SectionBackground',
  'GlassmorphismStack',
  'TiltCards',
  'GlitchSection',
  'AudioVisualizer',
  'DepthOfField',
  'HolographicCard',
  'SoundReactive',
  'MirrorReflection',
  'AuroraBorealis',
  'ParticleNebula',
  'GeometricPatterns',
  'LiquidGradient',
  'HolographicOverlay',
  'LightLeaks'
];

ambientInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-ambient.js',
    init: `_VeltroInit${name}`,
    group: 'ambient-effects',
    priority: 25
  });
});

// ── Phase 6: Register Distortion & Visualization ──
// Lazy-loaded from batch-physics.js
const distortionInits = [
  'Distortion',
  'ColorSampler'
];

distortionInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-physics.js',
    init: `_VeltroInit${name}`,
    group: 'distortion',
    priority: 30
  });
});

// ── Phase 7: Register Spatial/3D Initializers ──
// Lazy-loaded from batch-spatial.js
const spatialInits = [
  'Carousel3d',
  'IsometricGrid',
  'PerspectiveRooms',
  'FloatingIslands',
  'LayeredParallax',
  'KineticLayout',
  'MorphingGrid',
  'SpatialNavigation'
];

spatialInits.forEach(name => {
  veltroLoader.register(name, {
    module: '../batch-spatial.js',
    init: `_VeltroInit${name}`,
    group: 'spatial-3d',
    priority: 1  // Highest priority - core spatial widgets
  });
});

// ── Phase 8: Register Utility Initializers ──
// Cookie consent and other utilities (inline for speed)
window._VeltroInitCookieConsent = function() {
  // Cookie consent implementation (keep inline - simple, no dependencies)
  const COOKIE_KEY = 'fw_cookie_consent';
  const banners = document.querySelectorAll('.fw-cookie-banner');

  banners.forEach(function(banner) {
    const storedConsent = localStorage.getItem(COOKIE_KEY);
    if (storedConsent) {
      try {
        const consent = JSON.parse(storedConsent);
        if (consent && consent.allAccepted) {
          banner.style.display = 'none';
          return;
        }
      } catch (e) {}
    }

    const buttons = banner.querySelectorAll('[data-cookie-action]');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-cookie-action');
        const consent = {
          allAccepted: action === 'accept',
          timestamp: Date.now(),
          categories: {}
        };

        function getCategoryState() {
          const state = {};
          const checkboxes = banner.querySelectorAll('[data-category]');
          checkboxes.forEach(cb => {
            state[cb.getAttribute('data-category')] = cb.checked;
          });
          return state;
        }

        if (action === 'accept') {
          consent.categories = getCategoryState();
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = 'none';
        } else if (action === 'decline') {
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = 'none';
        } else if (action === 'customize') {
          const panel = banner.querySelector('.fw-cookie-categories');
          if (panel)
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
      });
    });
  });
};

veltroLoader.register('CookieConsent', {
  module: null,  // Inline, no module needed
  init: '_VeltroInitCookieConsent',
  group: 'utilities',
  priority: 100  // Lowest priority - utility
});

// ── Master Initializer - Execute on Demand ──
/**
 * Initialize all Veltro widgets
 * Can be called immediately or deferred based on visibility
 */
window._VeltroInitAll = async function() {
  console.log('🚀 Starting Veltro initialization...');

  // Load all initializers asynchronously
  await veltroLoader.loadAll();

  // Execute all registered initializers
  // Can be filtered by group if needed:
  // await veltroLoader.executeGroup('physics-spatial');
  await veltroLoader.executeAll();

  // Initialize Framework bindings
  if (typeof FB !== 'undefined' && FB.bindings) {
    FB.bindings.wire();
  }

  const status = veltroLoader.getStatus();
  console.log(`✅ Veltro initialization complete. Loaded: ${status.loaded}/${status.total}`);
};

/**
 * Initialize specific group on-demand
 * Example: window._VeltroInitGroup('text-effects')
 */
window._VeltroInitGroup = async function(group) {
  console.log(`Loading initializers for group: ${group}`);
  await veltroLoader.loadGroup(group);
  // Find and execute initializers in this group
  const groupInits = Array.from(veltroLoader.registry.entries())
    .filter(([_, config]) => config.group === group)
    .map(([name]) => name);
  await veltroLoader.executeAll(groupInits);
};

/**
 * Lazy initialization using Intersection Observer
 * Initialize only visible widgets for better performance
 */
window._VeltroInitLazy = function() {
  console.log('🚀 Starting lazy Veltro initialization...');

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Element is visible - initialize its widget
          const element = entry.target;
          const className = element.className;

          // Match widget type from class name
          // e.g., "veltro-physics-wrap" → Physics
          const match = className.match(/veltro-(\w+)-wrap/);
          if (match) {
            const widgetName = match[1]
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('');
            const initName = `_VeltroInit${widgetName}`;

            if (window[initName] && typeof window[initName] === 'function') {
              window[initName]();
              observer.unobserve(element);
            }
          }
        }
      });
    },
    { rootMargin: '100px' }
  );

  // Observe all Veltro widget containers
  document.querySelectorAll('[class*="veltro-"][class*="-wrap"]').forEach(element => {
    observer.observe(element);
  });

  if (typeof FB !== 'undefined' && FB.bindings) {
    FB.bindings.wire();
  }
};

// Debug API
window._VeltroDebug = {
  status: () => veltroLoader.getStatus(),
  load: (name) => veltroLoader.load(name),
  loadGroup: (group) => veltroLoader.loadGroup(group),
  loadAll: () => veltroLoader.loadAll(),
  execute: (names) => veltroLoader.executeAll(names),
  registry: () => Array.from(veltroLoader.registry.entries()).map(([name, config]) => ({
    name,
    module: config.module,
    group: config.group,
    loaded: config.loaded
  }))
};

console.log('✅ Veltro Initializer System ready');
console.log('📊 Use window._VeltroInitAll() for eager init, window._VeltroInitLazy() for lazy init');
console.log('🔍 Use window._VeltroDebug for debugging');

export { veltroLoader };

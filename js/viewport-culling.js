/**
 * Viewport Culling Logic
 * Pause/resume high-intensity operations (physics, canvas updates) based on visibility
 *
 * Purpose: Maintain 60 FPS during active design work by culling invisible widget operations
 * Impact: Reduces main-thread bottlenecks, improves responsiveness
 */

window.FB_ViewportCulling = window.FB_ViewportCulling || {
  _culledInstances: new Set(),
  _cullingEnabled: true,
  _threshold: 0.05,  // Trigger culling at 5% visibility
  _observers: new Map(),
  _pausedOperations: {},

  /**
   * Initialize viewport culling for a widget instance
   * @param {string} instanceId - Widget instance ID
   * @param {HTMLElement} element - DOM element to observe
   * @param {Object} config - Culling configuration
   * @param {Function} config.onVisible - Callback when element becomes visible
   * @param {Function} config.onHidden - Callback when element becomes hidden
   * @param {boolean} config.cullingEnabled - Whether to apply culling (default: true)
   */
  observe(instanceId, element, config = {}) {
    if (!element) {
      console.warn(`⚠️ Viewport culling: No element provided for ${instanceId}`);
      return;
    }

    const { onVisible, onHidden, cullingEnabled = true } = config;
    const threshold = config.threshold || this._threshold;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting && entry.intersectionRatio > threshold;

          if (isVisible) {
            // Element became visible
            if (this._culledInstances.has(instanceId)) {
              console.log(`👁️ Resuming culled operations for: ${instanceId}`);
              this._culledInstances.delete(instanceId);

              // Resume the widget's operations
              if (window.FB_Lifecycle) {
                window.FB_Lifecycle.resume(instanceId);
              }

              // Call custom visibility callback
              if (onVisible && typeof onVisible === 'function') {
                onVisible(entry);
              }
            }
          } else {
            // Element became hidden
            if (cullingEnabled && !this._culledInstances.has(instanceId)) {
              console.log(`🚫 Culling operations for hidden element: ${instanceId}`);
              this._culledInstances.add(instanceId);

              // Pause the widget's operations
              if (window.FB_Lifecycle) {
                window.FB_Lifecycle.pause(instanceId);
              }

              // Call custom hidden callback
              if (onHidden && typeof onHidden === 'function') {
                onHidden(entry);
              }
            }
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: '50px' // Start culling slightly before element leaves viewport
      }
    );

    observer.observe(element);
    this._observers.set(instanceId, observer);

    console.log(`✅ Viewport culling initialized for: ${instanceId}`);
    return observer;
  },

  /**
   * Stop culling for a specific instance
   * @param {string} instanceId - Widget instance ID
   */
  unobserve(instanceId) {
    const observer = this._observers.get(instanceId);
    if (observer) {
      observer.disconnect();
      this._observers.delete(instanceId);
      this._culledInstances.delete(instanceId);
      console.log(`✅ Viewport culling stopped for: ${instanceId}`);
    }
  },

  /**
   * Stop all viewport culling
   */
  unobserveAll() {
    this._observers.forEach((observer) => {
      observer.disconnect();
    });
    this._observers.clear();
    this._culledInstances.clear();
    console.log(`✅ All viewport culling stopped`);
  },

  /**
   * Pause/resume all physics operations globally
   * Useful for when user is dragging elements or interacting
   * @param {boolean} shouldPause - True to pause, false to resume
   */
  pauseAll(shouldPause = true) {
    if (shouldPause) {
      console.log(`⏸️ Pausing all physics operations globally`);
      this._cullingEnabled = false;
      // Pause all instances
      if (window.FB_Lifecycle && window.FB_Lifecycle._instances) {
        Object.keys(window.FB_Lifecycle._instances).forEach((id) => {
          window.FB_Lifecycle.pause(id);
        });
      }
    } else {
      console.log(`▶️ Resuming all physics operations globally`);
      this._cullingEnabled = true;
      // Resume all non-culled instances
      if (window.FB_Lifecycle && window.FB_Lifecycle._instances) {
        Object.keys(window.FB_Lifecycle._instances).forEach((id) => {
          if (!this._culledInstances.has(id)) {
            window.FB_Lifecycle.resume(id);
          }
        });
      }
    }
  },

  /**
   * Check if an instance is currently culled (hidden)
   * @param {string} instanceId - Widget instance ID
   * @returns {boolean} True if instance is culled
   */
  isCulled(instanceId) {
    return this._culledInstances.has(instanceId);
  },

  /**
   * Get culling statistics
   * @returns {Object} Statistics about culled instances
   */
  getStats() {
    return {
      cullingEnabled: this._cullingEnabled,
      totalObserved: this._observers.size,
      currentlyCulled: this._culledInstances.size,
      culledInstances: Array.from(this._culledInstances)
    };
  }
};

/**
 * Physics Engine Culling Helper
 * Specific optimizations for Matter.js and Fabric.js
 */
window.FB_PhysicsCulling = {
  /**
   * Create a culled physics engine wrapper
   * Automatically pauses/resumes physics simulation
   *
   * @param {Matter.Engine} engine - Matter.js engine
   * @param {HTMLElement} element - Element to observe
   * @returns {Object} Wrapper with pause/resume controls
   */
  wrapPhysicsEngine(engine, element) {
    let isRunning = true;
    let animationFrameId = null;

    const runner = () => {
      if (isRunning && window.FB_ViewportCulling._cullingEnabled) {
        Matter.Engine.update(engine, 1000 / 60);
      }
      animationFrameId = requestAnimationFrame(runner);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(runner);

    return {
      pause() {
        isRunning = false;
        console.log(`⏸️ Physics engine paused`);
      },
      resume() {
        isRunning = true;
        console.log(`▶️ Physics engine resumed`);
      },
      stop() {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
        console.log(`🛑 Physics engine stopped`);
      },
      isRunning() {
        return isRunning;
      }
    };
  },

  /**
   * Optimize canvas rendering based on viewport
   * Reduces render frequency for off-screen canvases
   *
   * @param {fabric.Canvas} canvas - Fabric.js canvas
   * @param {HTMLElement} element - Canvas element
   */
  optimizeCanvasRendering(canvas, element) {
    let shouldRender = true;
    const defaultRenderOnAddRemove = canvas.renderOnAddRemove;

    // Disable automatic rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Enable rendering when visible
            canvas.renderOnAddRemove = defaultRenderOnAddRemove;
            shouldRender = true;
            canvas.requestRenderAll();
          } else {
            // Disable rendering when hidden
            canvas.renderOnAddRemove = false;
            shouldRender = false;
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(element);

    return {
      shouldRender() {
        return shouldRender;
      },
      stop() {
        observer.disconnect();
        canvas.renderOnAddRemove = defaultRenderOnAddRemove;
      }
    };
  }
};

/**
 * Performance monitoring integration
 */
window.FB_PerformanceMonitor = {
  _metrics: {
    fps: 0,
    frameTime: 0,
    lastFrameTime: performance.now(),
    frames: 0
  },

  /**
   * Start monitoring FPS
   */
  start() {
    const monitor = () => {
      const now = performance.now();
      const frameTime = now - this._metrics.lastFrameTime;
      this._metrics.frameTime = frameTime;
      this._metrics.fps = Math.round(1000 / frameTime);
      this._metrics.frames++;
      this._metrics.lastFrameTime = now;

      // If FPS drops below 50, consider enabling more culling
      if (this._metrics.fps < 50) {
        console.warn(`⚠️ Low FPS detected: ${this._metrics.fps} FPS`);
      }

      requestAnimationFrame(() => monitor());
    };

    monitor();
  },

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      fps: this._metrics.fps,
      frameTime: this._metrics.frameTime.toFixed(2) + 'ms',
      totalFrames: this._metrics.frames,
      cullingStats: window.FB_ViewportCulling.getStats()
    };
  }
};

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('📊 Performance monitoring enabled (dev mode)');
  // Uncomment to enable FPS monitoring:
  // window.FB_PerformanceMonitor.start();
}

console.log('✅ Viewport Culling system initialized');
console.log('📊 Use window.FB_ViewportCulling for controlling culling behavior');

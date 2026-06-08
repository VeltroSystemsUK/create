/**
 * Virtual Lifecycle Registry (VLR) Pattern
 * Explicit memory management for widget instances and their associated resources
 *
 * Solves: Memory leaks from lingering event listeners, physics engines, observers
 * Benefits: Clean destruction on block deletion, proper resource cleanup, 60 FPS stability
 */

// Global lifecycle tracker - all active widget instances and their cleanup handlers
window.FB_Lifecycle = window.FB_Lifecycle || {
  _instances: {},           // { instanceId: { ... lifecycle data } }
  _observers: {},           // { instanceId: IntersectionObserver }
  _physicsEngines: {},      // { instanceId: Matter.Engine }
  _eventListeners: {},      // { instanceId: [{ element, event, handler } ...] }
  _animationFrames: {},     // { instanceId: [animationFrameId ...] }

  /**
   * Register a new widget instance into the lifecycle system
   * @param {string} instanceId - Unique identifier for this widget instance
   * @param {Object} config - Lifecycle configuration
   * @param {Function} config.destroyCallback - Called when widget is destroyed
   * @param {IntersectionObserver} config.viewportObserver - Viewport visibility observer
   * @param {Matter.Engine} config.physicsEngine - Matter.js physics engine (if applicable)
   * @param {Array} config.eventListeners - Array of {element, event, handler} objects
   * @param {Array} config.animationFrameIds - Array of requestAnimationFrame IDs
   */
  register(instanceId, config = {}) {
    if (this._instances[instanceId]) {
      console.warn(`⚠️ Instance ${instanceId} already registered. Previous instance will be overwritten.`);
      this.destroy(instanceId);
    }

    this._instances[instanceId] = {
      id: instanceId,
      createdAt: Date.now(),
      isActive: true,
      destroyCallback: config.destroyCallback || null,
      metadata: config.metadata || {}
    };

    // Store individual resource references for granular cleanup
    if (config.viewportObserver) {
      this._observers[instanceId] = config.viewportObserver;
    }

    if (config.physicsEngine) {
      this._physicsEngines[instanceId] = config.physicsEngine;
    }

    if (config.eventListeners && Array.isArray(config.eventListeners)) {
      this._eventListeners[instanceId] = config.eventListeners;
    }

    if (config.animationFrameIds && Array.isArray(config.animationFrameIds)) {
      this._animationFrames[instanceId] = config.animationFrameIds;
    }

    console.log(`✅ Registered lifecycle for instance: ${instanceId}`);
    return instanceId;
  },

  /**
   * Add event listener and automatically track it for cleanup
   * @param {string} instanceId - Widget instance ID
   * @param {HTMLElement} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  addEventListener(instanceId, element, event, handler) {
    if (!this._eventListeners[instanceId]) {
      this._eventListeners[instanceId] = [];
    }

    element.addEventListener(event, handler);
    this._eventListeners[instanceId].push({ element, event, handler });

    return () => this.removeEventListener(instanceId, element, event, handler);
  },

  /**
   * Remove tracked event listener
   * @param {string} instanceId - Widget instance ID
   * @param {HTMLElement} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  removeEventListener(instanceId, element, event, handler) {
    if (!this._eventListeners[instanceId]) return false;

    const index = this._eventListeners[instanceId].findIndex(
      listener => listener.element === element && listener.event === event && listener.handler === handler
    );

    if (index !== -1) {
      const { element: el, event: evt, handler: fn } = this._eventListeners[instanceId][index];
      el.removeEventListener(evt, fn);
      this._eventListeners[instanceId].splice(index, 1);
      return true;
    }

    return false;
  },

  /**
   * Track animation frame ID for cleanup
   * @param {string} instanceId - Widget instance ID
   * @param {number} frameId - requestAnimationFrame ID
   */
  trackAnimationFrame(instanceId, frameId) {
    if (!this._animationFrames[instanceId]) {
      this._animationFrames[instanceId] = [];
    }
    this._animationFrames[instanceId].push(frameId);
  },

  /**
   * Pause all active operations for a widget (used in viewport culling)
   * @param {string} instanceId - Widget instance ID
   */
  pause(instanceId) {
    const instance = this._instances[instanceId];
    if (!instance) return;

    instance.isActive = false;

    // Cancel all animation frames
    if (this._animationFrames[instanceId]) {
      this._animationFrames[instanceId].forEach(frameId => {
        cancelAnimationFrame(frameId);
      });
      this._animationFrames[instanceId] = [];
    }

    console.log(`⏸️ Paused instance: ${instanceId}`);
  },

  /**
   * Resume operations for a widget (used in viewport culling)
   * @param {string} instanceId - Widget instance ID
   */
  resume(instanceId) {
    const instance = this._instances[instanceId];
    if (!instance) return;

    instance.isActive = true;
    console.log(`▶️ Resumed instance: ${instanceId}`);
  },

  /**
   * Complete lifecycle destruction - cleanup all resources
   * Called when widget is deleted from canvas or document is cleaned
   * @param {string} instanceId - Widget instance ID
   */
  destroy(instanceId) {
    const instance = this._instances[instanceId];
    if (!instance) {
      console.warn(`⚠️ Instance ${instanceId} not found in lifecycle registry`);
      return;
    }

    console.log(`🗑️ Destroying lifecycle for instance: ${instanceId}`);

    // 1. Stop any viewport observers
    if (this._observers[instanceId]) {
      try {
        this._observers[instanceId].disconnect();
        delete this._observers[instanceId];
      } catch (e) {
        console.warn(`Error disconnecting observer for ${instanceId}:`, e);
      }
    }

    // 2. Clear animation frames
    if (this._animationFrames[instanceId]) {
      this._animationFrames[instanceId].forEach(frameId => {
        cancelAnimationFrame(frameId);
      });
      delete this._animationFrames[instanceId];
    }

    // 3. Remove all event listeners
    if (this._eventListeners[instanceId]) {
      this._eventListeners[instanceId].forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler);
        } catch (e) {
          console.warn(`Error removing event listener for ${instanceId}:`, e);
        }
      });
      delete this._eventListeners[instanceId];
    }

    // 4. Clean up Matter.js physics engine
    if (this._physicsEngines[instanceId]) {
      try {
        const engine = this._physicsEngines[instanceId];
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
        delete this._physicsEngines[instanceId];
      } catch (e) {
        console.warn(`Error clearing Matter.js engine for ${instanceId}:`, e);
      }
    }

    // 5. Call custom destroy callback
    if (instance.destroyCallback && typeof instance.destroyCallback === 'function') {
      try {
        instance.destroyCallback();
      } catch (e) {
        console.warn(`Error in destroy callback for ${instanceId}:`, e);
      }
    }

    // 6. Mark as destroyed and remove from registry
    instance.isActive = false;
    instance.destroyedAt = Date.now();

    // Keep minimal record for debugging, but mark as destroyed
    instance._destroyed = true;

    console.log(`✅ Successfully destroyed instance: ${instanceId}`);
  },

  /**
   * Destroy all instances (typically called on page unload)
   */
  destroyAll() {
    console.log(`🗑️ Destroying all widget instances...`);
    const instanceIds = Object.keys(this._instances);
    instanceIds.forEach(id => this.destroy(id));
    console.log(`✅ All instances destroyed`);
  },

  /**
   * Get instance information for debugging
   * @param {string} instanceId - Widget instance ID (optional)
   * @returns {Object} Instance data or all instances if no ID provided
   */
  getInfo(instanceId) {
    if (instanceId) {
      return this._instances[instanceId];
    }
    return {
      totalInstances: Object.keys(this._instances).length,
      activeInstances: Object.values(this._instances).filter(i => i.isActive).length,
      instances: this._instances
    };
  },

  /**
   * Get memory usage statistics (for performance monitoring)
   * @returns {Object} Memory statistics
   */
  getStats() {
    return {
      instances: Object.keys(this._instances).length,
      observers: Object.keys(this._observers).length,
      physicsEngines: Object.keys(this._physicsEngines).length,
      eventListeners: Object.values(this._eventListeners).reduce((sum, arr) => sum + arr.length, 0),
      animationFrames: Object.values(this._animationFrames).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
};

/**
 * Integrate VLR with canvas deletion pipeline
 * When FB.canvas.deleteBlock() is called, ensure cleanup happens
 */
if (window.FB && window.FB.canvas) {
  const originalDeleteBlock = FB.canvas.deleteBlock;

  FB.canvas.deleteBlock = function(blockId) {
    // Cleanup any lifecycle instances associated with this block
    // Block IDs typically map to widget instance IDs
    if (window.FB_Lifecycle._instances[blockId]) {
      window.FB_Lifecycle.destroy(blockId);
    }

    // Also check for child instances that belong to this block
    Object.keys(window.FB_Lifecycle._instances).forEach(instanceId => {
      if (instanceId.startsWith(blockId + '_')) {
        window.FB_Lifecycle.destroy(instanceId);
      }
    });

    // Call original deleteBlock function
    return originalDeleteBlock.call(this, blockId);
  };
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  window.FB_Lifecycle.destroyAll();
});

/**
 * Expose convenience methods on window for debugging
 */
window.FB_LifecycleDebug = {
  info: (id) => window.FB_Lifecycle.getInfo(id),
  stats: () => window.FB_Lifecycle.getStats(),
  destroy: (id) => window.FB_Lifecycle.destroy(id),
  destroyAll: () => window.FB_Lifecycle.destroyAll(),
  pause: (id) => window.FB_Lifecycle.pause(id),
  resume: (id) => window.FB_Lifecycle.resume(id)
};

console.log('✅ Virtual Lifecycle Registry (VLR) system initialized');
console.log('📊 Use window.FB_LifecycleDebug for debugging (info, stats, destroy, etc.)');

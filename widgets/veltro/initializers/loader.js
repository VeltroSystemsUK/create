/**
 * Veltro Initializer Loader - Dynamic Component Loader
 * Reduces front-load evaluation by lazy-loading initializer implementations
 *
 * Usage:
 *   const loader = new VeltroInitLoader();
 *   loader.register('physics', { module: './batch-physics.js', init: '_VeltroInitPhysics' });
 *   loader.loadAll();  // Load all on demand
 */

export class VeltroInitLoader {
  constructor() {
    this.registry = new Map();
    this.loaded = new Set();
    this.loading = new Map();
  }

  /**
   * Register an initializer for lazy loading
   * @param {string} name - Initializer name
   * @param {Object} config - { module, init, group?, priority? }
   */
  register(name, config) {
    this.registry.set(name, {
      name,
      module: config.module,
      init: config.init,
      group: config.group || 'default',
      priority: config.priority || 100,
      loaded: false
    });
  }

  /**
   * Load a specific initializer
   * @param {string} name - Initializer name
   * @returns {Promise}
   */
  async load(name) {
    if (this.loaded.has(name)) return;
    if (this.loading.has(name)) return this.loading.get(name);

    const config = this.registry.get(name);
    if (!config) {
      console.warn(`Initializer not found: ${name}`);
      return;
    }

    const promise = this._loadModule(config);
    this.loading.set(name, promise);

    try {
      await promise;
      this.loaded.add(name);
      config.loaded = true;
      console.log(`✅ Loaded initializer: ${name}`);
    } catch (error) {
      console.error(`Failed to load ${name}:`, error);
    }

    this.loading.delete(name);
  }

  /**
   * Load multiple initializers
   * @param {string[]} names - Initializer names
   * @returns {Promise}
   */
  async loadMany(names) {
    const promises = names.map(name => this.load(name));
    return Promise.all(promises);
  }

  /**
   * Load all initializers
   * @returns {Promise}
   */
  async loadAll() {
    const names = Array.from(this.registry.keys());
    return this.loadMany(names);
  }

  /**
   * Load by group
   * @param {string} group - Group name
   * @returns {Promise}
   */
  async loadGroup(group) {
    const names = Array.from(this.registry.entries())
      .filter(([_, config]) => config.group === group)
      .map(([name]) => name);
    return this.loadMany(names);
  }

  /**
   * Execute all registered initializers
   * @param {string[]} names - Specific names, or all if not provided
   */
  async executeAll(names = null) {
    const target = names || Array.from(this.registry.keys());

    // Sort by priority
    target.sort((a, b) => {
      const priorityA = this.registry.get(a).priority || 100;
      const priorityB = this.registry.get(b).priority || 100;
      return priorityA - priorityB;
    });

    // Load all first
    await this.loadMany(target);

    // Then execute
    for (const name of target) {
      const config = this.registry.get(name);
      if (config && window[config.init] && typeof window[config.init] === 'function') {
        try {
          window[config.init]();
          console.log(`🚀 Executed: ${name}`);
        } catch (error) {
          console.error(`Execution failed for ${name}:`, error);
        }
      }
    }
  }

  /**
   * Get loading status
   */
  getStatus() {
    return {
      total: this.registry.size,
      loaded: this.loaded.size,
      pending: this.registry.size - this.loaded.size,
      loadedList: Array.from(this.loaded),
      pendingList: Array.from(this.registry.keys()).filter(name => !this.loaded.has(name))
    };
  }

  /**
   * Private: Load a module
   */
  _loadModule(config) {
    // Inline initializers have no module (module: null)
    if (!config.module) {
      return Promise.resolve();
    }

    return import(config.module).catch(error => {
      console.error(`Failed to import ${config.module}:`, error);
      throw error;
    });
  }
}

// Global singleton instance
export const veltroLoader = new VeltroInitLoader();

console.log('✅ Veltro Initializer Loader initialized');

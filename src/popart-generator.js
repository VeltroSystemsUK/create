/**
 * Pop Art Spec Generator with RAG Pipeline
 * Transforms user prompts into Lottie-compatible animation specs
 */

const PopArtGenerator = {
  // Knowledgebase store
  knowledgebase: null,

  // Initialize the system
  async init() {
    try {
      const response = await fetch('/src/popart-knowledgebase.json');
      this.knowledgebase = await response.json();
      console.log('✓ Pop Art Knowledgebase loaded');
      return true;
    } catch (err) {
      console.error('Failed to load knowledgebase:', err);
      return false;
    }
  },

  /**
   * RAG Pipeline: Retrieve context from knowledgebase
   */
  retrieveContext(theme) {
    const kb = this.knowledgebase;

    // Find similar examples
    const relevantExamples = kb.examples.filter(ex =>
      theme.toLowerCase().includes(ex.id.split('_')[0]) ||
      ex.user_prompt.toLowerCase().includes(theme.toLowerCase())
    );

    // Compile constraint rules
    const constraints = kb.constraint_validation_rules;

    // Get style guidelines
    const styleGuide = kb.style_matrix;
    const motionRules = kb.lottie_constraints;

    return {
      theme,
      examples: relevantExamples,
      constraints,
      styleGuide,
      motionRules,
      templateStructure: kb.template_structure
    };
  },

  /**
   * Generate Pop Art Spec using Claude API
   */
  async generateSpec(userPrompt) {
    // Retrieve context from knowledgebase
    const ragContext = this.retrieveContext(userPrompt);

    // Build the system prompt with knowledgebase context
    const systemPrompt = this.buildSystemPrompt(ragContext);

    // Call Claude API
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': window.ANTHROPIC_API_KEY || ''
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Generate a Pop Art Lottie animation spec for: "${userPrompt}"`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedSpec = data.content[0].text;

      // Parse and validate the spec
      const spec = this.parseSpec(generatedSpec);
      const validation = this.validateSpec(spec);

      return {
        success: validation.isValid,
        spec,
        validation,
        rawResponse: generatedSpec
      };
    } catch (err) {
      console.error('Generation error:', err);
      return {
        success: false,
        error: err.message,
        spec: null
      };
    }
  },

  /**
   * Build system prompt with knowledgebase context
   */
  buildSystemPrompt(ragContext) {
    return `You are the core ideation engine for a Pop Art Cartoon & Lottie Generator.
Your job is to take a user theme and turn it into a multi-layered, looping animation concept
designed in the 1960s comic book Pop Art style.

KNOWLEDGEBASE CONTEXT:
${JSON.stringify(ragContext.styleGuide, null, 2)}

MOTION CONSTRAINTS:
${JSON.stringify(ragContext.motionRules, null, 2)}

VALIDATION RULES YOU MUST FOLLOW:
${ragContext.constraints.map(c => `- ${c.category}: ${c.rule} (${c.severity}) - ${c.error_message}`).join('\n')}

TEMPLATE STRUCTURE (You MUST output exactly these 4 sections):

1. CONCEPT OVERVIEW
   - title: Catchy 1-3 word title
   - description: 2 sentences describing the loop
   - duration_frames: Total frames (typically 24-120)
   - fps: 24 or 30
   - loop_duration_seconds: calculated value

2. PALETTE & TEXTURES
   - primary_colors: [list of hex codes with descriptive names]
   - shadow_texture: Description of pattern type
   - pattern_type: diagonal_stripes | vertical_stripes | ben_day_dots
   - constraint_note: Explain why this texture choice is Lottie-friendly

3. VECTOR LAYER HIERARCHY
   - root_composition: Canvas specs
   - layer_tree: Tree structure with semantic grouping (max 3 levels deep)
   - total_estimated_nodes: Estimated vector node count (max 2000)
   - performance_check: "PASS" or "WARNING: [reason]"

4. MOTION & KEYFRAMES
   - animation_segments: Frame ranges with descriptions
   - keyframe_instructions: Exact mechanical animation steps
   - easing_curves: Use snappy curves like [0.175, 0.885, 0.32, 1.275]
   - seamless_loop_check: "PASS" if frame 0 == final frame, else "FAIL: [reason]"

CRITICAL RULES:
- Heavy black strokes (3-8px), no soft edges
- Pure primary colors: #FF00FF, #00FFFF, #FFFF00, #111111, #FFFFFF
- NO blurs, layer styles, raster masks, or gradients
- ALL text must be converted to vector paths
- Pattern textures ONLY as diagonal stripes or vertical lines (max 6px spacing)
- Maximum 2000 total vector nodes
- Maximum 3 levels of nesting
- Framerate MUST be 24 or 30 fps
- Animation loop must be seamless (frame 0 == final frame state)

OUTPUT FORMAT:
Provide your response as valid JSON with the 4 main sections clearly labeled and structured.
Ensure all constraints are verified and noted in the validation sections.`;
  },

  /**
   * Parse generated spec into structured format
   */
  parseSpec(rawResponse) {
    try {
      // Try to extract JSON from response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: parse structured text format
      return this.parseTextFormat(rawResponse);
    } catch (err) {
      console.error('Parse error:', err);
      return { error: 'Failed to parse spec', raw: rawResponse };
    }
  },

  /**
   * Parse text-formatted spec
   */
  parseTextFormat(text) {
    const spec = {};

    // Extract sections
    const sections = ['CONCEPT OVERVIEW', 'PALETTE & TEXTURES', 'VECTOR LAYER HIERARCHY', 'MOTION & KEYFRAMES'];

    sections.forEach(section => {
      const regex = new RegExp(`${section}[:\\s]*(.*?)(?=${sections.find(s => s !== section) || '$'})`, 'is');
      const match = text.match(regex);
      if (match) {
        spec[section.toLowerCase().replace(/\s+/g, '_')] = match[1].trim();
      }
    });

    return spec;
  },

  /**
   * Validate spec against knowledgebase constraints
   */
  validateSpec(spec) {
    const issues = [];
    const warnings = [];

    if (!spec || spec.error) {
      return { isValid: false, issues: ['Failed to parse specification'], warnings: [] };
    }

    // Check each constraint rule
    this.knowledgebase.constraint_validation_rules.forEach(rule => {
      const violation = this.checkConstraint(spec, rule);
      if (violation) {
        if (rule.severity === 'critical') {
          issues.push(`[${rule.category}] ${violation}`);
        } else {
          warnings.push(`[${rule.category}] ${violation}`);
        }
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      summary: `${issues.length} critical issues, ${warnings.length} warnings`
    };
  },

  /**
   * Check individual constraint
   */
  checkConstraint(spec, rule) {
    const specStr = JSON.stringify(spec).toLowerCase();

    switch (rule.category) {
      case 'Path Complexity':
        const nodeMatch = specStr.match(/(\d+)\s*(?:nodes|vertices)/i);
        if (nodeMatch && parseInt(nodeMatch[1]) > 2000) {
          return `${nodeMatch[1]} nodes exceeds 2000 limit`;
        }
        break;

      case 'Layer Nesting':
        if (specStr.includes('level 4') || specStr.includes('depth: 4')) {
          return 'Nesting depth exceeds 3 levels';
        }
        break;

      case 'Animation Loop':
        if (specStr.includes('loop: false') || specStr.includes('seamless_loop_check: fail')) {
          return 'Animation does not loop seamlessly';
        }
        break;

      case 'Unsupported Features':
        const unsupported = ['blur', 'glow', 'shadow effect', 'gradient', 'raster mask'];
        for (let feature of unsupported) {
          if (specStr.includes(feature)) {
            return `Contains unsupported feature: ${feature}`;
          }
        }
        break;

      case 'Text Handling':
        if (specStr.includes('font:') && !specStr.includes('converted to paths')) {
          return 'Text must be converted to vector paths';
        }
        break;

      case 'Linework':
        const widthMatch = specStr.match(/stroke[:\s]*(\d+)px/i);
        if (widthMatch) {
          const width = parseInt(widthMatch[1]);
          if (width < 3 || width > 8) {
            return `Stroke width ${width}px outside 3-8px range`;
          }
        }
        break;
    }

    return null;
  },

  /**
   * Export spec as Lottie-compatible JSON
   */
  exportAsLottie(spec) {
    // Convert spec to Lottie JSON structure
    const lottieJson = {
      v: '5.7.0',
      fr: spec.concept_overview?.fps || 24,
      ip: 0,
      op: spec.concept_overview?.duration_frames || 48,
      w: 500,
      h: 500,
      nm: spec.concept_overview?.title || 'Pop Art Animation',
      ddd: 0,
      assets: [],
      layers: this.buildLottieLayers(spec),
      markers: []
    };

    return lottieJson;
  },

  /**
   * Build Lottie layer structure from spec
   */
  buildLottieLayers(spec) {
    const hierarchy = spec.vector_layer_hierarchy?.layer_tree || [];
    return hierarchy.map((layer, idx) => ({
      ddd: 0,
      ind: idx + 1,
      ty: 1, // Shape layer
      nm: layer.name || 'Layer',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: []
    }));
  },

  /**
   * Generate sample data for UI demo
   */
  getSampleSpec() {
    return this.knowledgebase.examples[0].generated_spec;
  }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PopArtGenerator.init());
} else {
  PopArtGenerator.init();
}

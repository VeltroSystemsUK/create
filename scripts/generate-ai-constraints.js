#!/usr/bin/env node

/**
 * CI/CD Script: Generate AI Constraints from Frontend Properties
 * Phase 4: Production Readiness - CI/CD Synchronization
 *
 * This script reads _propMeta from js/widgets.js and generates an AI constraint
 * manifest that the backend AI generation uses to stay in sync with frontend.
 *
 * Usage: node scripts/generate-ai-constraints.js
 * Output: artifacts/ai-constraints-manifest.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const WIDGETS_JS = path.join(PROJECT_ROOT, 'js', 'widgets.js');
const ARTIFACTS_DIR = path.join(PROJECT_ROOT, 'artifacts');
const OUTPUT_FILE = path.join(ARTIFACTS_DIR, 'ai-constraints-manifest.json');

// Ensure artifacts directory exists
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution
// ─────────────────────────────────────────────────────────────────────────────

async function generateConstraints() {
  console.log('[CI/CD] Generating AI constraints from frontend properties...');

  // Read js/widgets.js
  const widgetsContent = fs.readFileSync(WIDGETS_JS, 'utf-8');

  // Extract _propMeta object
  const propMetaStart = widgetsContent.indexOf('FB.widgets._propMeta = {');
  if (propMetaStart === -1) {
    console.error('ERROR: Could not find FB.widgets._propMeta in widgets.js');
    process.exit(1);
  }

  // Find the closing brace of _propMeta
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let endIndex = propMetaStart + 'FB.widgets._propMeta = '.length;

  for (let i = endIndex; i < widgetsContent.length; i++) {
    const char = widgetsContent[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
  }

  const propMetaStr = widgetsContent.substring(
    propMetaStart + 'FB.widgets._propMeta = '.length,
    endIndex
  );

  // Parse the _propMeta object using eval (safe here since it's our own code)
  let propMeta = {};
  try {
    propMeta = eval('(' + propMetaStr + ')');
  } catch (e) {
    console.error('ERROR: Could not parse _propMeta:', e.message);
    process.exit(1);
  }

  console.log(`[CI/CD] Found ${Object.keys(propMeta).length} properties`);

  // Generate constraints manifest
  const manifest = generateManifest(propMeta);

  // Write manifest to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`[CI/CD] ✅ Manifest written to ${OUTPUT_FILE}`);

  // Print summary
  console.log(`[CI/CD] Constraints generated:`);
  console.log(`  - Text properties: ${manifest.textProperties.length}`);
  console.log(`  - Color properties: ${manifest.colorProperties.length}`);
  console.log(`  - Numeric properties: ${manifest.numericProperties.length}`);
  console.log(`  - Select/enum properties: ${manifest.selectProperties.length}`);
  console.log(`  - Boolean properties: ${manifest.booleanProperties.length}`);
  console.log(`[CI/CD] AI generation will use these constraints`);
}

function generateManifest(propMeta) {
  const textProperties = [];
  const colorProperties = [];
  const numericProperties = [];
  const selectProperties = {};
  const booleanProperties = [];

  // Categorize properties by type
  for (const [key, prop] of Object.entries(propMeta)) {
    if (prop.type === 'text') {
      textProperties.push(key);
    } else if (prop.type === 'color') {
      colorProperties.push(key);
    } else if (prop.type === 'range' || prop.type === 'number') {
      numericProperties.push({
        name: key,
        min: prop.min,
        max: prop.max,
        step: prop.step || 1,
      });
    } else if (prop.type === 'select') {
      selectProperties[key] = prop.options || [];
    } else if (prop.type === 'checkbox') {
      booleanProperties.push(key);
    }
  }

  // Generate AI prompt constraints
  const constraints = {
    version: '1.0',
    generated: new Date().toISOString(),
    source: 'js/widgets.js:_propMeta',
    totalProperties: Object.keys(propMeta).length,

    // Categorical property lists for AI generation
    textProperties,
    colorProperties,
    numericProperties,
    selectProperties,
    booleanProperties,

    // AI generation rules
    generationRules: {
      textGeneration: {
        allowed: textProperties,
        guidance:
          'Generate realistic text content for these text properties. Keep text concise and relevant.',
      },
      colorGeneration: {
        allowed: colorProperties,
        guidance:
          'Generate valid hex colors for these color properties. Ensure good contrast and visual hierarchy.',
        validFormats: ['#rrggbb', '#rgb'],
      },
      numericGeneration: {
        guidance:
          'Generate numeric values within specified ranges. Use meaningful defaults based on property semantics.',
        ranges: numericProperties.reduce((acc, prop) => {
          acc[prop.name] = { min: prop.min, max: prop.max };
          return acc;
        }, {}),
      },
      enumGeneration: {
        guidance:
          'For select properties, only use values from the specified options. No custom values allowed.',
        options: selectProperties,
      },
      booleanGeneration: {
        allowed: booleanProperties,
        guidance: 'Generate true/false values for boolean properties based on design context.',
      },
    },

    // Validation schema for AI output
    validationRules: {
      text: {
        type: 'string',
        maxLength: 1000,
        required: false,
      },
      color: {
        type: 'string',
        pattern: '^#[0-9a-fA-F]{3,6}$',
        required: false,
      },
      numeric: {
        type: 'number',
        required: false,
      },
      select: {
        type: 'string',
        mustBeOneOf: true,
        required: false,
      },
      boolean: {
        type: 'boolean',
        required: false,
      },
    },

    // Backend prompt template with constraints
    backendPromptTemplate: `You are an Award-Winning Creative Director generating website component properties.

CRITICAL CONSTRAINTS:
1. Only use these TEXT properties: ${textProperties.join(', ')}
2. Only use these COLOR properties: ${colorProperties.join(', ')}
3. Only use these NUMERIC properties: ${numericProperties.map((p) => p.name).join(', ')}
4. Only use these ENUM properties with specified values: ${Object.entries(selectProperties)
        .map(([k, v]) => `${k}:[${v.join(',')}]`)
        .join(', ')}
5. Only use these BOOLEAN properties: ${booleanProperties.join(', ')}

NUMERIC PROPERTY RANGES:
${numericProperties.map((p) => `  - ${p.name}: ${p.min} to ${p.max}`).join('\n')}

ENUM PROPERTY OPTIONS:
${Object.entries(selectProperties)
  .map(([k, v]) => `  - ${k}: ${v.join(', ')}`)
  .join('\n')}

Generate only valid properties from above. Do not invent new properties or use invalid values.`,
  };

  return constraints;
}

// Run the script
generateConstraints().catch((err) => {
  console.error('[CI/CD] Error:', err);
  process.exit(1);
});

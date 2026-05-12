#!/usr/bin/env npx tsx
/**
 * @ai-context Script to generate CSS variables from design tokens
 *
 * Run manually: npm run generate:css (from shared/design-tokens)
 * Or: npx tsx shared/design-tokens/scripts/generate-css-variables.ts
 *
 * This script generates CSS custom properties from the design token definitions
 * and writes them to web-admin/app/globals.css (in the @theme block for Tailwind 4).
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
    accentColors,
    brandColors,
    fontFamily,
    fontSizesCss,
    goalProgressColors,
    lightColors,
    radiiCss,
    shadowsCss,
    spacingCss,
    strategyStatusColors,
    trendColors,
} from '../tokens/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateVars(
  obj: Record<string, string | number | readonly string[]>,
  prefix: string
): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const varName = `--${prefix}${toKebabCase(key)}`;
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`  ${varName}: ${value};`);
    }
  }
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE CSS
// ─────────────────────────────────────────────────────────────────────────────

function generateDesignTokensCss(): string {
  const themeSections: string[] = [];
  const rootSections: string[] = [];

  // Brand colors (Tailwind 4 uses --color-* prefix for color utilities)
  themeSections.push('  /* Brand Colors */');
  themeSections.push(...generateVars(brandColors, 'color-brand-'));
  themeSections.push('');

  // Semantic colors (light theme - web-admin is light-only)
  themeSections.push('  /* Semantic Colors */');
  themeSections.push(...generateVars(lightColors, 'color-'));
  themeSections.push('');

  // Accent colors with variants
  themeSections.push('  /* Accent Colors */');
  for (const [name, shades] of Object.entries(accentColors)) {
    themeSections.push(`  --color-${name}: ${shades.DEFAULT};`);
    themeSections.push(`  --color-${name}-light: ${shades.light};`);
    themeSections.push(`  --color-${name}-dark: ${shades.dark};`);
  }
  themeSections.push('');

  // Spacing — placed in :root (NOT @theme) to avoid colliding with Tailwind v4's
  // utility resolution. Tailwind resolves max-w-md, gap-sm, etc. from --spacing-*
  // in @theme, which breaks layout when our named tokens (xs/sm/md/lg/xl) shadow
  // Tailwind's size scale.
  rootSections.push('  /* Spacing */');
  rootSections.push(...generateVars(spacingCss, 'spacing-'));

  // Border radius
  themeSections.push('  /* Border Radius */');
  themeSections.push(...generateVars(radiiCss, 'radius-'));
  themeSections.push('');

  // Shadows
  themeSections.push('  /* Shadows */');
  themeSections.push(...generateVars(shadowsCss, 'shadow-'));
  themeSections.push('');

  // Font sizes
  themeSections.push('  /* Font Sizes */');
  themeSections.push(...generateVars(fontSizesCss, 'text-'));
  themeSections.push('');

  // Font family
  themeSections.push('  /* Font Family */');
  themeSections.push(`  --font-sans: ${fontFamily.sans};`);
  themeSections.push(`  --font-mono: ${fontFamily.mono};`);
  themeSections.push('');

  // Status colors (trend, progress, strategy)
  themeSections.push('  /* Trend Colors */');
  for (const [key, value] of Object.entries(trendColors.light)) {
    themeSections.push(`  --color-trend-${toKebabCase(key)}: ${value};`);
  }
  themeSections.push('');

  themeSections.push('  /* Goal Progress Colors */');
  for (const [key, value] of Object.entries(goalProgressColors.light)) {
    themeSections.push(`  --color-progress-${toKebabCase(key)}: ${value};`);
  }
  themeSections.push('');

  themeSections.push('  /* Strategy Status Colors */');
  for (const [status, colors] of Object.entries(strategyStatusColors.light)) {
    themeSections.push(`  --color-strategy-${status}: ${colors.color};`);
    themeSections.push(`  --color-strategy-${status}-bg: ${colors.bg};`);
  }

  return `/* ═══════════════════════════════════════════════════════════════════════════
 * AUTO-GENERATED FROM @hollis/design-tokens
 * Do not edit manually - run: npx tsx shared/design-tokens/scripts/generate-css-variables.ts
 * ═══════════════════════════════════════════════════════════════════════════ */

@theme {
${themeSections.join('\n')}
}

/* Spacing tokens as CSS variables (NOT in @theme to avoid colliding with
   Tailwind v4's utility resolution — e.g. --spacing-md would break max-w-md) */
:root {
${rootSections.join('\n')}
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUT_PATHS = [
  path.resolve(__dirname, '../../../web-admin/app/generated-tokens.css'),
  path.resolve(__dirname, '../../../web-public/app/generated-tokens.css'),
];

function writeToPath(outputPath: string, css: string): boolean {
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if content changed
  let existingContent = '';
  if (fs.existsSync(outputPath)) {
    existingContent = fs.readFileSync(outputPath, 'utf-8');
  }

  if (existingContent === css) {
    return false; // No change
  }

  fs.writeFileSync(outputPath, css, 'utf-8');
  return true; // Changed
}

function main() {
  const css = generateDesignTokensCss();
  let anyChanged = false;

  for (const outputPath of OUTPUT_PATHS) {
    const changed = writeToPath(outputPath, css);
    if (changed) {
      // eslint-disable-next-line no-console -- Script output
      console.log(`✓ Generated design tokens CSS: ${outputPath}`);
      anyChanged = true;
    }
  }

  if (!anyChanged) {
    // eslint-disable-next-line no-console -- Script output
    console.log('✓ Design tokens CSS is up to date');
  }
}

main();

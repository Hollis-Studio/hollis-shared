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
} from '../tokens';

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
  const sections: string[] = [];

  // Brand colors (Tailwind 4 uses --color-* prefix for color utilities)
  sections.push('  /* Brand Colors */');
  sections.push(...generateVars(brandColors, 'color-brand-'));
  sections.push('');

  // Semantic colors (light theme - web-admin is light-only)
  sections.push('  /* Semantic Colors */');
  sections.push(...generateVars(lightColors, 'color-'));
  sections.push('');

  // Accent colors with variants
  sections.push('  /* Accent Colors */');
  for (const [name, shades] of Object.entries(accentColors)) {
    sections.push(`  --color-${name}: ${shades.DEFAULT};`);
    sections.push(`  --color-${name}-light: ${shades.light};`);
    sections.push(`  --color-${name}-dark: ${shades.dark};`);
  }
  sections.push('');

  // Spacing
  sections.push('  /* Spacing */');
  sections.push(...generateVars(spacingCss, 'spacing-'));
  sections.push('');

  // Border radius
  sections.push('  /* Border Radius */');
  sections.push(...generateVars(radiiCss, 'radius-'));
  sections.push('');

  // Shadows
  sections.push('  /* Shadows */');
  sections.push(...generateVars(shadowsCss, 'shadow-'));
  sections.push('');

  // Font sizes
  sections.push('  /* Font Sizes */');
  sections.push(...generateVars(fontSizesCss, 'text-'));
  sections.push('');

  // Font family
  sections.push('  /* Font Family */');
  sections.push(`  --font-sans: ${fontFamily.sans};`);
  sections.push(`  --font-mono: ${fontFamily.mono};`);
  sections.push('');

  // Status colors (trend, progress, strategy)
  sections.push('  /* Trend Colors */');
  for (const [key, value] of Object.entries(trendColors.light)) {
    sections.push(`  --color-trend-${toKebabCase(key)}: ${value};`);
  }
  sections.push('');

  sections.push('  /* Goal Progress Colors */');
  for (const [key, value] of Object.entries(goalProgressColors.light)) {
    sections.push(`  --color-progress-${toKebabCase(key)}: ${value};`);
  }
  sections.push('');

  sections.push('  /* Strategy Status Colors */');
  for (const [status, colors] of Object.entries(strategyStatusColors.light)) {
    sections.push(`  --color-strategy-${status}: ${colors.color};`);
    sections.push(`  --color-strategy-${status}-bg: ${colors.bg};`);
  }

  return `/* ═══════════════════════════════════════════════════════════════════════════
 * AUTO-GENERATED FROM @hollis/design-tokens
 * Do not edit manually - run: npx tsx shared/design-tokens/scripts/generate-css-variables.ts
 * ═══════════════════════════════════════════════════════════════════════════ */

@theme {
${sections.join('\n')}
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

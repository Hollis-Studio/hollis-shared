/**
 * @ai-context AI Contracts Module | Shared AI types, validation, and prompt templates
 *
 * This module provides shared contracts for AI-powered features:
 * - AI types for plan/strategy generation
 * - Zod validation schemas
 * - Prompt templates and builders
 *
 * IMPORTANT: This module must remain pure TypeScript + Zod.
 * - NO Gemini SDK imports (@google/genai)
 * - NO Node.js-only imports
 * - NO platform-specific code
 *
 * Tool schemas (which require @google/genai) remain in server/src/services.
 *
 * Consumers:
 * - Server: server/src/services/ai*
 * - Web-admin: web-admin/services
 */
export * from './ai-types.js';
export * from './ai-validation.js';
export * from './prompt-templates.js';
export * from './workout-ai-wire.js';
//# sourceMappingURL=index.d.ts.map
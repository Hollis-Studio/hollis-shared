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

// AI Types - types for AI operations
export * from './ai-types';

// AI Validation - Zod schemas for request/response validation
export * from './ai-validation';

// Prompt Templates - system prompts and prompt builders
export * from './prompt-templates';

// Note: Domain constants (AI_NOTE_CATEGORIES, WORKOUT_SECTION_TYPES, etc.) 
// are already exported via shared/contracts/domain
// No need to re-export them here to avoid duplicate exports



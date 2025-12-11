/**
 * @ai-context Shared Contracts Module | Single source of truth for all contracts across the monorepo
 *
 * This module provides:
 * - API route definitions and types
 * - Domain contracts (types, schemas, constants)
 * - Shared Zod schemas for validation
 * - Common constants and enums
 *
 * IMPORTANT: This module must remain pure TypeScript + Zod only.
 * - NO React/React Native imports
 * - NO Node.js-only imports (fs, path, etc.)
 * - NO platform-specific code
 *
 * Consumers:
 * - Mobile app: /src/*
 * - Backend server: /server/src/*
 * - Web admin: /web-admin/*
 *
 * @packageDocumentation
 */

// API Routes
export * from './api';

// Domain contracts
export * from './domain';

// Zod schemas
export * from './schemas';

// Constants
export * from './constants';

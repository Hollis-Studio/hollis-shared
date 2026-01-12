/**
 * @ai-context Primitives barrel | Primitive types with no cross-dependencies
 *
 * This module exports primitive types that have no dependencies on other contract modules.
 * Used to break circular dependencies while maintaining single source of truth.
 *
 * deps: zod only | consumers: all contract modules
 */

export * from './volume-level';

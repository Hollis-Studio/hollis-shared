/**
 * @ai-context Pure unit conversion arithmetic | shared across mobile, web-admin, server
 *
 * Self-contained pure functions for weight and height conversions.
 * No React, no store access — just math.
 *
 * All conversion factors are sourced from the canonical UNIT_CONVERSION constant
 * in shared/contracts. Persisted values are always metric (kg, cm); convert
 * at the display boundary only.
 *
 * consumers: web-admin/hooks/useUnits, web-admin/hooks/useUnitFormatter
 *
 * NOTE: Mobile's src/utils/units.ts uses a more capable data-driven registry
 * (unitRegistry) and is not replaced by this module. This shared extract
 * targets the simpler weight/height arithmetic only.
 */
import { UNIT_CONVERSION } from "@hollis/contracts";

const { LBS_PER_KG, CM_PER_INCH, INCHES_PER_FOOT } = UNIT_CONVERSION;

/**
 * Convert kilograms to pounds.
 * Base unit → imperial display unit.
 *
 * @param kg - Weight in kilograms
 * @returns Weight in pounds
 *
 * @example kgToLbs(68.04) // ≈ 150.0
 */
export function kgToLbs(kg: number): number {
  return kg * LBS_PER_KG;
}

/**
 * Convert pounds to kilograms.
 * Imperial input → base unit for storage.
 *
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms
 *
 * @example lbsToKg(150) // ≈ 68.04
 */
export function lbsToKg(lbs: number): number {
  return lbs / LBS_PER_KG;
}

/**
 * Convert centimeters to feet and inches.
 * Includes edge-case handling: when fractional inches round to 12, carry
 * the extra inch into feet (e.g. 182.88 cm = exactly 6'0", not 5'12").
 *
 * @param cm - Height in centimeters
 * @returns Object with integer `feet` and rounded integer `inches`
 *
 * @example cmToFeetInches(180) // { feet: 5, inches: 11 }
 * @example cmToFeetInches(182.88) // { feet: 6, inches: 0 }  — NOT { feet: 5, inches: 12 }
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
  let inches = Math.round(totalInches % INCHES_PER_FOOT);
  // Handle rounding edge case: 11.5+ inches rounds to 12 — carry into feet
  if (inches >= INCHES_PER_FOOT) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

/**
 * Convert feet and inches to centimeters.
 * Imperial input → base unit for storage.
 *
 * @param feet   - Whole feet
 * @param inches - Additional inches (0–11)
 * @returns Height in centimeters
 *
 * @example feetInchesToCm(5, 10) // ≈ 177.8
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * INCHES_PER_FOOT + inches;
  return totalInches * CM_PER_INCH;
}

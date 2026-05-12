/**
 * Convert kilograms to pounds.
 * Base unit → imperial display unit.
 *
 * @param kg - Weight in kilograms
 * @returns Weight in pounds
 *
 * @example kgToLbs(68.04) // ≈ 150.0
 */
export declare function kgToLbs(kg: number): number;
/**
 * Convert pounds to kilograms.
 * Imperial input → base unit for storage.
 *
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms
 *
 * @example lbsToKg(150) // ≈ 68.04
 */
export declare function lbsToKg(lbs: number): number;
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
export declare function cmToFeetInches(cm: number): {
    feet: number;
    inches: number;
};
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
export declare function feetInchesToCm(feet: number, inches: number): number;
//# sourceMappingURL=unitConversions.d.ts.map
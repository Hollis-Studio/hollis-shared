/**
 * @ai-context Gym domain — per-exercise engine override columns (alpha.42)
 *
 * Pins the GymExerciseInstanceSchema additions that replace the interim
 * UserSettings.exerciseEngineOverrides passthrough map (Workouts progression
 * engine v3, spec DEC12):
 * 1. AUTOREGULATION_STYLES tuple + AutoregulationStyleSchema
 * 2. repRangeMin / repRangeMax / autoregulationStyle on GymExerciseInstance
 * 3. Backward compatibility — records without the new fields still parse
 * 4. notes now bounded at 500 (parity with GymEquipmentItemSchema.notes)
 */

import {
  AUTOREGULATION_STYLES,
  AutoregulationStyleSchema,
  GymExerciseInstanceSchema,
} from '../domain/gym';

const baseInstance = {
  id: 'gei-1',
  userId: 'user-1',
  gymProfileId: 'gym-1',
  canonicalExerciseId: 'leg_extension',
  weightUnit: 'lbs',
  weightMode: 'absolute',
  isActive: true,
};

describe('AutoregulationStyleSchema', () => {
  it('exposes exactly the two v3 set styles', () => {
    expect(AUTOREGULATION_STYLES).toEqual(['pyramid_down', 'hold_weight']);
  });

  it('rejects values outside the enum', () => {
    expect(AutoregulationStyleSchema.safeParse('ramp_up').success).toBe(false);
  });
});

describe('GymExerciseInstanceSchema engine-override columns', () => {
  it('parses a record with the new override fields', () => {
    const result = GymExerciseInstanceSchema.safeParse({
      ...baseInstance,
      repRangeMin: 20,
      repRangeMax: 30,
      autoregulationStyle: 'hold_weight',
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.repRangeMin).toBe(20);
    expect(result.data.repRangeMax).toBe(30);
    expect(result.data.autoregulationStyle).toBe('hold_weight');
  });

  it('parses a legacy record without the new fields (backward compatible)', () => {
    const result = GymExerciseInstanceSchema.safeParse(baseInstance);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.repRangeMin).toBeUndefined();
    expect(result.data.autoregulationStyle).toBeUndefined();
  });

  it('accepts explicit nulls (DB round-trip / clear-override shape)', () => {
    const result = GymExerciseInstanceSchema.safeParse({
      ...baseInstance,
      repRangeMin: null,
      repRangeMax: null,
      autoregulationStyle: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-integer and out-of-range rep bounds', () => {
    expect(
      GymExerciseInstanceSchema.safeParse({ ...baseInstance, repRangeMin: 7.5 }).success,
    ).toBe(false);
    expect(
      GymExerciseInstanceSchema.safeParse({ ...baseInstance, repRangeMax: 0 }).success,
    ).toBe(false);
    expect(
      GymExerciseInstanceSchema.safeParse({ ...baseInstance, repRangeMax: 101 }).success,
    ).toBe(false);
  });

  it('rejects an unknown autoregulation style', () => {
    expect(
      GymExerciseInstanceSchema.safeParse({
        ...baseInstance,
        autoregulationStyle: 'wave_load',
      }).success,
    ).toBe(false);
  });

  it('bounds notes at 500 characters', () => {
    expect(
      GymExerciseInstanceSchema.safeParse({ ...baseInstance, notes: 'a'.repeat(500) }).success,
    ).toBe(true);
    expect(
      GymExerciseInstanceSchema.safeParse({ ...baseInstance, notes: 'a'.repeat(501) }).success,
    ).toBe(false);
  });
});

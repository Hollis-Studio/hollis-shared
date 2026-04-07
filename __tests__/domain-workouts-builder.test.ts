/**
 * @ai-context Workout Builder Domain Contracts Tests
 *
 * This test suite verifies the WorkoutPlanBuilder validation schemas:
 * 1. workoutBuilderSetSchema: individual exercise set validation
 * 2. workoutBuilderSectionSchema: section validation (type, title, sets presence)
 * 3. workoutBuilderDaySchema: day validation (dayOfWeek, sections for non-rest days)
 * 4. workoutWeekBuilderSchema: full 7-day weekly plan validation
 * 5. collectWorkoutBuilderErrors: human-readable error extraction
 *
 * Run: npx jest shared/contracts/__tests__/domain-workouts-builder.test.ts
 */

import {
  collectWorkoutBuilderErrors,
  workoutBuilderDaySchema,
  workoutBuilderSectionSchema,
  workoutBuilderSetSchema,
  workoutWeekBuilderSchema,
} from '../domain/workouts';

// ============================================================================
// HELPERS
// ============================================================================

function makeSet(overrides: Record<string, unknown> = {}) {
  return {
    id: 'set-1',
    name: 'Bench Press',
    exerciseId: 'exercise-uuid-1',
    ...overrides,
  };
}

function makeSection(overrides: Record<string, unknown> = {}) {
  return {
    id: 'section-1',
    type: 'working' as const,
    title: 'Working Sets',
    sets: [makeSet()],
    ...overrides,
  };
}

function makeDay(overrides: Record<string, unknown> = {}) {
  return {
    id: 'day-0',
    dayOfWeek: 0,
    name: 'Leg Day',
    icon: 'barbell-outline',
    sections: [makeSection()],
    isRestDay: false,
    ...overrides,
  };
}

function makeRestDay(dayOfWeek: number) {
  return {
    id: `day-${dayOfWeek}`,
    dayOfWeek,
    name: 'Rest Day',
    icon: 'bed-outline',
    sections: [],
    isRestDay: true,
  };
}

/**
 * Build a valid 7-day week array: day 0 is a workout day, days 1–6 are rest days.
 */
function makeValidWeek() {
  return [
    makeDay({ dayOfWeek: 0 }),
    makeRestDay(1),
    makeRestDay(2),
    makeRestDay(3),
    makeRestDay(4),
    makeRestDay(5),
    makeRestDay(6),
  ];
}

// ============================================================================
// workoutBuilderSetSchema
// ============================================================================

describe('workoutBuilderSetSchema', () => {
  it('accepts a minimal valid set', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet()).success).toBe(true);
  });

  it('accepts a set with all optional fields', () => {
    const result = workoutBuilderSetSchema.safeParse({
      id: 'set-1',
      name: 'Squat',
      exerciseId: 'ex-uuid',
      description: '3 sets of 5 reps',
      reps: 5,
      weight: 100,
      weightUnit: 'kg',
      duration: 60,
      rpe: 8,
      restSeconds: 90,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a set with empty name', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ name: '' })).success).toBe(false);
  });

  it('rejects a set with reps of zero', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ reps: 0 })).success).toBe(false);
  });

  it('accepts a set with reps of 1', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ reps: 1 })).success).toBe(true);
  });

  it('rejects a set with negative weight', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ weight: -1 })).success).toBe(false);
  });

  it('accepts a set with weight of 0', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ weight: 0 })).success).toBe(true);
  });

  it('rejects a set with duration of zero', () => {
    expect(workoutBuilderSetSchema.safeParse(makeSet({ duration: 0 })).success).toBe(false);
  });

  it('rejects a set with an invalid link URL', () => {
    expect(
      workoutBuilderSetSchema.safeParse(makeSet({ link: 'not-a-url' })).success,
    ).toBe(false);
  });

  it('accepts a set with a valid https link', () => {
    expect(
      workoutBuilderSetSchema.safeParse(makeSet({ link: 'https://youtube.com/watch?v=abc' })).success,
    ).toBe(true);
  });

  it('accepts a set with an empty string link (optional field)', () => {
    // Empty string is allowed for the link field (user cleared it)
    expect(
      workoutBuilderSetSchema.safeParse(makeSet({ link: '' })).success,
    ).toBe(true);
  });
});

// ============================================================================
// workoutBuilderSectionSchema
// ============================================================================

describe('workoutBuilderSectionSchema', () => {
  it('accepts a valid warmup section', () => {
    expect(
      workoutBuilderSectionSchema.safeParse(makeSection({ type: 'warmup', title: 'Warm Up' })).success,
    ).toBe(true);
  });

  it('accepts a valid cooldown section', () => {
    expect(
      workoutBuilderSectionSchema.safeParse(makeSection({ type: 'cooldown', title: 'Cool Down' })).success,
    ).toBe(true);
  });

  it('rejects an unknown section type', () => {
    expect(
      workoutBuilderSectionSchema.safeParse(makeSection({ type: 'stretching' })).success,
    ).toBe(false);
  });

  it('rejects a section with empty title', () => {
    expect(
      workoutBuilderSectionSchema.safeParse(makeSection({ title: '' })).success,
    ).toBe(false);
  });

  it('rejects a section with no exercises (sets is empty array)', () => {
    const result = workoutBuilderSectionSchema.safeParse(makeSection({ sets: [] }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Each section must have at least one exercise');
    }
  });

  it('rejects a section with an invalid set inside', () => {
    const result = workoutBuilderSectionSchema.safeParse(
      makeSection({ sets: [makeSet({ name: '' })] }),
    );
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// workoutBuilderDaySchema
// ============================================================================

describe('workoutBuilderDaySchema', () => {
  it('accepts a valid workout day', () => {
    expect(workoutBuilderDaySchema.safeParse(makeDay()).success).toBe(true);
  });

  it('accepts a valid rest day with zero sections', () => {
    expect(workoutBuilderDaySchema.safeParse(makeRestDay(1)).success).toBe(true);
  });

  it('accepts a rest day with optional sections (e.g. mobility)', () => {
    const restWithMobility = {
      ...makeRestDay(2),
      sections: [makeSection({ type: 'warmup', title: 'Mobility' })],
    };
    expect(workoutBuilderDaySchema.safeParse(restWithMobility).success).toBe(true);
  });

  it('rejects a non-rest day with no sections', () => {
    const result = workoutBuilderDaySchema.safeParse(makeDay({ sections: [] }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('A workout day must have at least one section');
    }
  });

  it('rejects a day with invalid dayOfWeek (> 6)', () => {
    expect(workoutBuilderDaySchema.safeParse(makeDay({ dayOfWeek: 7 })).success).toBe(false);
  });

  it('rejects a day with invalid dayOfWeek (< 0)', () => {
    expect(workoutBuilderDaySchema.safeParse(makeDay({ dayOfWeek: -1 })).success).toBe(false);
  });

  it('rejects a day with empty name', () => {
    expect(workoutBuilderDaySchema.safeParse(makeDay({ name: '' })).success).toBe(false);
  });
});

// ============================================================================
// workoutWeekBuilderSchema
// ============================================================================

describe('workoutWeekBuilderSchema', () => {
  it('accepts a valid 7-day week with at least one workout day', () => {
    expect(workoutWeekBuilderSchema.safeParse(makeValidWeek()).success).toBe(true);
  });

  it('accepts a week where all days are workout days', () => {
    const allWorkout = Array.from({ length: 7 }, (_, i) =>
      makeDay({ id: `day-${i}`, dayOfWeek: i, name: `Day ${i + 1}` }),
    );
    expect(workoutWeekBuilderSchema.safeParse(allWorkout).success).toBe(true);
  });

  it('rejects a week with fewer than 7 days', () => {
    const sixDays = makeValidWeek().slice(0, 6);
    const result = workoutWeekBuilderSchema.safeParse(sixDays);
    expect(result.success).toBe(false);
  });

  it('rejects a week with more than 7 days', () => {
    const eightDays = [...makeValidWeek(), makeRestDay(7)];
    expect(workoutWeekBuilderSchema.safeParse(eightDays).success).toBe(false);
  });

  it('rejects a week where all 7 days are rest days', () => {
    const allRest = Array.from({ length: 7 }, (_, i) => makeRestDay(i));
    const result = workoutWeekBuilderSchema.safeParse(allRest);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('At least one day must be a workout day (not all rest)');
    }
  });

  it('rejects a week with duplicate dayOfWeek values', () => {
    const withDuplicate = [
      makeDay({ dayOfWeek: 0 }),
      makeDay({ dayOfWeek: 0 }), // duplicate!
      makeRestDay(2),
      makeRestDay(3),
      makeRestDay(4),
      makeRestDay(5),
      makeRestDay(6),
    ];
    const result = workoutWeekBuilderSchema.safeParse(withDuplicate);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Each day must have a unique dayOfWeek value');
    }
  });

  it('rejects a week where a workout day has an empty section', () => {
    const weekWithEmptySection = makeValidWeek();
    // Override day 0 to have a section with no exercises
    weekWithEmptySection[0] = makeDay({
      sections: [makeSection({ sets: [] })],
    });
    expect(workoutWeekBuilderSchema.safeParse(weekWithEmptySection).success).toBe(false);
  });
});

// ============================================================================
// collectWorkoutBuilderErrors
// ============================================================================

describe('collectWorkoutBuilderErrors', () => {
  it('returns empty array for a successful parse', () => {
    const result = workoutWeekBuilderSchema.safeParse(makeValidWeek());
    expect(collectWorkoutBuilderErrors(result)).toEqual([]);
  });

  it('returns an array of error strings for a failed parse', () => {
    const allRest = Array.from({ length: 7 }, (_, i) => makeRestDay(i));
    const result = workoutWeekBuilderSchema.safeParse(allRest);
    const errors = collectWorkoutBuilderErrors(result);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((e) => typeof e === 'string')).toBe(true);
  });

  it('includes path context for nested errors', () => {
    const weekWithBadSet = makeValidWeek();
    weekWithBadSet[0] = makeDay({
      sections: [makeSection({ sets: [makeSet({ name: '' })] })],
    });
    const result = workoutWeekBuilderSchema.safeParse(weekWithBadSet);
    const errors = collectWorkoutBuilderErrors(result);
    // Errors should contain path info (e.g. "0.sections.0.sets.0.name: ...")
    expect(errors.some((e) => e.includes('.'))).toBe(true);
  });
});

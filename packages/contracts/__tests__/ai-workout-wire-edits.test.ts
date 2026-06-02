/**
 * @ai-context Workouts AI wire contract — edit operations + UserTrainingContext.
 *
 * Locks the alpha.27 additions: the 8-op semantically-addressed EditOperation
 * union (with its union-level superRefine cross-field rules) and the typed
 * UserTrainingContext payload that replaced `z.record(string, unknown)`.
 *
 * Run: npx jest packages/contracts/__tests__/ai-workout-wire-edits.test.ts
 */

import {
  DayRefSchema,
  SlotRefSchema,
  EditOperationSchema,
  UserTrainingContextSchema,
  SmartBuilderRequestSchema,
} from '../ai/workout-ai-wire';

describe('DayRefSchema', () => {
  it('accepts exactly one of name / index / dayOfWeek', () => {
    expect(DayRefSchema.safeParse({ name: 'Wednesday' }).success).toBe(true);
    expect(DayRefSchema.safeParse({ index: 2 }).success).toBe(true);
    expect(DayRefSchema.safeParse({ dayOfWeek: 3 }).success).toBe(true);
  });

  it('rejects zero or multiple addressing fields', () => {
    expect(DayRefSchema.safeParse({}).success).toBe(false);
    expect(DayRefSchema.safeParse({ name: 'Mon', dayOfWeek: 1 }).success).toBe(false);
  });
});

describe('SlotRefSchema', () => {
  it('accepts a slotId form and a {day, exercise} form', () => {
    expect(SlotRefSchema.safeParse({ slotId: 'd2-e1' }).success).toBe(true);
    expect(
      SlotRefSchema.safeParse({
        day: { name: 'Wednesday' },
        exercise: { canonicalExerciseId: 'bench-press' },
      }).success,
    ).toBe(true);
  });
});

describe('EditOperationSchema', () => {
  it('accepts every op in the union', () => {
    const ops = [
      { op: 'replace_exercise', slot: { slotId: 'd2-e1' }, newExerciseId: 'incline-machine-press' },
      { op: 'update_set_params', slot: { slotId: 'd0-e0' }, params: { sets: 4, reps: 8 } },
      { op: 'remove_exercise', slot: { slotId: 'd1-e3' } },
      {
        op: 'add_exercise',
        day: { name: 'Friday' },
        canonicalExerciseId: 'face-pull',
        exerciseType: 'lifting',
      },
      { op: 'move_or_swap_days', fromDay: { dayOfWeek: 1 }, toDay: { dayOfWeek: 3 }, mode: 'swap' },
      { op: 'reorder_within_day', day: { index: 0 }, orderedSlots: [{ slotId: 'd0-e1' }, { slotId: 'd0-e0' }] },
      { op: 'rename_or_reschedule_day', day: { dayOfWeek: 1 }, newName: 'Push Day' },
      { op: 'apply_to_all_days', fromExerciseId: 'bench-press', toExerciseId: 'incline-machine-press' },
    ];
    for (const op of ops) {
      expect(EditOperationSchema.safeParse(op).success).toBe(true);
    }
  });

  it('rejects update_set_params with no params fields (no silent no-op)', () => {
    expect(EditOperationSchema.safeParse({ op: 'update_set_params', slot: { slotId: 'd0-e0' }, params: {} }).success).toBe(false);
  });

  it('rejects rename_or_reschedule_day with neither newName nor newDayOfWeek', () => {
    expect(EditOperationSchema.safeParse({ op: 'rename_or_reschedule_day', day: { dayOfWeek: 1 } }).success).toBe(false);
  });

  it('enforces numeric bounds on params', () => {
    expect(EditOperationSchema.safeParse({ op: 'update_set_params', slot: { slotId: 'x' }, params: { sets: 0 } }).success).toBe(false);
    expect(EditOperationSchema.safeParse({ op: 'update_set_params', slot: { slotId: 'x' }, params: { reps: -5 } }).success).toBe(false);
    expect(EditOperationSchema.safeParse({ op: 'update_set_params', slot: { slotId: 'x' }, params: { rir: 99 } }).success).toBe(false);
  });

  it('rejects an unknown op', () => {
    expect(EditOperationSchema.safeParse({ op: 'nuke_program' }).success).toBe(false);
  });
});

describe('UserTrainingContextSchema', () => {
  const valid = {
    profile: { experienceLevel: 'intermediate', displayUnit: 'lbs' },
    exerciseStrengthStates: [
      { canonicalExerciseId: 'bench-press', exerciseName: 'Bench Press', currentE1RMKg: 100 },
    ],
    recentWorkouts: [],
    injuries: [{ muscleGroup: 'shoulders', description: 'left rotator cuff' }],
    gym: { exerciseSelectionMode: 'equipment_based', equipment: ['barbell', 'dumbbell'] },
    cardioBaselines: [],
    exerciseLibrary: [{ id: 'bench-press', name: 'Bench Press' }],
  };

  it('accepts a realistic, fully-populated context', () => {
    expect(UserTrainingContextSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a bare object (the old z.record(unknown) escape hatch is closed)', () => {
    expect(UserTrainingContextSchema.safeParse({}).success).toBe(false);
  });

  it('caps strength states and recent workouts', () => {
    const tooMany = { ...valid, exerciseStrengthStates: Array.from({ length: 51 }, (_, i) => ({ canonicalExerciseId: `e${i}`, exerciseName: `E${i}`, currentE1RMKg: 50 })) };
    expect(UserTrainingContextSchema.safeParse(tooMany).success).toBe(false);
  });

  it('threads through a full SmartBuilderRequest', () => {
    expect(
      SmartBuilderRequestSchema.safeParse({
        action: 'refine',
        conversationHistory: [{ role: 'user', content: 'swap bench for incline on Wednesday' }],
        userContext: valid,
        programRef: { draft: true },
      }).success,
    ).toBe(true);
  });
});

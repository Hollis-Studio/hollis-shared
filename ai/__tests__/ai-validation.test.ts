/**
 * @ai-context AI Validation Schema Tests | Validates all Zod schemas in ai-validation.ts
 *
 * This test suite verifies:
 * 1. All schemas accept valid data
 * 2. All schemas reject invalid data with proper error messages
 * 3. Edge cases are handled correctly (empty strings, missing fields, wrong types)
 * 4. Schema refinements and transformations work correctly
 *
 * Run: npm run test:contracts (from shared/contracts or root)
 */

import { ZodError } from 'zod';
import {
    AI_NOTE_CATEGORIES_FOR_VALIDATION,
    batchSearchExercisesArgsSchema,
    createExerciseArgsSchema,
    createPhaseArgsSchema,
    createStrategyGoalArgsSchema,
    generatedDaySchema,
    generatedExerciseSchema,
    generatedSectionSchema,
    generateNutritionTargetsArgsSchema,
    generateStrategyArgsSchema,
    generateWorkoutPlanArgsSchema,
    requestClarificationArgsSchema,
    savePermanentNoteArgsSchema,
    searchExerciseLibraryArgsSchema,
    strategyGenerationRequestSchema,
    unresolvedExerciseSchema,
    workoutPlanGenerationResultSchema,
} from '../ai-validation';

import {
    GoalMetricKeySchema,
    WORKOUT_SECTION_TYPES,
} from '@hollis/contracts';

// ============================================================================
// GENERATED EXERCISE SCHEMA TESTS
// ============================================================================

describe('generatedExerciseSchema', () => {
  describe('valid data', () => {
    it('should accept minimal valid exercise', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Bench Press',
        exerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      });
      expect(result.success).toBe(true);
    });

    it('should accept exercise with all optional fields', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Squat',
        exerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        sets: 4,
        reps: '8-10',
        weight: '185lbs',
        duration: '30 seconds',
        notes: 'Control the descent',
        link: 'https://example.com/video',
      });
      expect(result.success).toBe(true);
    });

    it('should transform empty link string to undefined', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Deadlift',
        exerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        link: '',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.link).toBeUndefined();
      }
    });
  });

  describe('invalid data', () => {
    it('should reject missing name', () => {
      const result = generatedExerciseSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = generatedExerciseSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid sets (non-positive)', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Curl',
        sets: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid sets (non-integer)', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Curl',
        sets: 3.5,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid link URL', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Curl',
        link: 'not-a-valid-url',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// GENERATED SECTION SCHEMA TESTS
// ============================================================================

describe('generatedSectionSchema', () => {
  const validExercise = { name: 'Push-up', exerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', sets: 3, reps: '10' };

  describe('valid data', () => {
    it('should accept valid warmup section', () => {
      const result = generatedSectionSchema.safeParse({
        type: 'warmup',
        title: 'Dynamic Warmup',
        exercises: [validExercise],
      });
      expect(result.success).toBe(true);
    });

    it('should accept all valid section types', () => {
      for (const type of WORKOUT_SECTION_TYPES) {
        const result = generatedSectionSchema.safeParse({
          type,
          title: `${type} section`,
          exercises: [],
        });
        expect(result.success).toBe(true);
      }
    });

    it('should accept empty exercises array', () => {
      const result = generatedSectionSchema.safeParse({
        type: 'cooldown',
        title: 'Stretching',
        exercises: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject invalid section type', () => {
      const result = generatedSectionSchema.safeParse({
        type: 'invalid_type',
        title: 'Test',
        exercises: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty title', () => {
      const result = generatedSectionSchema.safeParse({
        type: 'working',
        title: '',
        exercises: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing exercises array', () => {
      const result = generatedSectionSchema.safeParse({
        type: 'working',
        title: 'Main Work',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// GENERATED DAY SCHEMA TESTS
// ============================================================================

describe('generatedDaySchema', () => {
  const validSection = {
    type: 'working' as const,
    title: 'Main',
    exercises: [{ name: 'Squat', exerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' }],
  };

  describe('valid data', () => {
    it('should accept valid workout day', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: 1,
        name: 'Push Day',
        isRestDay: false,
        sections: [validSection],
      });
      expect(result.success).toBe(true);
    });

    it('should accept rest day with no sections', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: 0,
        name: 'Rest Day',
        isRestDay: true,
        sections: [],
      });
      expect(result.success).toBe(true);
    });

    it('should accept all valid dayOfWeek values (0-6)', () => {
      for (let day = 0; day <= 6; day++) {
        const result = generatedDaySchema.safeParse({
          dayOfWeek: day,
          name: `Day ${day}`,
          isRestDay: false,
          sections: [],
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('invalid data', () => {
    it('should reject invalid dayOfWeek (-1)', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: -1,
        name: 'Invalid',
        isRestDay: false,
        sections: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid dayOfWeek (7)', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: 7,
        name: 'Invalid',
        isRestDay: false,
        sections: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: 1,
        name: '',
        isRestDay: false,
        sections: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean isRestDay', () => {
      const result = generatedDaySchema.safeParse({
        dayOfWeek: 1,
        name: 'Test',
        isRestDay: 'yes',
        sections: [],
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// GENERATE WORKOUT PLAN ARGS SCHEMA TESTS
// ============================================================================

describe('generateWorkoutPlanArgsSchema', () => {
  const validDay = {
    dayOfWeek: 1,
    name: 'Push Day',
    isRestDay: false,
    sections: [],
  };

  describe('valid data', () => {
    it('should accept plan with single day', () => {
      const result = generateWorkoutPlanArgsSchema.safeParse({
        days: [validDay],
      });
      expect(result.success).toBe(true);
    });

    it('should accept plan with all 7 days', () => {
      const days = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        name: `Day ${i}`,
        isRestDay: i === 0 || i === 6,
        sections: [],
      }));
      const result = generateWorkoutPlanArgsSchema.safeParse({ days });
      expect(result.success).toBe(true);
    });

    it('should accept plan with reasoning', () => {
      const result = generateWorkoutPlanArgsSchema.safeParse({
        days: [validDay],
        reasoning: 'This plan focuses on progressive overload.',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject empty days array', () => {
      const result = generateWorkoutPlanArgsSchema.safeParse({ days: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one day');
      }
    });

    it('should reject missing days field', () => {
      const result = generateWorkoutPlanArgsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// SAVE PERMANENT NOTE ARGS SCHEMA TESTS
// ============================================================================

describe('savePermanentNoteArgsSchema', () => {
  describe('valid data', () => {
    it('should accept all valid categories', () => {
      for (const category of AI_NOTE_CATEGORIES_FOR_VALIDATION) {
        const result = savePermanentNoteArgsSchema.safeParse({
          content: 'Test note content',
          category,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('invalid data', () => {
    it('should reject empty content', () => {
      const result = savePermanentNoteArgsSchema.safeParse({
        content: '',
        category: 'INJURY',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const result = savePermanentNoteArgsSchema.safeParse({
        content: 'Valid content',
        category: 'INVALID_CATEGORY',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing category', () => {
      const result = savePermanentNoteArgsSchema.safeParse({
        content: 'Valid content',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// GENERATE NUTRITION TARGETS ARGS SCHEMA TESTS
// ============================================================================

describe('generateNutritionTargetsArgsSchema', () => {
  const validDailyTargets = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 80,
  }));

  describe('valid data', () => {
    it('should accept valid nutrition targets', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 2500,
        protein: 180,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: 'Based on moderate activity and muscle gain goals.',
      });
      expect(result.success).toBe(true);
    });

    it('should accept minimum valid values', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 1,
        protein: 0,
        carbs: 0,
        fat: 0,
        dailyTargets: Array.from({ length: 7 }, (_, i) => ({
          dayOfWeek: i,
          calories: 1,
          protein: 0,
          carbs: 0,
          fat: 0,
        })),
        reasoning: 'Test',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject calories exceeding max (10000)', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 15000,
        protein: 180,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('unreasonably high');
      }
    });

    it('should reject protein exceeding max (500g)', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 2500,
        protein: 600,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative values', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 2500,
        protein: -10,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty reasoning', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 2500,
        protein: 180,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-integer calories', () => {
      const result = generateNutritionTargetsArgsSchema.safeParse({
        calories: 2500.5,
        protein: 180,
        carbs: 300,
        fat: 80,
        dailyTargets: validDailyTargets,
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// CREATE STRATEGY GOAL ARGS SCHEMA TESTS
// ============================================================================

describe('createStrategyGoalArgsSchema', () => {
  describe('valid data', () => {
    it('should accept minimal goal', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'squat_1rm',
        goalTarget: 315,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.weight).toBe(1.0); // default value
      }
    });

    it('should accept goal with all optional fields', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'deadlift_1rm',
        goalTarget: 405,
        linkedExerciseId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        weight: 2.5,
        baselineValue: 365,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject empty goalMetric', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: '',
        goalTarget: 100,
      });
      expect(result.success).toBe(false);
    });

    it('should reject weight below min (0.1)', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'test',
        goalTarget: 100,
        weight: 0.05,
      });
      expect(result.success).toBe(false);
    });

    it('should reject weight above max (10)', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'test',
        goalTarget: 100,
        weight: 15,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID for linkedExerciseId', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'test',
        goalTarget: 100,
        linkedExerciseId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// CREATE PHASE ARGS SCHEMA TESTS
// ============================================================================

describe('createPhaseArgsSchema', () => {
  describe('valid data', () => {
    it('should accept minimal phase', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Accumulation',
        order: 0,
        weekCount: 4,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.focusAreas).toEqual([]); // default
        expect(result.data.isActive).toBe(false); // default
        expect(result.data.isCompleted).toBe(false); // default
      }
    });

    it('should accept phase with all fields', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Peak',
        order: 2,
        weekCount: 2,
        intensityRange: '85-95%',
        volumeLevel: 'low',
        focusAreas: ['strength', 'peaking'],
        notes: 'Final push before competition',
        startDate: '2025-03-01',
        endDate: '2025-03-14',
        isActive: false,
        isCompleted: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject weekCount of 0', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Test',
        order: 0,
        weekCount: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject weekCount over 52', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Test',
        order: 0,
        weekCount: 53,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Test',
        order: 0,
        weekCount: 4,
        startDate: '2025/03/01', // wrong format
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid volumeLevel', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'Test',
        order: 0,
        weekCount: 4,
        volumeLevel: 'extreme',
      });
      expect(result.success).toBe(false);
    });

    it('should reject name exceeding max length', () => {
      const result = createPhaseArgsSchema.safeParse({
        name: 'A'.repeat(101),
        order: 0,
        weekCount: 4,
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// REQUEST CLARIFICATION ARGS SCHEMA TESTS
// ============================================================================

describe('requestClarificationArgsSchema', () => {
  describe('valid data', () => {
    it('should accept single question', () => {
      const result = requestClarificationArgsSchema.safeParse({
        questions: ['What is your current 1RM for squat?'],
      });
      expect(result.success).toBe(true);
    });

    it('should accept max questions (5)', () => {
      const result = requestClarificationArgsSchema.safeParse({
        questions: [
          'Question 1?',
          'Question 2?',
          'Question 3?',
          'Question 4?',
          'Question 5?',
        ],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject empty questions array', () => {
      const result = requestClarificationArgsSchema.safeParse({
        questions: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 5 questions', () => {
      const result = requestClarificationArgsSchema.safeParse({
        questions: Array(6).fill('Question?'),
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty string in questions', () => {
      const result = requestClarificationArgsSchema.safeParse({
        questions: ['Valid question?', ''],
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// GENERATE STRATEGY ARGS SCHEMA TESTS
// ============================================================================

describe('generateStrategyArgsSchema', () => {
  const validGoal = {
    goalMetric: 'squat_1rm',
    goalTarget: 315,
  };

  describe('valid data', () => {
    it('should accept minimal valid strategy', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: '12-Week Strength Block',
        type: 'block_periodization',
        goal: 'Increase squat 1RM by 20lbs',
        startDate: '2025-01-01',
        goals: [validGoal],
        reasoning: 'Client is intermediate level, block periodization fits best.',
      });
      expect(result.success).toBe(true);
    });

    it('should accept strategy with phases', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Competition Prep',
        type: 'block_periodization',
        goal: 'Peak for powerlifting meet',
        description: 'Comprehensive prep for March meet',
        startDate: '2025-01-01',
        endDate: '2025-03-15',
        goals: [validGoal],
        phases: [
          { name: 'Accumulation', order: 0, weekCount: 4 },
          { name: 'Intensification', order: 1, weekCount: 4 },
          { name: 'Peak', order: 2, weekCount: 2 },
        ],
        reasoning: 'Standard competition prep periodization.',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject empty goals array', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type: 'linear_progression',
        goal: 'Test goal',
        startDate: '2025-01-01',
        goals: [],
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid strategy type', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type: 'invalid_type',
        goal: 'Test goal',
        startDate: '2025-01-01',
        goals: [validGoal],
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty reasoning', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type: 'linear_progression',
        goal: 'Test goal',
        startDate: '2025-01-01',
        goals: [validGoal],
        reasoning: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid startDate format', () => {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type: 'linear_progression',
        goal: 'Test goal',
        startDate: 'January 1, 2025',
        goals: [validGoal],
        reasoning: 'Test',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// SEARCH EXERCISE LIBRARY ARGS SCHEMA TESTS
// ============================================================================

describe('searchExerciseLibraryArgsSchema', () => {
  describe('valid data', () => {
    it('should accept empty search (defaults)', () => {
      const result = searchExerciseLibraryArgsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10); // default
      }
    });

    it('should accept all search parameters', () => {
      const result = searchExerciseLibraryArgsSchema.safeParse({
        searchTerm: 'squat',
        movementPattern: 'squat',
        muscleGroup: 'quadriceps',
        equipment: 'barbell',
        difficulty: 'intermediate',
        limit: 20,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject limit exceeding max (50)', () => {
      const result = searchExerciseLibraryArgsSchema.safeParse({
        limit: 100,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive limit', () => {
      const result = searchExerciseLibraryArgsSchema.safeParse({
        limit: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// BATCH SEARCH EXERCISES ARGS SCHEMA TESTS
// ============================================================================

describe('batchSearchExercisesArgsSchema', () => {
  describe('valid data', () => {
    it('should accept single search', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [{ label: 'push', searchTerm: 'bench press' }],
      });
      expect(result.success).toBe(true);
    });

    it('should accept max searches (10)', () => {
      const searches = Array.from({ length: 10 }, (_, i) => ({
        label: `search_${i}`,
        searchTerm: `term_${i}`,
      }));
      const result = batchSearchExercisesArgsSchema.safeParse({ searches });
      expect(result.success).toBe(true);
    });

    it('should apply default limit', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [{ label: 'test', searchTerm: 'squat' }],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.searches[0].limit).toBe(5); // default
      }
    });
  });

  describe('invalid data', () => {
    it('should reject empty searches array', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 10 searches', () => {
      const searches = Array.from({ length: 11 }, (_, i) => ({
        label: `search_${i}`,
        searchTerm: `term_${i}`,
      }));
      const result = batchSearchExercisesArgsSchema.safeParse({ searches });
      expect(result.success).toBe(false);
    });

    it('should reject empty label', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [{ label: '', searchTerm: 'squat' }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty searchTerm', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [{ label: 'test', searchTerm: '' }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject limit exceeding max (20)', () => {
      const result = batchSearchExercisesArgsSchema.safeParse({
        searches: [{ label: 'test', searchTerm: 'squat', limit: 25 }],
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// CREATE EXERCISE ARGS SCHEMA TESTS
// ============================================================================

describe('createExerciseArgsSchema', () => {
  describe('valid data', () => {
    it('should accept minimal valid exercise', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: 'Bulgarian Split Squat',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.equipment).toEqual([]); // default
        expect(result.data.cues).toEqual([]); // default
      }
    });

    it('should accept exercise with all fields', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: 'Barbell Back Squat',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        primaryMuscle: 'quadriceps',
        equipment: ['barbell', 'squat rack'],
        movementPattern: 'squat',
        difficulty: 'intermediate',
        instructions: 'Descend until thighs are parallel to floor.',
        cues: ['Chest up', 'Knees out', 'Brace core'],
        defaultSets: 4,
        defaultReps: '5-8',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject empty name', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: '',
        category: 'compound',
        muscleGroups: ['chest'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject name exceeding max (200)', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: 'A'.repeat(201),
        category: 'compound',
        muscleGroups: ['chest'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty muscleGroups array', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: 'Test Exercise',
        category: 'compound',
        muscleGroups: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive defaultSets', () => {
      const result = createExerciseArgsSchema.safeParse({
        name: 'Test',
        category: 'isolation',
        muscleGroups: ['biceps'],
        defaultSets: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// STRATEGY GENERATION REQUEST SCHEMA TESTS
// ============================================================================

describe('strategyGenerationRequestSchema', () => {
  /** Valid user ID in HH-XXXXXX barcode format */
  const validUserId = 'HH-ABC234';
  /** Valid UUID for requestId (which is still UUID) */
  const validUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  describe('valid data', () => {
    it('should accept minimal valid request', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: validUserId,
        customPrompt: 'Create a strength program for powerlifting.',
      });
      expect(result.success).toBe(true);
    });

    it('should accept request with clarification answers', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: validUserId,
        customPrompt: 'Build a hypertrophy program.',
        requestId: validUuid, // requestId is still UUID
        clarificationAnswers: ['My current squat 1RM is 315lbs', 'I train 4 days per week'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject invalid userId (not barcode format)', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: 'not-a-barcode',
        customPrompt: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty customPrompt', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: validUserId,
        customPrompt: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject customPrompt exceeding max (2000)', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: validUserId,
        customPrompt: 'A'.repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid requestId (not UUID)', () => {
      const result = strategyGenerationRequestSchema.safeParse({
        userId: validUserId,
        customPrompt: 'Test',
        requestId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// ERROR MESSAGE FORMAT TESTS
// ============================================================================

describe('Error Message Format', () => {
  it('should provide clear error messages for validation failures', () => {
    const result = generatedExerciseSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error as ZodError;
      expect(error.issues.length).toBeGreaterThan(0);
      expect(error.issues[0].path).toContain('name');
    }
  });

  it('should provide path to nested validation errors', () => {
    const result = generateWorkoutPlanArgsSchema.safeParse({
      days: [
        {
          dayOfWeek: 1,
          name: '',  // invalid
          isRestDay: false,
          sections: [],
        },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error as ZodError;
      // Path should include days[0].name
      expect(error.issues[0].path).toEqual(['days', 0, 'name']);
    }
  });
});

// ============================================================================
// P0 FIXES: AI HALLUCINATION PREVENTION TESTS
// ============================================================================

describe('P0 Fixes: AI Hallucination Prevention', () => {
  describe('generatedExerciseSchema - exerciseId validation', () => {
    it('rejects exercises without exerciseId', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Barbell Back Squat',
        sets: 3,
        reps: '8-10',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('exerciseId'))).toBe(true);
      }
    });

    it('rejects exercises with non-UUID exerciseId', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Barbell Back Squat',
        exerciseId: 'not-a-valid-uuid',
        sets: 3,
        reps: '8-10',
      });
      expect(result.success).toBe(false);
    });

    it('accepts exercises with valid UUID exerciseId', () => {
      const result = generatedExerciseSchema.safeParse({
        name: 'Barbell Back Squat',
        exerciseId: '550e8400-e29b-41d4-a716-446655440000',
        sets: 3,
        reps: '8-10',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('createStrategyGoalArgsSchema - goalMetric validation', () => {
    it('rejects invalid goalMetric keys', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'invented_metric_by_ai',
        goalTarget: 100,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('goalMetric'))).toBe(true);
      }
    });

    it('rejects camelCase variants (must use canonical snake_case)', () => {
      const result = createStrategyGoalArgsSchema.safeParse({
        goalMetric: 'bodyFatPercent', // Should be body_fat_percent
        goalTarget: 15,
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid canonical goalMetric keys', () => {
      const validMetrics = ['weight', 'body_fat_percent', 'squat_1rm', 'hba1c'];
      
      for (const metric of validMetrics) {
        const result = createStrategyGoalArgsSchema.safeParse({
          goalMetric: metric,
          goalTarget: 100,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('GoalMetricKeySchema - direct validation', () => {
    it('rejects arbitrary strings', () => {
      const result = GoalMetricKeySchema.safeParse('random_metric');
      expect(result.success).toBe(false);
    });

    it('rejects camelCase versions of valid keys', () => {
      const result = GoalMetricKeySchema.safeParse('bodyFatPercent');
      expect(result.success).toBe(false);
    });

    it('accepts all canonical keys from GOAL_METRIC_KEYS', () => {
      const canonicalKeys = [
        'weight',
        'body_fat_percent',
        'lean_mass',
        'resting_hr',
        'blood_pressure_systolic',
        'blood_pressure_diastolic',
        'vo2_max',
        'hba1c',
        'fasting_glucose',
        'total_cholesterol',
        'ldl_cholesterol',
        'hdl_cholesterol',
        'triglycerides',
        'vitamin_d',
        'testosterone_total',
        'grip_strength',
        'squat_1rm',
        'bench_1rm',
        'deadlift_1rm',
        'overhead_press_1rm',
        'pull_up_max',
        'mile_time',
      ];

      for (const key of canonicalKeys) {
        const result = GoalMetricKeySchema.safeParse(key);
        expect(result.success).toBe(true);
      }
    });

    it('provides helpful error message on invalid key', () => {
      const result = GoalMetricKeySchema.safeParse('invalid_key');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('goalMetric must be one of');
      }
    });
  });
});

// ============================================================================
// UNRESOLVED EXERCISE SCHEMA TESTS
// ============================================================================

describe('unresolvedExerciseSchema', () => {
  describe('valid data', () => {
    it('should accept valid unresolved exercise with missing_id reason', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: 1,
        dayName: 'Monday - Push',
        sectionIndex: 0,
        sectionTitle: 'Warmup',
        exerciseIndex: 2,
        exerciseName: 'Arm Circles',
        reason: 'missing_id',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid unresolved exercise with invalid_id reason', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: 0,
        dayName: 'Sunday - Recovery',
        sectionIndex: 1,
        sectionTitle: 'Mobility',
        exerciseIndex: 0,
        exerciseName: 'Unknown Movement',
        reason: 'invalid_id',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('should reject missing required fields', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: 1,
        // missing other fields
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid reason', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: 1,
        dayName: 'Monday',
        sectionIndex: 0,
        sectionTitle: 'Warmup',
        exerciseIndex: 0,
        exerciseName: 'Push-ups',
        reason: 'invalid_reason',
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative dayOfWeek', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: -1,
        dayName: 'Monday',
        sectionIndex: 0,
        sectionTitle: 'Warmup',
        exerciseIndex: 0,
        exerciseName: 'Push-ups',
        reason: 'missing_id',
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative sectionIndex', () => {
      const result = unresolvedExerciseSchema.safeParse({
        dayOfWeek: 1,
        dayName: 'Monday',
        sectionIndex: -1,
        sectionTitle: 'Warmup',
        exerciseIndex: 0,
        exerciseName: 'Push-ups',
        reason: 'missing_id',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// WORKOUT PLAN GENERATION RESULT SCHEMA TESTS
// ============================================================================

describe('workoutPlanGenerationResultSchema', () => {
  /** Valid UUID for exerciseId */
  const validExerciseUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  
  /** Sample valid generated workout plan */
  const validPlan = {
    days: [
      {
        dayOfWeek: 1,
        name: 'Monday - Push',
        isRestDay: false,
        sections: [
          {
            type: 'working',
            title: 'Main Work',
            exercises: [
              { name: 'Bench Press', sets: 4, reps: '8-10', exerciseId: validExerciseUuid },
            ],
          },
        ],
      },
    ],
  };

  describe('successful generation (no review needed)', () => {
    it('should accept result without needsReview field', () => {
      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.needsReview).toBeUndefined();
        expect(result.data.reviewReasons).toBeUndefined();
      }
    });

    it('should accept result with needsReview=false', () => {
      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
        needsReview: false,
      });
      expect(result.success).toBe(true);
    });

    it('should accept result with reasoning', () => {
      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
        reasoning: 'Created a push-focused workout based on strength goals.',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reasoning).toBe('Created a push-focused workout based on strength goals.');
      }
    });
  });

  describe('generation requiring review', () => {
    it('should accept result with needsReview=true and reviewReasons', () => {
      const unresolvedExercises = [
        {
          dayOfWeek: 1,
          dayName: 'Monday - Push',
          sectionIndex: 0,
          sectionTitle: 'Warmup',
          exerciseIndex: 0,
          exerciseName: 'Arm Circles',
          reason: 'missing_id' as const,
        },
      ];

      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
        needsReview: true,
        reviewReasons: unresolvedExercises,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.needsReview).toBe(true);
        expect(result.data.reviewReasons).toHaveLength(1);
        expect(result.data.reviewReasons?.[0].exerciseName).toBe('Arm Circles');
      }
    });

    it('should accept result with multiple unresolved exercises', () => {
      const unresolvedExercises = [
        {
          dayOfWeek: 1,
          dayName: 'Monday - Push',
          sectionIndex: 0,
          sectionTitle: 'Warmup',
          exerciseIndex: 0,
          exerciseName: 'Arm Circles',
          reason: 'missing_id' as const,
        },
        {
          dayOfWeek: 2,
          dayName: 'Tuesday - Pull',
          sectionIndex: 1,
          sectionTitle: 'Cooldown',
          exerciseIndex: 1,
          exerciseName: 'Foam Rolling',
          reason: 'invalid_id' as const,
        },
      ];

      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
        needsReview: true,
        reviewReasons: unresolvedExercises,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reviewReasons).toHaveLength(2);
      }
    });
  });

  describe('invalid data', () => {
    it('should reject missing plan', () => {
      const result = workoutPlanGenerationResultSchema.safeParse({
        newNotes: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid reviewReasons structure', () => {
      const result = workoutPlanGenerationResultSchema.safeParse({
        plan: validPlan,
        newNotes: [],
        needsReview: true,
        reviewReasons: [{ invalid: 'structure' }],
      });
      expect(result.success).toBe(false);
    });
  });
});

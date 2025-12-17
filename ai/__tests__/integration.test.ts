/**
 * @ai-context AI Shared Contracts Integration Tests | Validates server imports and uses shared schemas
 *
 * This test suite verifies:
 * 1. Server AI services properly import and use shared schemas
 * 2. Validation of inputs using the shared schemas works correctly
 * 3. Error handling for invalid AI inputs
 * 4. Contract sync between shared contracts and server usage
 *
 * NOTE: These tests are pure schema tests - no database setup required.
 * Run: npm run test:contracts (from root)
 */

import {
    AI_NOTE_CATEGORIES,
    AI_NOTE_CATEGORIES_FOR_VALIDATION,
    AI_NOTE_CATEGORY,
    batchSearchExercisesArgsSchema,
    buildClarificationAnswerPrompt,
    buildNutritionUserPrompt,
    buildStrategyUserPrompt,
    buildWorkoutUserPrompt,
    createExerciseArgsSchema,
    generatedDaySchema,
    generatedExerciseSchema,
    generatedSectionSchema,
    generateNutritionTargetsArgsSchema,
    generateStrategyArgsSchema,
    generateWorkoutPlanArgsSchema,
    NUTRITION_SYSTEM_PROMPT,
    requestClarificationArgsSchema,
    savePermanentNoteArgsSchema,
    searchExerciseLibraryArgsSchema,
    STRATEGY_SYSTEM_PROMPT,
    WORKOUT_SECTION_TYPES,
    WORKOUT_SYSTEM_PROMPT,
    type GeneratedExercise,
    type GeneratedWorkoutDay,
    type GeneratedWorkoutPlan,
    type GeneratedWorkoutSection,
    type WorkoutSectionType,
} from '@hollis/contracts';

// ============================================================================
// IMPORT VERIFICATION TESTS
// ============================================================================

describe('Shared AI Contracts Import Verification', () => {
  describe('Type Exports', () => {
    it('should export GeneratedExercise type', () => {
      const exercise: GeneratedExercise = {
        name: 'Squat',
        sets: 4,
        reps: '8-10',
      };
      expect(exercise.name).toBe('Squat');
    });

    it('should export GeneratedWorkoutSection type', () => {
      const section: GeneratedWorkoutSection = {
        type: 'working',
        title: 'Main Work',
        exercises: [{ name: 'Bench Press' }],
      };
      expect(section.type).toBe('working');
    });

    it('should export GeneratedWorkoutDay type', () => {
      const day: GeneratedWorkoutDay = {
        dayOfWeek: 1,
        name: 'Push Day',
        isRestDay: false,
        sections: [],
      };
      expect(day.dayOfWeek).toBe(1);
    });

    it('should export GeneratedWorkoutPlan type', () => {
      const plan: GeneratedWorkoutPlan = {
        days: [{
          dayOfWeek: 0,
          name: 'Rest',
          isRestDay: true,
          sections: [],
        }],
      };
      expect(plan.days.length).toBe(1);
    });

    it('should export WorkoutSectionType type', () => {
      const sectionType: WorkoutSectionType = 'warmup';
      expect(WORKOUT_SECTION_TYPES).toContain(sectionType);
    });
  });

  describe('Constant Exports', () => {
    it('should export WORKOUT_SECTION_TYPES', () => {
      expect(WORKOUT_SECTION_TYPES).toBeDefined();
      expect(WORKOUT_SECTION_TYPES).toContain('warmup');
      expect(WORKOUT_SECTION_TYPES).toContain('working');
      expect(WORKOUT_SECTION_TYPES).toContain('cooldown');
    });

    it('should export AI_NOTE_CATEGORIES', () => {
      expect(AI_NOTE_CATEGORIES).toBeDefined();
      expect(AI_NOTE_CATEGORIES).toContain('INJURY');
      expect(AI_NOTE_CATEGORIES).toContain('PREFERENCE');
      expect(AI_NOTE_CATEGORIES).toContain('LIMITATION');
      expect(AI_NOTE_CATEGORIES).toContain('MEDICAL');
      expect(AI_NOTE_CATEGORIES).toContain('GOAL');
      expect(AI_NOTE_CATEGORIES).toContain('OTHER');
    });

    it('should export AI_NOTE_CATEGORY constants', () => {
      expect(AI_NOTE_CATEGORY).toBeDefined();
      expect(AI_NOTE_CATEGORY.INJURY).toBe('INJURY');
      expect(AI_NOTE_CATEGORY.PREFERENCE).toBe('PREFERENCE');
      expect(AI_NOTE_CATEGORY.LIMITATION).toBe('LIMITATION');
      expect(AI_NOTE_CATEGORY.MEDICAL).toBe('MEDICAL');
    });

    it('should have matching values between AI_NOTE_CATEGORIES and AI_NOTE_CATEGORIES_FOR_VALIDATION', () => {
      // These should contain the same values
      expect([...AI_NOTE_CATEGORIES].sort()).toEqual([...AI_NOTE_CATEGORIES_FOR_VALIDATION].sort());
    });
  });

  describe('Schema Exports', () => {
    it('should export generatedExerciseSchema', () => {
      expect(generatedExerciseSchema).toBeDefined();
      expect(generatedExerciseSchema.safeParse).toBeDefined();
    });

    it('should export generatedSectionSchema', () => {
      expect(generatedSectionSchema).toBeDefined();
    });

    it('should export generatedDaySchema', () => {
      expect(generatedDaySchema).toBeDefined();
    });

    it('should export generateWorkoutPlanArgsSchema', () => {
      expect(generateWorkoutPlanArgsSchema).toBeDefined();
    });

    it('should export savePermanentNoteArgsSchema', () => {
      expect(savePermanentNoteArgsSchema).toBeDefined();
    });

    it('should export generateNutritionTargetsArgsSchema', () => {
      expect(generateNutritionTargetsArgsSchema).toBeDefined();
    });

    it('should export generateStrategyArgsSchema', () => {
      expect(generateStrategyArgsSchema).toBeDefined();
    });

    it('should export requestClarificationArgsSchema', () => {
      expect(requestClarificationArgsSchema).toBeDefined();
    });

    it('should export searchExerciseLibraryArgsSchema', () => {
      expect(searchExerciseLibraryArgsSchema).toBeDefined();
    });

    it('should export batchSearchExercisesArgsSchema', () => {
      expect(batchSearchExercisesArgsSchema).toBeDefined();
    });

    it('should export createExerciseArgsSchema', () => {
      expect(createExerciseArgsSchema).toBeDefined();
    });
  });

  describe('Prompt Template Exports', () => {
    it('should export WORKOUT_SYSTEM_PROMPT', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toBeDefined();
      expect(typeof WORKOUT_SYSTEM_PROMPT).toBe('string');
      expect(WORKOUT_SYSTEM_PROMPT.length).toBeGreaterThan(0);
    });

    it('should export NUTRITION_SYSTEM_PROMPT', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toBeDefined();
      expect(typeof NUTRITION_SYSTEM_PROMPT).toBe('string');
      expect(NUTRITION_SYSTEM_PROMPT.length).toBeGreaterThan(0);
    });

    it('should export STRATEGY_SYSTEM_PROMPT', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toBeDefined();
      expect(typeof STRATEGY_SYSTEM_PROMPT).toBe('string');
      expect(STRATEGY_SYSTEM_PROMPT.length).toBeGreaterThan(0);
    });

    it('should export prompt builder functions', () => {
      expect(buildWorkoutUserPrompt).toBeDefined();
      expect(typeof buildWorkoutUserPrompt).toBe('function');

      expect(buildNutritionUserPrompt).toBeDefined();
      expect(typeof buildNutritionUserPrompt).toBe('function');

      expect(buildStrategyUserPrompt).toBeDefined();
      expect(typeof buildStrategyUserPrompt).toBe('function');

      expect(buildClarificationAnswerPrompt).toBeDefined();
      expect(typeof buildClarificationAnswerPrompt).toBe('function');
    });
  });
});

// ============================================================================
// SCHEMA VALIDATION INTEGRATION TESTS
// ============================================================================

describe('Schema Validation Integration', () => {
  describe('Workout Plan Validation', () => {
    it('should validate a complete workout plan from AI response', () => {
      const aiResponse = {
        days: [
          {
            dayOfWeek: 1,
            name: 'Push Day',
            isRestDay: false,
            sections: [
              {
                type: 'warmup' as const,
                title: 'Dynamic Warmup',
                exercises: [
                  { name: 'Arm Circles', duration: '30 seconds' },
                  { name: 'Band Pull-aparts', sets: 2, reps: '15' },
                ],
              },
              {
                type: 'working' as const,
                title: 'Main Work',
                exercises: [
                  {
                    name: 'Bench Press',
                    exerciseId: 'abc-123',
                    sets: 4,
                    reps: '8-10',
                    weight: '185lbs',
                    notes: 'Control tempo',
                  },
                  {
                    name: 'Overhead Press',
                    exerciseId: 'def-456',
                    sets: 3,
                    reps: '10',
                    weight: '95lbs',
                  },
                ],
              },
              {
                type: 'cooldown' as const,
                title: 'Stretching',
                exercises: [
                  { name: 'Chest Stretch', duration: '30 seconds' },
                ],
              },
            ],
          },
          {
            dayOfWeek: 2,
            name: 'Rest Day',
            isRestDay: true,
            sections: [],
          },
        ],
        reasoning: 'Client has shoulder impingement, focusing on controlled movements.',
      };

      const result = generateWorkoutPlanArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });

    it('should reject invalid AI response with helpful errors', () => {
      const invalidResponse = {
        days: [
          {
            dayOfWeek: 10, // invalid
            name: '', // invalid
            isRestDay: 'yes', // wrong type
            sections: [],
          },
        ],
      };

      const result = generateWorkoutPlanArgsSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Nutrition Targets Validation', () => {
    it('should validate nutrition targets from AI response', () => {
      const aiResponse = {
        calories: 2500,
        protein: 180,
        carbs: 300,
        fat: 80,
        reasoning: 'Based on moderate activity level and muscle gain goals. Protein set at 1g/lb bodyweight.',
      };

      const result = generateNutritionTargetsArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });

    it('should enforce reasonable limits', () => {
      const unreasonableResponse = {
        calories: 20000, // too high
        protein: 180,
        carbs: 300,
        fat: 80,
        reasoning: 'Test',
      };

      const result = generateNutritionTargetsArgsSchema.safeParse(unreasonableResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('Training Strategy Validation', () => {
    it('should validate strategy from AI response', () => {
      const aiResponse = {
        name: '12-Week Powerlifting Block',
        type: 'block_periodization',
        goal: 'Increase SBD total by 50lbs',
        description: 'Comprehensive prep for summer meet',
        startDate: '2025-01-06',
        endDate: '2025-03-30',
        goals: [
          { goalMetric: 'squat_1rm', goalTarget: 405, weight: 1.5 },
          { goalMetric: 'bench_press_1rm', goalTarget: 285, weight: 1.0 },
          { goalMetric: 'deadlift_1rm', goalTarget: 500, weight: 1.5 },
        ],
        phases: [
          { name: 'Accumulation', order: 0, weekCount: 4, volumeLevel: 'high' },
          { name: 'Intensification', order: 1, weekCount: 4, volumeLevel: 'moderate' },
          { name: 'Peak', order: 2, weekCount: 3, volumeLevel: 'low' },
          { name: 'Deload', order: 3, weekCount: 1, volumeLevel: 'low' },
        ],
        reasoning: 'Client is intermediate level with competition experience. Block periodization aligns with their 3-month timeline.',
      };

      const result = generateStrategyArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('Clarification Request Validation', () => {
    it('should validate clarification questions', () => {
      const aiResponse = {
        questions: [
          'What is your current squat 1RM?',
          'Has your knee injury been cleared by a medical professional?',
          'How many days per week can you train?',
        ],
      };

      const result = requestClarificationArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('Permanent Note Validation', () => {
    it('should validate all note categories', () => {
      for (const category of AI_NOTE_CATEGORIES) {
        const result = savePermanentNoteArgsSchema.safeParse({
          content: `Test note for ${category}`,
          category,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Exercise Search Validation', () => {
    it('should validate batch search request', () => {
      const aiResponse = {
        searches: [
          { label: 'squat_variations', searchTerm: 'barbell squat', limit: 5 },
          { label: 'pressing', searchTerm: 'bench press', limit: 5 },
          { label: 'pulling', searchTerm: 'row', limit: 5 },
        ],
      };

      const result = batchSearchExercisesArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });

    it('should validate create exercise request', () => {
      const aiResponse = {
        name: 'Zercher Squat',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes', 'core'],
        primaryMuscle: 'quadriceps',
        equipment: ['barbell'],
        movementPattern: 'squat',
        difficulty: 'advanced',
        instructions: 'Hold barbell in the crook of your elbows and squat.',
        cues: ['Keep elbows high', 'Brace core', 'Chest up'],
        defaultSets: 3,
        defaultReps: '6-8',
      };

      const result = createExerciseArgsSchema.safeParse(aiResponse);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// PROMPT BUILDER INTEGRATION TESTS
// ============================================================================

describe('Prompt Builder Integration', () => {
  const mockContext = `## Client Profile
Name: Test User
Age: 30
Primary Goal: Build Muscle

## Recent Training History
- Completed 12 workouts in past 4 weeks
- Compliance: 85%

## Active Strategy
12-Week Hypertrophy Block (Week 4)

## Permanent Notes
- INJURY: Previous shoulder impingement (2024) - cleared for training
- PREFERENCE: Prefers morning workouts`;

  describe('Workout Prompt Generation', () => {
    it('should generate complete workout prompt', () => {
      const prompt = buildWorkoutUserPrompt(
        mockContext,
        '2025-01-06',
        'Focus on chest and back this week'
      );

      expect(prompt).toContain(mockContext);
      expect(prompt).toContain('2025-01-06');
      expect(prompt).toContain('Focus on chest and back');
      expect(prompt).toContain('generate an appropriate workout plan');
    });
  });

  describe('Nutrition Prompt Generation', () => {
    it('should generate complete nutrition prompt', () => {
      const prompt = buildNutritionUserPrompt(
        mockContext,
        '2025-01-06',
        'Client wants to start cutting'
      );

      expect(prompt).toContain(mockContext);
      expect(prompt).toContain('2025-01-06');
      expect(prompt).toContain('Client wants to start cutting');
      expect(prompt).toContain('nutrition targets');
    });
  });

  describe('Strategy Prompt Generation', () => {
    it('should generate complete strategy prompt', () => {
      const prompt = buildStrategyUserPrompt(
        mockContext,
        'Create a 16-week powerlifting program leading to a competition'
      );

      expect(prompt).toContain(mockContext);
      expect(prompt).toContain('16-week powerlifting program');
      expect(prompt).toContain('Strategy Request');
      expect(prompt).toContain('conflicts');
    });
  });

  describe('Clarification Answer Prompt Generation', () => {
    it('should generate continuation prompt with answers', () => {
      const answers = [
        'My current squat 1RM is 315lbs',
        'Yes, my knee has been cleared by my physical therapist',
        'I can train 4 days per week',
      ];

      const prompt = buildClarificationAnswerPrompt(answers);

      expect(prompt).toContain('315lbs');
      expect(prompt).toContain('physical therapist');
      expect(prompt).toContain('4 days per week');
      expect(prompt).toContain('1.');
      expect(prompt).toContain('2.');
      expect(prompt).toContain('3.');
    });
  });
});

// ============================================================================
// CONTRACT SYNC VERIFICATION
// ============================================================================

describe('Contract Sync Verification', () => {
  it('should have consistent AI note categories', () => {
    // Verify the AI_NOTE_CATEGORY constants match the tuple
    const categoryConstants = Object.values(AI_NOTE_CATEGORY);
    const categoryTuple = [...AI_NOTE_CATEGORIES];

    expect(categoryConstants.sort()).toEqual(categoryTuple.sort());
  });

  it('should have consistent workout section types', () => {
    const expectedTypes = ['warmup', 'working', 'cooldown'];
    expect([...WORKOUT_SECTION_TYPES]).toEqual(expectedTypes);
  });

  it('should have strategy types matching validation schema', () => {
    // Test that all expected strategy types are valid
    const strategyTypes = [
      'linear_progression',
      'undulating',
      'block_periodization',
      'mesocycle',
      'deload',
      'custom',
    ];

    for (const type of strategyTypes) {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type,
        goal: 'Test',
        startDate: '2025-01-01',
        goals: [{ goalMetric: 'weight', goalTarget: 180 }],
        reasoning: 'Test',
      });
      expect(result.success).toBe(true);
    }
  });

  it('should have volume levels matching phase schema', () => {
    // Test that all expected volume levels are valid
    const volumeLevels = ['low', 'moderate', 'high'];

    for (const volumeLevel of volumeLevels) {
      const result = generateStrategyArgsSchema.safeParse({
        name: 'Test',
        type: 'block_periodization',
        goal: 'Test',
        startDate: '2025-01-01',
        goals: [{ goalMetric: 'weight', goalTarget: 180 }],
        phases: [{ name: 'Test Phase', order: 0, weekCount: 4, volumeLevel }],
        reasoning: 'Test',
      });
      expect(result.success).toBe(true);
    }
  });
});

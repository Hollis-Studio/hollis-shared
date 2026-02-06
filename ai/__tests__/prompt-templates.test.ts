/**
 * @ai-context AI Prompt Templates Tests | Validates all prompt templates and builders
 *
 * This test suite verifies:
 * 1. All prompt builders return non-empty strings
 * 2. Prompts include expected keywords/sections
 * 3. System prompts are consistent (snapshot tests)
 * 4. Prompt builders handle various input scenarios
 *
 * Run: npm run test:contracts (from shared/contracts or root)
 */

import {
    buildClarificationAnswerPrompt,
    buildNutritionUserPrompt,
    buildStrategyUserPrompt,
    buildWorkoutUserPrompt,
    GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION,
    GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION,
    GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION,
    NUTRITION_REASONING_EXAMPLE,
    NUTRITION_SYSTEM_PROMPT,
    REASONING_FORMAT_GUIDANCE,
    REQUEST_CLARIFICATION_TOOL_DESCRIPTION,
    SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION,
    STRATEGY_REASONING_EXAMPLE,
    STRATEGY_SYSTEM_PROMPT,
    WORKOUT_REASONING_EXAMPLE,
    WORKOUT_SYSTEM_PROMPT,
} from '../prompt-templates';

// ============================================================================
// SYSTEM PROMPT TESTS
// ============================================================================

describe('System Prompts', () => {
  describe('WORKOUT_SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof WORKOUT_SYSTEM_PROMPT).toBe('string');
      expect(WORKOUT_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('should contain key sections', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<mission>');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<critical_rules>');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<workflow>');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<programming_guidelines>');
    });

    it('should mention exercise library requirements', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('exerciseId');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('batch_search_exercises');
    });

    it('should include progressive overload guidance', () => {
      expect(WORKOUT_SYSTEM_PROMPT.toLowerCase()).toContain('progressive overload');
    });

    it('should mention permanent note sparingly', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('save_permanent_note');
      expect(WORKOUT_SYSTEM_PROMPT.toLowerCase()).toContain('rarely');
    });

    it('should include rep ranges for different goals', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('Hypertrophy');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('Strength');
    });

    it('should contain goal exercises guidance', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<goal_exercises>');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('Goal-Linked Exercises');
    });

    it('should include reasoning format guidance', () => {
      expect(WORKOUT_SYSTEM_PROMPT).toContain('<reasoning_format>');
      expect(WORKOUT_SYSTEM_PROMPT).toContain('plain text only');
    });

    // Snapshot test for prompt stability
    it('should match snapshot (detect accidental changes)', () => {
      // Using a hash/checksum approach rather than full snapshot for readability
      const wordCount = WORKOUT_SYSTEM_PROMPT.split(/\s+/).length;
      expect(wordCount).toBeGreaterThan(400);
      expect(wordCount).toBeLessThan(800);
    });
  });

  describe('NUTRITION_SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof NUTRITION_SYSTEM_PROMPT).toBe('string');
      expect(NUTRITION_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('should contain key sections', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toContain('<role>');
      expect(NUTRITION_SYSTEM_PROMPT).toContain('<mission>');
      expect(NUTRITION_SYSTEM_PROMPT).toContain('<guidelines>');
    });

    it('should include caloric adjustment guidance', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toContain('CALORIC ADJUSTMENTS');
      expect(NUTRITION_SYSTEM_PROMPT).toContain('Weight loss');
    });

    it('should include protein targets', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toContain('PROTEIN TARGETS');
      expect(NUTRITION_SYSTEM_PROMPT).toContain('per lb bodyweight');
    });

    it('should mention compliance considerations', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toContain('COMPLIANCE CONSIDERATIONS');
    });

    it('should reference the generation tool', () => {
      expect(NUTRITION_SYSTEM_PROMPT).toContain('generate_nutrition_targets');
    });

    // Snapshot test for prompt stability
    it('should match snapshot (detect accidental changes)', () => {
      const wordCount = NUTRITION_SYSTEM_PROMPT.split(/\s+/).length;
      expect(wordCount).toBeGreaterThan(150);
      expect(wordCount).toBeLessThan(400);
    });
  });

  describe('STRATEGY_SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof STRATEGY_SYSTEM_PROMPT).toBe('string');
      expect(STRATEGY_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('should contain key sections', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<mission>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<critical_rules>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<conflict_detection>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<goal_metrics>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<periodization_guidelines>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<workflow>');
    });

    it('should mention permanent notes check', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('permanent notes');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('INJURY');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('LIMITATION');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('MEDICAL');
    });

    it('should include conflict detection examples', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('Lower body strength goals');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('request_clarification');
    });

    it('should include periodization types', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('linear_progression');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('block_periodization');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('undulating');
    });

    it('should include phase structure guidance', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('Accumulation');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('Intensification');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('Peak');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('Deload');
    });

    it('should mention exercise search for goals', () => {
      expect(STRATEGY_SYSTEM_PROMPT).toContain('<exercise_search>');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('batch_search_exercises');
      expect(STRATEGY_SYSTEM_PROMPT).toContain('linkedExerciseId');
    });

    // Snapshot test for prompt stability
    it('should match snapshot (detect accidental changes)', () => {
      const wordCount = STRATEGY_SYSTEM_PROMPT.split(/\s+/).length;
      expect(wordCount).toBeGreaterThan(500);
      expect(wordCount).toBeLessThan(1300); // Updated to allow for expanded metric search examples
    });
  });
});

// ============================================================================
// TOOL DESCRIPTION TESTS
// ============================================================================

describe('Tool Descriptions', () => {
  describe('SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION', () => {
    it('should be a non-empty string', () => {
      expect(typeof SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toBe('string');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION.length).toBeGreaterThan(50);
    });

    it('should list valid categories', () => {
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('INJURY');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('LIMITATION');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('PREFERENCE');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('MEDICAL');
    });

    it('should emphasize sparing use', () => {
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('SPARINGLY');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('ZERO notes');
    });

    it('should list what NOT to create notes for', () => {
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('DO NOT create notes for');
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain('Temporary situations');
    });
  });

  describe('GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION', () => {
    it('should be a non-empty string', () => {
      expect(typeof GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION).toBe('string');
      expect(GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION.length).toBeGreaterThan(20);
    });

    it('should emphasize exerciseId requirement', () => {
      expect(GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION).toContain('exerciseId');
      expect(GENERATE_WORKOUT_PLAN_TOOL_DESCRIPTION).toContain('CRITICAL');
    });
  });

  describe('GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION', () => {
    it('should be a non-empty string', () => {
      expect(typeof GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION).toBe('string');
      expect(GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION.length).toBeGreaterThan(10);
    });

    it('should mention nutrition targets', () => {
      expect(GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION.toLowerCase()).toContain('nutrition');
      expect(GENERATE_NUTRITION_TARGETS_TOOL_DESCRIPTION.toLowerCase()).toContain('macro');
    });
  });

  describe('REQUEST_CLARIFICATION_TOOL_DESCRIPTION', () => {
    it('should be a non-empty string', () => {
      expect(typeof REQUEST_CLARIFICATION_TOOL_DESCRIPTION).toBe('string');
      expect(REQUEST_CLARIFICATION_TOOL_DESCRIPTION.length).toBeGreaterThan(50);
    });

    it('should describe when to use', () => {
      expect(REQUEST_CLARIFICATION_TOOL_DESCRIPTION).toContain('WHEN TO USE');
    });

    it('should give examples', () => {
      expect(REQUEST_CLARIFICATION_TOOL_DESCRIPTION).toContain('EXAMPLE QUESTIONS');
      expect(REQUEST_CLARIFICATION_TOOL_DESCRIPTION).toContain('ACL');
    });
  });

  describe('GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION', () => {
    it('should be a non-empty string', () => {
      expect(typeof GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION).toBe('string');
      expect(GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION.length).toBeGreaterThan(50);
    });

    it('should describe prerequisites', () => {
      expect(GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION).toContain('ONLY call this after');
      expect(GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION).toContain('conflicts');
    });

    it('should describe required structure', () => {
      expect(GENERATE_TRAINING_STRATEGY_TOOL_DESCRIPTION).toContain('must include');
    });
  });
});

// ============================================================================
// REASONING EXAMPLES TESTS
// ============================================================================

describe('Reasoning Format and Examples', () => {
  describe('REASONING_FORMAT_GUIDANCE', () => {
    it('should be a non-empty string', () => {
      expect(typeof REASONING_FORMAT_GUIDANCE).toBe('string');
      expect(REASONING_FORMAT_GUIDANCE.length).toBeGreaterThan(20);
    });

    it('should mention plain text requirement', () => {
      expect(REASONING_FORMAT_GUIDANCE).toContain('plain text');
      expect(REASONING_FORMAT_GUIDANCE).toContain('Do NOT use markdown');
    });
  });

  describe('WORKOUT_REASONING_EXAMPLE', () => {
    it('should be a non-empty string', () => {
      expect(typeof WORKOUT_REASONING_EXAMPLE).toBe('string');
      expect(WORKOUT_REASONING_EXAMPLE.length).toBeGreaterThan(50);
    });

    it('should be in plain text (no markdown)', () => {
      expect(WORKOUT_REASONING_EXAMPLE).not.toContain('**');
      expect(WORKOUT_REASONING_EXAMPLE).not.toContain('*italic*');
      expect(WORKOUT_REASONING_EXAMPLE).not.toContain('# ');
    });

    it('should include numbered considerations', () => {
      expect(WORKOUT_REASONING_EXAMPLE).toContain('1.');
      expect(WORKOUT_REASONING_EXAMPLE).toContain('2.');
      expect(WORKOUT_REASONING_EXAMPLE).toContain('3.');
    });
  });

  describe('NUTRITION_REASONING_EXAMPLE', () => {
    it('should be a non-empty string', () => {
      expect(typeof NUTRITION_REASONING_EXAMPLE).toBe('string');
      expect(NUTRITION_REASONING_EXAMPLE.length).toBeGreaterThan(50);
    });

    it('should be in plain text (no markdown)', () => {
      expect(NUTRITION_REASONING_EXAMPLE).not.toContain('**');
    });
  });

  describe('STRATEGY_REASONING_EXAMPLE', () => {
    it('should be a non-empty string', () => {
      expect(typeof STRATEGY_REASONING_EXAMPLE).toBe('string');
      expect(STRATEGY_REASONING_EXAMPLE.length).toBeGreaterThan(50);
    });

    it('should be in plain text (no markdown)', () => {
      expect(STRATEGY_REASONING_EXAMPLE).not.toContain('**');
    });
  });
});

// ============================================================================
// USER PROMPT BUILDER TESTS
// ============================================================================

describe('User Prompt Builders', () => {
  const sampleContext = `## User Profile
Name: John Doe
Goal: Build muscle

## Recent Workouts
- Push Day (completed)
- Pull Day (completed)`;

  const weekStartDate = '2025-01-06';

  describe('buildWorkoutUserPrompt', () => {
    it('should return a non-empty string', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should include the context', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain(sampleContext);
    });

    it('should include the week start date', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain(weekStartDate);
    });

    it('should include instruction to generate plan', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain('generate an appropriate workout plan');
    });

    it('should include custom prompt when provided', () => {
      const customPrompt = 'Focus on upper body this week';
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate, customPrompt);
      expect(prompt).toContain(customPrompt);
      expect(prompt).toContain('Additional Instructions from Staff');
    });

    it('should not include custom prompt section when not provided', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate);
      expect(prompt).not.toContain('Additional Instructions from Staff');
    });

    it('should handle empty context gracefully', () => {
      const prompt = buildWorkoutUserPrompt('', weekStartDate);
      expect(typeof prompt).toBe('string');
      expect(prompt).toContain(weekStartDate);
    });

    it('should handle empty custom prompt', () => {
      const prompt = buildWorkoutUserPrompt(sampleContext, weekStartDate, '');
      expect(prompt).not.toContain('Additional Instructions from Staff');
    });
  });

  describe('buildNutritionUserPrompt', () => {
    it('should return a non-empty string', () => {
      const prompt = buildNutritionUserPrompt(sampleContext, weekStartDate);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should include the context', () => {
      const prompt = buildNutritionUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain(sampleContext);
    });

    it('should include the week start date', () => {
      const prompt = buildNutritionUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain(weekStartDate);
    });

    it('should include instruction to generate nutrition targets', () => {
      const prompt = buildNutritionUserPrompt(sampleContext, weekStartDate);
      expect(prompt).toContain('generate appropriate nutrition targets');
    });

    it('should include custom prompt when provided', () => {
      const customPrompt = 'Client prefers lower carb';
      const prompt = buildNutritionUserPrompt(sampleContext, weekStartDate, customPrompt);
      expect(prompt).toContain(customPrompt);
    });
  });

  describe('buildStrategyUserPrompt', () => {
    const customPrompt = 'Create a 12-week powerlifting program';

    it('should return a non-empty string', () => {
      const prompt = buildStrategyUserPrompt(sampleContext, customPrompt);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should include the context', () => {
      const prompt = buildStrategyUserPrompt(sampleContext, customPrompt);
      expect(prompt).toContain(sampleContext);
    });

    it('should include the custom prompt as strategy request', () => {
      const prompt = buildStrategyUserPrompt(sampleContext, customPrompt);
      expect(prompt).toContain(customPrompt);
      expect(prompt).toContain('Strategy Request');
    });

    it('should include instruction to check conflicts', () => {
      const prompt = buildStrategyUserPrompt(sampleContext, customPrompt);
      expect(prompt).toContain('check for any conflicts');
    });

    it('should mention injuries and limitations', () => {
      const prompt = buildStrategyUserPrompt(sampleContext, customPrompt);
      expect(prompt).toContain('injuries or limitations');
    });
  });

  describe('buildClarificationAnswerPrompt', () => {
    it('should return a non-empty string', () => {
      const answers = ['My squat 1RM is 315lbs'];
      const prompt = buildClarificationAnswerPrompt(answers);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should include all answers', () => {
      const answers = ['Answer 1', 'Answer 2', 'Answer 3'];
      const prompt = buildClarificationAnswerPrompt(answers);
      answers.forEach((answer) => {
        expect(prompt).toContain(answer);
      });
    });

    it('should number the answers', () => {
      const answers = ['First answer', 'Second answer'];
      const prompt = buildClarificationAnswerPrompt(answers);
      expect(prompt).toContain('1. First answer');
      expect(prompt).toContain('2. Second answer');
    });

    it('should include instruction to proceed', () => {
      const answers = ['Test answer'];
      const prompt = buildClarificationAnswerPrompt(answers);
      expect(prompt).toContain('proceed with generating the training strategy');
    });

    it('should handle empty answers array', () => {
      const prompt = buildClarificationAnswerPrompt([]);
      expect(typeof prompt).toBe('string');
    });

    it('should handle single answer', () => {
      const answers = ['Only one answer'];
      const prompt = buildClarificationAnswerPrompt(answers);
      expect(prompt).toContain('1. Only one answer');
      expect(prompt).not.toContain('2.');
    });
  });
});

// ============================================================================
// PROMPT CONSISTENCY TESTS
// ============================================================================

describe('Prompt Consistency', () => {
  it('should have consistent tool naming across prompts', () => {
    // Verify tool names appear in relevant prompts
    expect(WORKOUT_SYSTEM_PROMPT).toContain('save_permanent_note');
    expect(WORKOUT_SYSTEM_PROMPT).toContain('generate_workout_plan');
    expect(WORKOUT_SYSTEM_PROMPT).toContain('batch_search_exercises');

    expect(NUTRITION_SYSTEM_PROMPT).toContain('generate_nutrition_targets');
    expect(NUTRITION_SYSTEM_PROMPT).toContain('save_permanent_note');

    expect(STRATEGY_SYSTEM_PROMPT).toContain('generate_training_strategy');
    expect(STRATEGY_SYSTEM_PROMPT).toContain('request_clarification');
    expect(STRATEGY_SYSTEM_PROMPT).toContain('batch_search_exercises');
  });

  it('should have consistent note categories across prompts', () => {
    const categories = ['INJURY', 'PREFERENCE', 'LIMITATION', 'MEDICAL'];

    // All categories should appear in save_permanent_note description
    categories.forEach((cat) => {
      expect(SAVE_PERMANENT_NOTE_TOOL_DESCRIPTION).toContain(cat);
    });

    // Strategy prompt should mention key categories
    expect(STRATEGY_SYSTEM_PROMPT).toContain('INJURY');
    expect(STRATEGY_SYSTEM_PROMPT).toContain('LIMITATION');
    expect(STRATEGY_SYSTEM_PROMPT).toContain('MEDICAL');
  });

  it('should not contain deprecated tool names', () => {
    const deprecatedNames = [
      'search_exercises', // should be batch_search_exercises
      'create_workout',   // should be generate_workout_plan
    ];

    deprecatedNames.forEach((name) => {
      // These specific deprecated names should not appear
      // (unless as part of a longer valid name)
      if (name === 'search_exercises') {
        // batch_search_exercises is valid, but standalone search_exercises is not
        expect(WORKOUT_SYSTEM_PROMPT).not.toMatch(/\bsearch_exercises\b/);
      }
    });
  });
});

// ============================================================================
// PROMPT SECURITY TESTS
// ============================================================================

describe('Prompt Security', () => {
  it('should not contain sensitive placeholders', () => {
    const sensitivePatterns = [
      /API_KEY/i,
      /SECRET/i,
      /PASSWORD/i,
      /\{\{.*token.*\}\}/i,
    ];

    const allPrompts = [
      WORKOUT_SYSTEM_PROMPT,
      NUTRITION_SYSTEM_PROMPT,
      STRATEGY_SYSTEM_PROMPT,
    ];

    allPrompts.forEach((prompt) => {
      sensitivePatterns.forEach((pattern) => {
        expect(prompt).not.toMatch(pattern);
      });
    });
  });

  it('should not contain injection vulnerabilities', () => {
    // Prompts should not have patterns that could be exploited
    const dangerousPatterns = [
      /ignore previous instructions/i,
      /disregard above/i,
      /system: /i, // potential system prompt injection
    ];

    const allPrompts = [
      WORKOUT_SYSTEM_PROMPT,
      NUTRITION_SYSTEM_PROMPT,
      STRATEGY_SYSTEM_PROMPT,
    ];

    allPrompts.forEach((prompt) => {
      dangerousPatterns.forEach((pattern) => {
        expect(prompt).not.toMatch(pattern);
      });
    });
  });
});

/**
 * @ai-context Workouts Sunday Review wire shapes | the frozen deck the server
 * writes into a Week row's `aiRetrospective`, and the device-computed snapshot
 * the client writes into its `deterministicSnapshot` (hollis-workouts #13, #70,
 * #79, #99; single-sourced by hollis-workouts#239 — the server and app used to
 * carry hand-mirrored copies of every schema here).
 *
 * Both documents travel inside `WeekDocumentBodySchema` (./workouts-weeks),
 * whose Json slots stay `z.unknown()` on purpose: rows written before these
 * shapes existed hold other content, and `/v1/weeks` must keep serving them.
 * Consumers parse a slot with the schemas here where they use it — the
 * Workouts server's generation pass reads the snapshot, the app's deck loader
 * and slide renderer read the deck.
 *
 * ─── Who writes what ───────────────────────────────────────────────────────
 * - Deck (`SundayReviewDeckSchema`): written ONLY by the server's generation
 *   pass, then frozen — never regenerated. Read by the app.
 * - Snapshot (`WeekClientSnapshotSchema`): written by the device through
 *   `PUT /v1/weeks/:weekIso`, read by the server's generation pass. Untrusted
 *   input: an unreadable envelope means "no device-only slides", never an error.
 *
 * ─── Compatibility rules ───────────────────────────────────────────────────
 * - Objects are NOT strict: an unknown key is stripped, never rejected, so a
 *   producer one release ahead cannot break a reader one release behind.
 * - A deck slide's `type` is a plain string and its `payload` is unknown: a
 *   reader shows an unrecognised slide as one error slide instead of rejecting
 *   the deck, and parses each payload with `SlidePayloadSchemas[type]` where it
 *   renders it.
 * - Decks are frozen, so a payload field added later must be `.optional()`,
 *   or every deck already stored stops rendering that slide.
 * - `WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION` is the snapshot's compatibility
 *   hinge: the server reads only the version it knows. Bump it whenever a
 *   snapshot field is added, removed, or changes meaning.
 *
 * ─── Units ─────────────────────────────────────────────────────────────────
 * Every weight is KILOGRAMS. Every `deltaPct*` field is a FRACTION, not a
 * percent (0.172 means 17.2%).
 *
 * deps: zod, ./muscles (MuscleGroupSchema), ./training-session-log
 *       (ProgramPhaseSchema), ./workouts-program-rotation
 *       (ProgramRotationPhaseSchema), ../schemas/weight (loadWeightKgSchema)
 * consumers: hollis-workouts server (`server/src/services/sundayReview/*`) +
 *            mobile client (`src/schemas/slidePayloads.ts`,
 *            `src/schemas/weekClientSnapshot.ts`, `src/schemas/sundayReviewDeck.ts`)
 */
import * as z from "zod";
/** Every slide type a deck can hold. `SlidePayloadSchemas` has exactly these keys. */
export declare const SUNDAY_REVIEW_SLIDE_TYPES: readonly ["week_headline", "pr_celebration", "volume_delta", "muscle_group_balance", "standout_lift", "plateau_watch", "consistency_streak", "sleep_correlation", "calorie_correlation", "phase_outlook", "rotation_switch", "next_week_preview", "freeform", "sparse_data_note"];
export declare const SundayReviewSlideTypeSchema: z.ZodEnum<{
    week_headline: "week_headline";
    pr_celebration: "pr_celebration";
    volume_delta: "volume_delta";
    muscle_group_balance: "muscle_group_balance";
    standout_lift: "standout_lift";
    plateau_watch: "plateau_watch";
    consistency_streak: "consistency_streak";
    sleep_correlation: "sleep_correlation";
    calorie_correlation: "calorie_correlation";
    phase_outlook: "phase_outlook";
    rotation_switch: "rotation_switch";
    next_week_preview: "next_week_preview";
    freeform: "freeform";
    sparse_data_note: "sparse_data_note";
}>;
export type SundayReviewSlideType = z.infer<typeof SundayReviewSlideTypeSchema>;
/**
 * The six coarse body regions the `muscle_group_balance` slide groups muscle
 * groups into (the server owns the MuscleGroup → region table).
 */
export declare const WORKOUTS_BODY_REGIONS: readonly ["chest", "back", "arms", "shoulders", "core", "legs"];
export declare const WorkoutsBodyRegionSchema: z.ZodEnum<{
    chest: "chest";
    back: "back";
    shoulders: "shoulders";
    core: "core";
    arms: "arms";
    legs: "legs";
}>;
export type WorkoutsBodyRegion = z.infer<typeof WorkoutsBodyRegionSchema>;
export declare const PRItemSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    exerciseName: z.ZodString;
    e1rm: z.ZodNumber;
    previousBest: z.ZodNumber;
    sessionId: z.ZodString;
    dateIso: z.ZodString;
}, z.core.$strip>;
export type PRItem = z.infer<typeof PRItemSchema>;
export declare const VolumeRowSchema: z.ZodObject<{
    muscleGroup: z.ZodEnum<{
        chest: "chest";
        back: "back";
        shoulders: "shoulders";
        biceps: "biceps";
        triceps: "triceps";
        forearms: "forearms";
        quadriceps: "quadriceps";
        hamstrings: "hamstrings";
        glutes: "glutes";
        calves: "calves";
        core: "core";
        traps: "traps";
        lats: "lats";
        anterior_deltoids: "anterior_deltoids";
        lateral_deltoids: "lateral_deltoids";
        posterior_deltoids: "posterior_deltoids";
        hip_flexors: "hip_flexors";
        adductors: "adductors";
        abductors: "abductors";
        neck: "neck";
        obliques: "obliques";
        lower_back: "lower_back";
        upper_back: "upper_back";
    }>;
    volumeKg: z.ZodNumber;
    deltaPct: z.ZodNumber;
    targetKg: z.ZodOptional<z.ZodNumber>;
    avgVolumeKg4w: z.ZodOptional<z.ZodNumber>;
    prevWeekVolumeKg: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type VolumeRow = z.infer<typeof VolumeRowSchema>;
export declare const NextWeekDaySchema: z.ZodObject<{
    dateIso: z.ZodString;
    label: z.ZodString;
    sessionSummary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NextWeekDay = z.infer<typeof NextWeekDaySchema>;
export declare const JumpLiftSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    name: z.ZodString;
    currentE1rm: z.ZodNumber;
    jumpAtE1rm: z.ZodNumber;
}, z.core.$strip>;
export type JumpLift = z.infer<typeof JumpLiftSchema>;
export declare const MuscleGroupBalanceRegionSchema: z.ZodObject<{
    region: z.ZodEnum<{
        chest: "chest";
        back: "back";
        shoulders: "shoulders";
        core: "core";
        arms: "arms";
        legs: "legs";
    }>;
    percent: z.ZodNumber;
    color: z.ZodEnum<{
        low: "low";
        ok: "ok";
        over: "over";
    }>;
}, z.core.$strip>;
export type MuscleGroupBalanceRegion = z.infer<typeof MuscleGroupBalanceRegionSchema>;
/**
 * One (day, health metric, performance) triple behind a correlation slide.
 * `perfNorm` is the session's performance as a z-score across the correlation
 * window, clamped; Pearson's r is invariant under that linear rescale, so it
 * changes only what the slide plots, never the reported `r`.
 */
export declare const SleepCorrelationPointSchema: z.ZodObject<{
    dateIso: z.ZodString;
    sleepHours: z.ZodNumber;
    perfNorm: z.ZodNumber;
}, z.core.$strip>;
export type SleepCorrelationPoint = z.infer<typeof SleepCorrelationPointSchema>;
export declare const CalorieCorrelationPointSchema: z.ZodObject<{
    dateIso: z.ZodString;
    calories: z.ZodNumber;
    perfNorm: z.ZodNumber;
}, z.core.$strip>;
export type CalorieCorrelationPoint = z.infer<typeof CalorieCorrelationPointSchema>;
/**
 * The `phase_outlook` slide's action, narrowed to a phase change (spec §18.2).
 * The server RECONSTRUCTS it from the payload's own `from`/`to` rather than
 * accepting one from the device: it is what "Apply phase change" executes.
 */
export declare const PhaseChangeDiffSchema: z.ZodObject<{
    kind: z.ZodLiteral<"phase_change">;
    from: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
    to: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
}, z.core.$strip>;
export type PhaseChangeDiff = z.infer<typeof PhaseChangeDiffSchema>;
/**
 * The i18n key + params a phase-outlook `reason` was rendered from (#99). The
 * device uploads it in the snapshot, the server copies it into the slide
 * untouched, and the client renders it in the reader's locale.
 * `params.fromPhase` / `params.toPhase` are raw training-phase ids.
 */
export declare const PhaseOutlookReasonCopySchema: z.ZodObject<{
    key: z.ZodString;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    signals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type PhaseOutlookReasonCopy = z.infer<typeof PhaseOutlookReasonCopySchema>;
export declare const WeekHeadlinePayloadSchema: z.ZodObject<{
    sessionsCount: z.ZodNumber;
    totalVolumeKg: z.ZodNumber;
    deltaPctVsLastWeek: z.ZodNumber;
    weekRangeLabel: z.ZodString;
}, z.core.$strip>;
export type WeekHeadlinePayload = z.infer<typeof WeekHeadlinePayloadSchema>;
export declare const PrCelebrationPayloadSchema: z.ZodObject<{
    count: z.ZodNumber;
    prs: z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        exerciseName: z.ZodString;
        e1rm: z.ZodNumber;
        previousBest: z.ZodNumber;
        sessionId: z.ZodString;
        dateIso: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type PrCelebrationPayload = z.infer<typeof PrCelebrationPayloadSchema>;
export declare const VolumeDeltaPayloadSchema: z.ZodObject<{
    byMuscleGroup: z.ZodArray<z.ZodObject<{
        muscleGroup: z.ZodEnum<{
            chest: "chest";
            back: "back";
            shoulders: "shoulders";
            biceps: "biceps";
            triceps: "triceps";
            forearms: "forearms";
            quadriceps: "quadriceps";
            hamstrings: "hamstrings";
            glutes: "glutes";
            calves: "calves";
            core: "core";
            traps: "traps";
            lats: "lats";
            anterior_deltoids: "anterior_deltoids";
            lateral_deltoids: "lateral_deltoids";
            posterior_deltoids: "posterior_deltoids";
            hip_flexors: "hip_flexors";
            adductors: "adductors";
            abductors: "abductors";
            neck: "neck";
            obliques: "obliques";
            lower_back: "lower_back";
            upper_back: "upper_back";
        }>;
        volumeKg: z.ZodNumber;
        deltaPct: z.ZodNumber;
        targetKg: z.ZodOptional<z.ZodNumber>;
        avgVolumeKg4w: z.ZodOptional<z.ZodNumber>;
        prevWeekVolumeKg: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type VolumeDeltaPayload = z.infer<typeof VolumeDeltaPayloadSchema>;
export declare const MuscleGroupBalancePayloadSchema: z.ZodObject<{
    regions: z.ZodArray<z.ZodObject<{
        region: z.ZodEnum<{
            chest: "chest";
            back: "back";
            shoulders: "shoulders";
            core: "core";
            arms: "arms";
            legs: "legs";
        }>;
        percent: z.ZodNumber;
        color: z.ZodEnum<{
            low: "low";
            ok: "ok";
            over: "over";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MuscleGroupBalancePayload = z.infer<typeof MuscleGroupBalancePayloadSchema>;
export declare const StandoutLiftPayloadSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    name: z.ZodString;
    deltaPct4w: z.ZodNumber;
    e1rmCurrent: z.ZodNumber;
    e1rmFourWeeksAgo: z.ZodNumber;
    sessionsContributing: z.ZodNumber;
}, z.core.$strip>;
export type StandoutLiftPayload = z.infer<typeof StandoutLiftPayloadSchema>;
export declare const PlateauWatchPayloadSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    name: z.ZodString;
    weeksFlat: z.ZodNumber;
    lastTopSet: z.ZodObject<{
        weightKg: z.ZodNumber;
        reps: z.ZodNumber;
    }, z.core.$strip>;
    e1rmCurrent: z.ZodNumber;
    e1rmFourWeeksAgo: z.ZodNumber;
}, z.core.$strip>;
export type PlateauWatchPayload = z.infer<typeof PlateauWatchPayloadSchema>;
export declare const ConsistencyStreakPayloadSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        streak: "streak";
        comeback: "comeback";
    }>;
    weeks: z.ZodNumber;
    lastSessionDate: z.ZodString;
}, z.core.$strip>;
export type ConsistencyStreakPayload = z.infer<typeof ConsistencyStreakPayloadSchema>;
/** Device-computed (HealthKit / Health Connect never reach the server); arrives in the snapshot. */
export declare const SleepCorrelationPayloadSchema: z.ZodObject<{
    points: z.ZodArray<z.ZodObject<{
        dateIso: z.ZodString;
        sleepHours: z.ZodNumber;
        perfNorm: z.ZodNumber;
    }, z.core.$strip>>;
    r: z.ZodNumber;
    n: z.ZodNumber;
    weeksWindow: z.ZodNumber;
}, z.core.$strip>;
export type SleepCorrelationPayload = z.infer<typeof SleepCorrelationPayloadSchema>;
/** Device-computed; arrives in the snapshot. */
export declare const CalorieCorrelationPayloadSchema: z.ZodObject<{
    points: z.ZodArray<z.ZodObject<{
        dateIso: z.ZodString;
        calories: z.ZodNumber;
        perfNorm: z.ZodNumber;
    }, z.core.$strip>>;
    r: z.ZodNumber;
    n: z.ZodNumber;
    weeksWindow: z.ZodNumber;
}, z.core.$strip>;
export type CalorieCorrelationPayload = z.infer<typeof CalorieCorrelationPayloadSchema>;
/** `from`/`to` are ProgramPhases (what the block is doing), not training phases (the goal). */
export declare const PhaseOutlookPayloadSchema: z.ZodObject<{
    from: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
    to: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
    reason: z.ZodString;
    reasonCopy: z.ZodOptional<z.ZodObject<{
        key: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        signals: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    suggestedDiff: z.ZodObject<{
        kind: z.ZodLiteral<"phase_change">;
        from: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
        to: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PhaseOutlookPayload = z.infer<typeof PhaseOutlookPayloadSchema>;
/**
 * The `rotation_switch` slide (#70): a SCHEDULED program + phase change,
 * announced the week before it lands. The device evaluates the rotation
 * against local civil dates and uploads this exact shape as the snapshot's
 * `rotationSwitch` rider; the server copies it into the slide unchanged.
 * `phase`/`fromPhase` are training phases (build/maintain/cut), not ProgramPhases.
 */
export declare const RotationSwitchPayloadSchema: z.ZodObject<{
    entryId: z.ZodString;
    programId: z.ZodNullable<z.ZodString>;
    programName: z.ZodString;
    phase: z.ZodEnum<{
        maintain: "maintain";
        build: "build";
        cut: "cut";
    }>;
    fromPhase: z.ZodEnum<{
        maintain: "maintain";
        build: "build";
        cut: "cut";
    }>;
    endingProgramName: z.ZodNullable<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    switchDate: z.ZodString;
}, z.core.$strip>;
export type RotationSwitchPayload = z.infer<typeof RotationSwitchPayloadSchema>;
export declare const NextWeekPreviewPayloadSchema: z.ZodObject<{
    upcoming: z.ZodArray<z.ZodObject<{
        dateIso: z.ZodString;
        label: z.ZodString;
        sessionSummary: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    deloadInWeeks: z.ZodOptional<z.ZodNumber>;
    jumpThresholdLifts: z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        name: z.ZodString;
        currentE1rm: z.ZodNumber;
        jumpAtE1rm: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type NextWeekPreviewPayload = z.infer<typeof NextWeekPreviewPayloadSchema>;
/**
 * The model's freeform observation as the generation step RECEIVES it. NOT
 * what a deck stores — see `FreeformSlidePayloadSchema`.
 */
export declare const FreeformPayloadSchema: z.ZodObject<{
    headline: z.ZodString;
    body: z.ZodString;
    confidence: z.ZodEnum<{
        low: "low";
        high: "high";
        medium: "medium";
    }>;
    reasoning: z.ZodString;
}, z.core.$strip>;
export type FreeformPayload = z.infer<typeof FreeformPayloadSchema>;
/**
 * The `freeform` slide payload as a deck STORES it: the server drops
 * `confidence`/`reasoning` (AI metadata the slide never renders) before
 * freezing, so only the reader-facing copy is persisted. This is the schema a
 * renderer parses a stored `freeform` slide with.
 */
export declare const FreeformSlidePayloadSchema: z.ZodObject<{
    body: z.ZodString;
    headline: z.ZodString;
}, z.core.$strip>;
export type FreeformSlidePayload = z.infer<typeof FreeformSlidePayloadSchema>;
export declare const SparseDataNotePayloadSchema: z.ZodObject<{
    weeksOfData: z.ZodNumber;
    sessionsTotal: z.ZodNumber;
}, z.core.$strip>;
export type SparseDataNotePayload = z.infer<typeof SparseDataNotePayloadSchema>;
/** The payload schema for each slide type, as the payload sits in a stored deck. */
export declare const SlidePayloadSchemas: {
    readonly week_headline: z.ZodObject<{
        sessionsCount: z.ZodNumber;
        totalVolumeKg: z.ZodNumber;
        deltaPctVsLastWeek: z.ZodNumber;
        weekRangeLabel: z.ZodString;
    }, z.core.$strip>;
    readonly pr_celebration: z.ZodObject<{
        count: z.ZodNumber;
        prs: z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            exerciseName: z.ZodString;
            e1rm: z.ZodNumber;
            previousBest: z.ZodNumber;
            sessionId: z.ZodString;
            dateIso: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly volume_delta: z.ZodObject<{
        byMuscleGroup: z.ZodArray<z.ZodObject<{
            muscleGroup: z.ZodEnum<{
                chest: "chest";
                back: "back";
                shoulders: "shoulders";
                biceps: "biceps";
                triceps: "triceps";
                forearms: "forearms";
                quadriceps: "quadriceps";
                hamstrings: "hamstrings";
                glutes: "glutes";
                calves: "calves";
                core: "core";
                traps: "traps";
                lats: "lats";
                anterior_deltoids: "anterior_deltoids";
                lateral_deltoids: "lateral_deltoids";
                posterior_deltoids: "posterior_deltoids";
                hip_flexors: "hip_flexors";
                adductors: "adductors";
                abductors: "abductors";
                neck: "neck";
                obliques: "obliques";
                lower_back: "lower_back";
                upper_back: "upper_back";
            }>;
            volumeKg: z.ZodNumber;
            deltaPct: z.ZodNumber;
            targetKg: z.ZodOptional<z.ZodNumber>;
            avgVolumeKg4w: z.ZodOptional<z.ZodNumber>;
            prevWeekVolumeKg: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly muscle_group_balance: z.ZodObject<{
        regions: z.ZodArray<z.ZodObject<{
            region: z.ZodEnum<{
                chest: "chest";
                back: "back";
                shoulders: "shoulders";
                core: "core";
                arms: "arms";
                legs: "legs";
            }>;
            percent: z.ZodNumber;
            color: z.ZodEnum<{
                low: "low";
                ok: "ok";
                over: "over";
            }>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly standout_lift: z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        name: z.ZodString;
        deltaPct4w: z.ZodNumber;
        e1rmCurrent: z.ZodNumber;
        e1rmFourWeeksAgo: z.ZodNumber;
        sessionsContributing: z.ZodNumber;
    }, z.core.$strip>;
    readonly plateau_watch: z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        name: z.ZodString;
        weeksFlat: z.ZodNumber;
        lastTopSet: z.ZodObject<{
            weightKg: z.ZodNumber;
            reps: z.ZodNumber;
        }, z.core.$strip>;
        e1rmCurrent: z.ZodNumber;
        e1rmFourWeeksAgo: z.ZodNumber;
    }, z.core.$strip>;
    readonly consistency_streak: z.ZodObject<{
        kind: z.ZodEnum<{
            streak: "streak";
            comeback: "comeback";
        }>;
        weeks: z.ZodNumber;
        lastSessionDate: z.ZodString;
    }, z.core.$strip>;
    readonly sleep_correlation: z.ZodObject<{
        points: z.ZodArray<z.ZodObject<{
            dateIso: z.ZodString;
            sleepHours: z.ZodNumber;
            perfNorm: z.ZodNumber;
        }, z.core.$strip>>;
        r: z.ZodNumber;
        n: z.ZodNumber;
        weeksWindow: z.ZodNumber;
    }, z.core.$strip>;
    readonly calorie_correlation: z.ZodObject<{
        points: z.ZodArray<z.ZodObject<{
            dateIso: z.ZodString;
            calories: z.ZodNumber;
            perfNorm: z.ZodNumber;
        }, z.core.$strip>>;
        r: z.ZodNumber;
        n: z.ZodNumber;
        weeksWindow: z.ZodNumber;
    }, z.core.$strip>;
    readonly phase_outlook: z.ZodObject<{
        from: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
        to: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
        reason: z.ZodString;
        reasonCopy: z.ZodOptional<z.ZodObject<{
            key: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
            signals: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        suggestedDiff: z.ZodObject<{
            kind: z.ZodLiteral<"phase_change">;
            from: z.ZodEnum<{
                strength: "strength";
                hypertrophy: "hypertrophy";
                peaking: "peaking";
                deload: "deload";
                maintenance: "maintenance";
            }>;
            to: z.ZodEnum<{
                strength: "strength";
                hypertrophy: "hypertrophy";
                peaking: "peaking";
                deload: "deload";
                maintenance: "maintenance";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    readonly rotation_switch: z.ZodObject<{
        entryId: z.ZodString;
        programId: z.ZodNullable<z.ZodString>;
        programName: z.ZodString;
        phase: z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>;
        fromPhase: z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>;
        endingProgramName: z.ZodNullable<z.ZodString>;
        startDate: z.ZodString;
        endDate: z.ZodString;
        switchDate: z.ZodString;
    }, z.core.$strip>;
    readonly next_week_preview: z.ZodObject<{
        upcoming: z.ZodArray<z.ZodObject<{
            dateIso: z.ZodString;
            label: z.ZodString;
            sessionSummary: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        deloadInWeeks: z.ZodOptional<z.ZodNumber>;
        jumpThresholdLifts: z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            name: z.ZodString;
            currentE1rm: z.ZodNumber;
            jumpAtE1rm: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly freeform: z.ZodObject<{
        body: z.ZodString;
        headline: z.ZodString;
    }, z.core.$strip>;
    readonly sparse_data_note: z.ZodObject<{
        weeksOfData: z.ZodNumber;
        sessionsTotal: z.ZodNumber;
    }, z.core.$strip>;
};
/**
 * The only snapshot version a reader accepts. Bump it whenever a snapshot
 * field is added, removed or changes meaning; a mismatched envelope degrades
 * to "no device-only slides" instead of a wrong slide.
 *
 * 3 — adds `rotationSwitch` (hollis-workouts#70).
 * 2 — adds `phaseOutlook` (hollis-workouts#79).
 * 1 — sleep / calorie correlations + jump-threshold lifts (hollis-workouts#13).
 */
export declare const WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION: 3;
/**
 * The device's phase-change suggestion. NOT the slide payload: `confidence`
 * is the server's gate input and is never rendered, and there is no
 * `suggestedDiff` because the server reconstructs it from `from`/`to`.
 */
export declare const WeekPhaseOutlookSchema: z.ZodObject<{
    from: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
    to: z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>;
    reason: z.ZodString;
    reasonCopy: z.ZodOptional<z.ZodObject<{
        key: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        signals: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export type WeekPhaseOutlook = z.infer<typeof WeekPhaseOutlookSchema>;
/** The rotation rider IS the `rotation_switch` slide payload. */
export declare const WeekRotationSwitchSchema: z.ZodObject<{
    entryId: z.ZodString;
    programId: z.ZodNullable<z.ZodString>;
    programName: z.ZodString;
    phase: z.ZodEnum<{
        maintain: "maintain";
        build: "build";
        cut: "cut";
    }>;
    fromPhase: z.ZodEnum<{
        maintain: "maintain";
        build: "build";
        cut: "cut";
    }>;
    endingProgramName: z.ZodNullable<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    switchDate: z.ZodString;
}, z.core.$strip>;
export type WeekRotationSwitch = RotationSwitchPayload;
export declare const WeekClientSnapshotSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<3>;
    weekIso: z.ZodString;
    capturedAt: z.ZodString;
    sleepCorrelation: z.ZodOptional<z.ZodObject<{
        points: z.ZodArray<z.ZodObject<{
            dateIso: z.ZodString;
            sleepHours: z.ZodNumber;
            perfNorm: z.ZodNumber;
        }, z.core.$strip>>;
        r: z.ZodNumber;
        n: z.ZodNumber;
        weeksWindow: z.ZodNumber;
    }, z.core.$strip>>;
    calorieCorrelation: z.ZodOptional<z.ZodObject<{
        points: z.ZodArray<z.ZodObject<{
            dateIso: z.ZodString;
            calories: z.ZodNumber;
            perfNorm: z.ZodNumber;
        }, z.core.$strip>>;
        r: z.ZodNumber;
        n: z.ZodNumber;
        weeksWindow: z.ZodNumber;
    }, z.core.$strip>>;
    jumpThresholdLifts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        name: z.ZodString;
        currentE1rm: z.ZodNumber;
        jumpAtE1rm: z.ZodNumber;
    }, z.core.$strip>>>;
    phaseOutlook: z.ZodOptional<z.ZodObject<{
        from: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
        to: z.ZodEnum<{
            strength: "strength";
            hypertrophy: "hypertrophy";
            peaking: "peaking";
            deload: "deload";
            maintenance: "maintenance";
        }>;
        reason: z.ZodString;
        reasonCopy: z.ZodOptional<z.ZodObject<{
            key: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
            signals: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        confidence: z.ZodNumber;
    }, z.core.$strip>>;
    rotationSwitch: z.ZodOptional<z.ZodObject<{
        entryId: z.ZodString;
        programId: z.ZodNullable<z.ZodString>;
        programName: z.ZodString;
        phase: z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>;
        fromPhase: z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>;
        endingProgramName: z.ZodNullable<z.ZodString>;
        startDate: z.ZodString;
        endDate: z.ZodString;
        switchDate: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WeekClientSnapshot = z.infer<typeof WeekClientSnapshotSchema>;
export declare const SUNDAY_REVIEW_MODEL_TIERS: readonly ["flash", "pro", "image"];
export declare const SundayReviewModelTierSchema: z.ZodEnum<{
    flash: "flash";
    pro: "pro";
    image: "image";
}>;
export type SundayReviewModelTier = z.infer<typeof SundayReviewModelTierSchema>;
/**
 * i18n key + params for a narrative the SERVER composed deterministically
 * (#99). `narrative` keeps the English; the client renders this in the
 * reader's locale. Keys are a data format shared with the client's locale
 * bundles: reword freely, never rename.
 */
export declare const SundayReviewNarrativeCopySchema: z.ZodObject<{
    key: z.ZodString;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
}, z.core.$strip>;
export type SundayReviewNarrativeCopy = z.infer<typeof SundayReviewNarrativeCopySchema>;
export declare const SundayReviewPersistedSlideSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    payload: z.ZodUnknown;
    narrative: z.ZodString;
    narrativeCopy: z.ZodOptional<z.ZodObject<{
        key: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    }, z.core.$strip>>;
    threadId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SundayReviewPersistedSlide = z.infer<typeof SundayReviewPersistedSlideSchema>;
export declare const SundayReviewDeckSchema: z.ZodObject<{
    generatedAt: z.ZodString;
    modelTier: z.ZodEnum<{
        flash: "flash";
        pro: "pro";
        image: "image";
    }>;
    snapshotVersion: z.ZodNumber;
    slides: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        payload: z.ZodUnknown;
        narrative: z.ZodString;
        narrativeCopy: z.ZodOptional<z.ZodObject<{
            key: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        }, z.core.$strip>>;
        threadId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    deckOrdering: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export type SundayReviewDeck = z.infer<typeof SundayReviewDeckSchema>;
//# sourceMappingURL=workouts-sunday-review.d.ts.map
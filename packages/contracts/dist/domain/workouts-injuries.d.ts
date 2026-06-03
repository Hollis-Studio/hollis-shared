/**
 * @ai-context Workouts injury records | InjuryRecordSchema, InjuryRecordBodySchema.
 *
 * muscleGroup uses z.string().min(1).max(64) in the body (not MuscleGroupSchema)
 * to avoid a 400 regression for clients sending unknown muscle group strings.
 * The server query-param validation already uses MuscleGroupSchema (unchanged).
 * TODO: narrow to MuscleGroupSchema once client enum is confirmed stable.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export declare const InjuryRecordBodySchema: z.ZodObject<{
    muscleGroup: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    isActive: z.ZodBoolean;
}, z.core.$strip>;
export type InjuryRecordBody = z.infer<typeof InjuryRecordBodySchema>;
export declare const InjuryRecordSchema: z.ZodObject<{
    muscleGroup: z.ZodString;
    description: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    isActive: z.ZodBoolean;
    id: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type InjuryRecord = z.infer<typeof InjuryRecordSchema>;
//# sourceMappingURL=workouts-injuries.d.ts.map
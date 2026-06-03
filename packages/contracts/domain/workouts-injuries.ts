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

export const InjuryRecordBodySchema = z.object({
  muscleGroup: z.string().min(1).max(64),
  description: z.string().max(2000),
  createdAt: z.coerce.date(),
  isActive: z.boolean(),
});
export type InjuryRecordBody = z.infer<typeof InjuryRecordBodySchema>;

export const InjuryRecordSchema = InjuryRecordBodySchema.extend({
  id: z.string().min(1),
  updatedAt: z.coerce.date().optional(),
});
export type InjuryRecord = z.infer<typeof InjuryRecordSchema>;

/**
 * Assigned Workouts programs. One programming system for the whole suite: a
 * Hollis admin authors a canonical Workouts `Program` for any client — a
 * coaching member, a Health clinic member, or a Workouts-only user — and the
 * Workouts service delivers it as an immutable snapshot beside a normal
 * Program row. Coaching is one source of an assigned program, not its owner.
 */
import * as z from "zod";
import { CanonicalExerciseRecordSchema } from "./exercise-workouts.js";
import {
  CoachingAssignmentStatusSchema,
  CoachingProgramSnapshotSchema,
} from "./coaching.js";
import { userIdSchema } from "../schemas/index.js";

export const ASSIGNED_PROGRAM_SOURCES = ["coaching", "admin"] as const;
export const ASSIGNED_PROGRAM_SOURCE = { COACHING: "coaching", ADMIN: "admin" } as const;
export const AssignedProgramSourceSchema = z.enum(ASSIGNED_PROGRAM_SOURCES);
export type AssignedProgramSource = z.infer<typeof AssignedProgramSourceSchema>;

/** `replace` swaps the recipient's active program; `add` leaves it untouched. */
export const ASSIGNED_PROGRAM_ACTIVATIONS = ["replace", "add"] as const;
export const AssignedProgramActivationSchema = z.enum(ASSIGNED_PROGRAM_ACTIVATIONS);
export type AssignedProgramActivation = z.infer<typeof AssignedProgramActivationSchema>;

/**
 * The deliverable program body. It is the canonical Workouts `ProgramSchema`
 * without server-owned fields, so every source shares one editor and one
 * renderer. Kept as an alias so coaching and admin plans cannot drift apart.
 */
export const AssignedProgramSnapshotSchema = CoachingProgramSnapshotSchema;
export type AssignedProgramSnapshot = z.infer<typeof AssignedProgramSnapshotSchema>;

// ── Health → Workouts admin bridge (server-to-server only) ──────────────────

export const WorkoutsRecipientSearchQuerySchema = z.object({
  search: z.string().trim().min(2).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type WorkoutsRecipientSearchQuery = z.infer<typeof WorkoutsRecipientSearchQuerySchema>;

export const WorkoutsRecipientSchema = z.object({
  appUserId: z.string().min(1).max(256),
  displayName: z.string().max(200).nullable(),
  email: z.string().max(320).nullable(),
  joinedAt: z.string().datetime(),
  lastSessionAt: z.string().datetime().nullable(),
  programCount: z.number().int().min(0),
});
export type WorkoutsRecipient = z.infer<typeof WorkoutsRecipientSchema>;
export const WorkoutsRecipientListSchema = WorkoutsRecipientSchema.array().max(50);

/** Who authored a program row in the recipient's app. */
export const WorkoutsProgramOriginSchema = z.enum(["user", ...ASSIGNED_PROGRAM_SOURCES]);
export type WorkoutsProgramOrigin = z.infer<typeof WorkoutsProgramOriginSchema>;

export const WorkoutsRecipientProgramSchema = z.object({
  programId: z.string().min(1),
  name: z.string(),
  isActive: z.boolean(),
  origin: WorkoutsProgramOriginSchema,
  durationWeeks: z.number().int(),
  trainingDays: z.number().int().min(0),
  startDate: z.string().datetime(),
  updatedAt: z.string().datetime(),
  /** Present when the row still parses as a deliverable snapshot. */
  program: AssignedProgramSnapshotSchema.nullable(),
});
export type WorkoutsRecipientProgram = z.infer<typeof WorkoutsRecipientProgramSchema>;
export const WorkoutsRecipientProgramListSchema = WorkoutsRecipientProgramSchema.array().max(200);

export const AssignedProgramRequestSchema = z.object({
  assignmentId: z.string().uuid(),
  appUserId: z.string().min(1).max(256),
  source: z.literal(ASSIGNED_PROGRAM_SOURCE.ADMIN),
  sourcePlanId: z.string().min(1).max(256),
  sourcePlanVersion: z.string().min(1).max(256),
  /** The delivered assignment this version replaces, if any. */
  supersedesAssignmentId: z.string().uuid().nullable().default(null),
  activation: AssignedProgramActivationSchema.default("replace"),
  startDate: z.string().datetime(),
  assignedByUserId: userIdSchema,
  program: AssignedProgramSnapshotSchema,
});
export type AssignedProgramRequest = z.infer<typeof AssignedProgramRequestSchema>;

export const WorkoutsCatalogQuerySchema = z.object({
  search: z.string().trim().min(1).max(200).optional(),
  modality: CanonicalExerciseRecordSchema.shape.modality.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});
export type WorkoutsCatalogQuery = z.infer<typeof WorkoutsCatalogQuerySchema>;

// ── Health admin API (web-admin ↔ Health server) ────────────────────────────

export const WORKOUTS_PLANS_ADMIN_ROUTES = {
  CLIENTS: "/api/admin/workouts-plans/clients",
  CLIENT: (clientId: string) => `/api/admin/workouts-plans/clients/${clientId}`,
  TEMPLATES: "/api/admin/workouts-plans/templates",
  DRAFTS: "/api/admin/workouts-plans/drafts",
  DRAFT: (draftId: string) => `/api/admin/workouts-plans/drafts/${draftId}`,
  DRAFT_DUPLICATE: (draftId: string) => `/api/admin/workouts-plans/drafts/${draftId}/duplicate`,
  DRAFT_PUBLISH: (draftId: string) => `/api/admin/workouts-plans/drafts/${draftId}/publish`,
  ASSIGNMENT_RETRY: (assignmentId: string) => `/api/admin/workouts-plans/assignments/${assignmentId}/retry`,
  CATALOG: "/api/admin/workouts-plans/catalog",
  AI_DRAFT: "/api/admin/workouts-plans/ai-draft",
} as const;

export const WorkoutsClientSearchQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
});
export type WorkoutsClientSearchQuery = z.infer<typeof WorkoutsClientSearchQuerySchema>;

export const WorkoutsPlanAiDraftRequestSchema = z.object({
  clientId: z.string().uuid(),
  startDate: z.string().datetime(),
  customPrompt: z.string().trim().min(1).max(2_000).optional(),
});
export type WorkoutsPlanAiDraftRequest = z.infer<typeof WorkoutsPlanAiDraftRequestSchema>;

export const WORKOUTS_CLIENT_KINDS = ["COACHING", "HEALTH_MEMBER", "WORKOUTS_ONLY"] as const;
export const WorkoutsClientKindSchema = z.enum(WORKOUTS_CLIENT_KINDS);
export type WorkoutsClientKind = z.infer<typeof WorkoutsClientKindSchema>;

/** How Hollis learned which Workouts account belongs to this client. */
export const WORKOUTS_CLIENT_LINK_METHODS = ["COACHING_LINK", "ADMIN_SELECTED"] as const;
export const WorkoutsClientLinkMethodSchema = z.enum(WORKOUTS_CLIENT_LINK_METHODS);
export type WorkoutsClientLinkMethod = z.infer<typeof WorkoutsClientLinkMethodSchema>;

export const WorkoutsClientSchema = z.object({
  id: z.string().uuid(),
  kind: WorkoutsClientKindSchema,
  displayName: z.string(),
  email: z.string().nullable(),
  healthUserId: z.string().nullable(),
  coachingMembershipId: z.string().uuid().nullable(),
  linkMethod: WorkoutsClientLinkMethodSchema,
  linkedAt: z.string().datetime(),
});
export type WorkoutsClient = z.infer<typeof WorkoutsClientSchema>;
export const WorkoutsClientListSchema = WorkoutsClientSchema.array();

/**
 * Unified picker row. `clientId` is null until the admin registers the person;
 * `appUserId` is only ever sent back to the server inside a register request
 * that the server re-verifies against the Workouts bridge.
 */
export const WorkoutsClientCandidateSchema = z.object({
  clientId: z.string().uuid().nullable(),
  kind: WorkoutsClientKindSchema,
  displayName: z.string(),
  email: z.string().nullable(),
  healthUserId: z.string().nullable(),
  appUserId: z.string().nullable(),
  lastSessionAt: z.string().datetime().nullable(),
});
export type WorkoutsClientCandidate = z.infer<typeof WorkoutsClientCandidateSchema>;
export const WorkoutsClientCandidateListSchema = WorkoutsClientCandidateSchema.array();

export const WorkoutsClientRegisterSchema = z.object({
  appUserId: z.string().min(1).max(256),
  healthUserId: z.string().min(1).max(64).nullable().default(null),
});
export type WorkoutsClientRegister = z.infer<typeof WorkoutsClientRegisterSchema>;

export const WORKOUTS_PLAN_DRAFT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const WorkoutsPlanDraftStatusSchema = z.enum(WORKOUTS_PLAN_DRAFT_STATUSES);
export type WorkoutsPlanDraftStatus = z.infer<typeof WorkoutsPlanDraftStatusSchema>;

/** Drafts autosave, so the stored body may be mid-edit and not yet deliverable. */
export const WorkoutsPlanDraftBodySchema = z.record(z.string(), z.unknown());

export const WorkoutsPlanDraftSchema = z.object({
  id: z.string().uuid(),
  /** Null for a reusable template. */
  clientId: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(200),
  program: WorkoutsPlanDraftBodySchema,
  status: WorkoutsPlanDraftStatusSchema,
  /** Count of published versions; 0 until first delivery. */
  version: z.number().int().min(0),
  isTemplate: z.boolean(),
  updatedAt: z.string().datetime(),
});
export type WorkoutsPlanDraft = z.infer<typeof WorkoutsPlanDraftSchema>;
export const WorkoutsPlanDraftListSchema = WorkoutsPlanDraftSchema.array();

export const WorkoutsPlanDraftSaveSchema = z.object({
  clientId: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(200),
  program: WorkoutsPlanDraftBodySchema,
  isTemplate: z.boolean().default(false),
});
export type WorkoutsPlanDraftSave = z.infer<typeof WorkoutsPlanDraftSaveSchema>;

export const WorkoutsPlanDraftDuplicateSchema = z.object({
  targetClientId: z.string().uuid().nullable(),
  asTemplate: z.boolean().default(false),
});
export type WorkoutsPlanDraftDuplicate = z.infer<typeof WorkoutsPlanDraftDuplicateSchema>;

export const WorkoutsPlanPublishSchema = z.object({
  startDate: z.string().datetime(),
  activation: AssignedProgramActivationSchema.default("replace"),
});
export type WorkoutsPlanPublish = z.infer<typeof WorkoutsPlanPublishSchema>;

export const WorkoutsPlanAssignmentSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  draftId: z.string().uuid().nullable(),
  planVersion: z.number().int().min(1),
  programName: z.string(),
  status: CoachingAssignmentStatusSchema,
  activation: AssignedProgramActivationSchema,
  startDate: z.string().datetime(),
  deliveredAt: z.string().datetime().nullable(),
  acknowledgedAt: z.string().datetime().nullable(),
  failureCode: z.string().nullable(),
});
export type WorkoutsPlanAssignment = z.infer<typeof WorkoutsPlanAssignmentSchema>;
export const WorkoutsPlanAssignmentListSchema = WorkoutsPlanAssignmentSchema.array();

/** Everything the builder needs for one client. Bridge reads degrade to null. */
export const WorkoutsClientDetailSchema = z.object({
  client: WorkoutsClientSchema,
  drafts: WorkoutsPlanDraftListSchema,
  assignments: WorkoutsPlanAssignmentListSchema,
  /** Live programs in the person's app; null when the Workouts service is unreachable. */
  appPrograms: WorkoutsRecipientProgramListSchema.nullable(),
});
export type WorkoutsClientDetail = z.infer<typeof WorkoutsClientDetailSchema>;

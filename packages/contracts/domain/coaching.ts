/**
 * Life coaching contracts. These are intentionally separate from facility
 * membership, appointments, and app-store purchase contracts.
 */
import { z } from "zod";
import { createPaginatedListSchema } from "./pagination.js";
import { ProgramSchema } from "../progression/program.js";
import { userIdSchema } from "../schemas/index.js";

export const COACHING_SERVICE = "life_coaching" as const;

/**
 * Health user IDs are issued as HH-XXXXXX barcodes. A small set of legacy
 * provider rows still uses UUIDs, so provider references accept both while
 * actor and member user IDs remain canonical Health user IDs.
 */
export const CoachingProviderIdSchema = z.union([userIdSchema, z.string().uuid()]);
export type CoachingProviderId = z.infer<typeof CoachingProviderIdSchema>;
export const COACHING_INITIAL_TERM_DAYS = 90;
export const COACHING_INITIAL_TERM_PRICE_CENTS = 89700;
export const COACHING_MONTHLY_PRICE_CENTS = 29900;
export const COACHING_CALLS_PER_SERVICE_WINDOW = 2;
export const COACHING_INITIAL_TERM_CALLS = 6;

export const COACHING_LEAD_STAGES = [
  "NEW", "CONSULTATION_BOOKED", "ATTENDED", "ELIGIBLE_INVITED", "ENROLLED", "DECLINED", "CLOSED",
] as const;
export const COACHING_LEAD_STAGE = {
  NEW: "NEW", CONSULTATION_BOOKED: "CONSULTATION_BOOKED", ATTENDED: "ATTENDED", ELIGIBLE_INVITED: "ELIGIBLE_INVITED",
  ENROLLED: "ENROLLED", DECLINED: "DECLINED", CLOSED: "CLOSED",
} as const;
export const CoachingLeadStageSchema = z.enum(COACHING_LEAD_STAGES);
export type CoachingLeadStage = z.infer<typeof CoachingLeadStageSchema>;

export const COACHING_MEMBERSHIP_STATUSES = ["PENDING", "ACTIVE", "PAST_DUE", "ENDED", "REFUNDED"] as const;
export const COACHING_MEMBERSHIP_STATUS = { PENDING: "PENDING", ACTIVE: "ACTIVE", PAST_DUE: "PAST_DUE", ENDED: "ENDED", REFUNDED: "REFUNDED" } as const;
export const CoachingMembershipStatusSchema = z.enum(COACHING_MEMBERSHIP_STATUSES);
export type CoachingMembershipStatus = z.infer<typeof CoachingMembershipStatusSchema>;

export const COACHING_BILLING_PHASES = ["INITIAL_TERM", "MONTHLY"] as const;
export const CoachingBillingPhaseSchema = z.enum(COACHING_BILLING_PHASES);
export type CoachingBillingPhase = z.infer<typeof CoachingBillingPhaseSchema>;

export const COACHING_APPOINTMENT_KINDS = ["CONSULTATION", "MEMBER_CALL"] as const;
export const CoachingAppointmentKindSchema = z.enum(COACHING_APPOINTMENT_KINDS);
export type CoachingAppointmentKind = z.infer<typeof CoachingAppointmentKindSchema>;

export const COACHING_ASSIGNMENT_STATUSES = ["QUEUED", "DELIVERED", "FAILED"] as const;
export const COACHING_ASSIGNMENT_STATUS = { QUEUED: "QUEUED", DELIVERED: "DELIVERED", FAILED: "FAILED" } as const;
export const CoachingAssignmentStatusSchema = z.enum(COACHING_ASSIGNMENT_STATUSES);
export type CoachingAssignmentStatus = z.infer<typeof CoachingAssignmentStatusSchema>;

export const COACHING_CALL_CREDIT_STATUSES = ["AVAILABLE", "RESERVED", "CONSUMED", "RELEASED", "EXPIRED"] as const;
export const COACHING_CALL_CREDIT_STATUS = { AVAILABLE: "AVAILABLE", RESERVED: "RESERVED", CONSUMED: "CONSUMED", RELEASED: "RELEASED", EXPIRED: "EXPIRED" } as const;
export const CoachingCallCreditStatusSchema = z.enum(COACHING_CALL_CREDIT_STATUSES);
export type CoachingCallCreditStatus = z.infer<typeof CoachingCallCreditStatusSchema>;

export const COACHING_FULFILLMENT_STATUSES = ["NOT_STARTED", "ELIGIBILITY_PENDING", "PENDING_ACTIVATION", "ACTIVATED", "FAILED", "RESOLUTION_REQUIRED"] as const;
export const COACHING_FULFILLMENT_STATUS = { NOT_STARTED: "NOT_STARTED", ELIGIBILITY_PENDING: "ELIGIBILITY_PENDING", PENDING_ACTIVATION: "PENDING_ACTIVATION", ACTIVATED: "ACTIVATED", FAILED: "FAILED", RESOLUTION_REQUIRED: "RESOLUTION_REQUIRED" } as const;
export const CoachingFulfillmentStatusSchema = z.enum(COACHING_FULFILLMENT_STATUSES);
export type CoachingFulfillmentStatus = z.infer<typeof CoachingFulfillmentStatusSchema>;

export const CoachingLeadCreateSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().email().max(320),
  state: z.string().trim().min(2).max(100),
  timeZone: z.string().trim().min(1).max(100),
  goals: z.string().trim().min(1).max(2000),
  availability: z.string().trim().max(2000).optional(),
  phone: z.string().trim().max(32).optional(),
  marketingConsent: z.boolean().default(false),
  source: z.string().trim().max(200).optional(),
  utm: z.record(z.string(), z.string().max(500)).optional(),
});
export type CoachingLeadCreate = z.infer<typeof CoachingLeadCreateSchema>;

export const CoachingCapacitySchema = z.object({
  capacity: z.number().int().positive(),
  activeOrReserved: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
  enrollmentOpen: z.boolean(),
});
export type CoachingCapacity = z.infer<typeof CoachingCapacitySchema>;

export const CoachingCheckoutCreateSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  acceptedTerms: z.literal(true),
  termsVersion: z.string().trim().min(1).max(100),
});
export type CoachingCheckoutCreate = z.infer<typeof CoachingCheckoutCreateSchema>;

export const CoachingMembershipSummarySchema = z.object({
  id: z.string().uuid(),
  status: CoachingMembershipStatusSchema,
  billingPhase: CoachingBillingPhaseSchema,
  serviceStartedAt: z.string().datetime().nullable(),
  paidThroughAt: z.string().datetime().nullable(),
  renewalEnabled: z.boolean(),
  nextChargeAt: z.string().datetime().nullable(),
  nextChargeAmountCents: z.number().int().nonnegative().nullable(),
  callsRemaining: z.number().int().nonnegative(),
  appLinked: z.boolean(),
});
export type CoachingMembershipSummary = z.infer<typeof CoachingMembershipSummarySchema>;

export const CoachingRenewalCancelSchema = z.object({ reason: z.string().trim().max(1000).optional() });
export type CoachingRenewalCancel = z.infer<typeof CoachingRenewalCancelSchema>;

export const CoachingAdminClientSchema = CoachingMembershipSummarySchema.extend({
  userId: userIdSchema, email: z.string().email(), name: z.string(), assignedCoachId: CoachingProviderIdSchema.nullable(),
  leadStage: CoachingLeadStageSchema.nullable(), nextAppointmentAt: z.string().datetime().nullable(),
  attentionNeeded: z.boolean(),
});
export type CoachingAdminClient = z.infer<typeof CoachingAdminClientSchema>;
export const CoachingAdminClientListSchema = createPaginatedListSchema(CoachingAdminClientSchema);

export const CoachingLeadSchema = z.object({
  id: z.string(), fullName: z.string(), email: z.string().email(), state: z.string(), timeZone: z.string(),
  stage: CoachingLeadStageSchema, createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
  consultationAt: z.string().datetime().nullable(), attentionNeeded: z.boolean(),
});
export type CoachingLead = z.infer<typeof CoachingLeadSchema>;
export const CoachingLeadListSchema = createPaginatedListSchema(CoachingLeadSchema);
export const CoachingLeadStageUpdateSchema = z.object({ stage: CoachingLeadStageSchema });
export type CoachingLeadStageUpdate = z.infer<typeof CoachingLeadStageUpdateSchema>;

export const CoachingAvailabilityRuleSchema = z.object({
  id: z.string().uuid().optional(), providerId: CoachingProviderIdSchema, timeZone: z.string().min(1).max(100),
  weekday: z.number().int().min(0).max(6), startLocalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endLocalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), bufferMinutes: z.number().int().min(0).max(180),
  minimumNoticeMinutes: z.number().int().min(0).max(10080), maximumBookingDays: z.number().int().min(1).max(365),
});
export type CoachingAvailabilityRule = z.infer<typeof CoachingAvailabilityRuleSchema>;

export const CoachingAppointmentCreateSchema = z.object({
  kind: CoachingAppointmentKindSchema, providerId: CoachingProviderIdSchema, startTime: z.string().datetime(),
  durationMinutes: z.number().int().positive().max(120), meetingLink: z.string().url().optional(),
});
export type CoachingAppointmentCreate = z.infer<typeof CoachingAppointmentCreateSchema>;

/** Member scheduling never accepts duration or meeting links from the browser. */
export const CoachingSlotQuerySchema = z.object({
  providerId: CoachingProviderIdSchema,
  from: z.string().datetime(),
  to: z.string().datetime(),
}).refine(({ from, to }) => new Date(to) > new Date(from), { message: "to must be after from" });
export type CoachingSlotQuery = z.infer<typeof CoachingSlotQuerySchema>;
export const CoachingSlotSchema = z.object({
  providerId: CoachingProviderIdSchema, startTime: z.string().datetime(), endTime: z.string().datetime(),
});
export type CoachingSlot = z.infer<typeof CoachingSlotSchema>;
export const CoachingMemberBookingCreateSchema = z.object({ providerId: CoachingProviderIdSchema, startTime: z.string().datetime() });
export type CoachingMemberBookingCreate = z.infer<typeof CoachingMemberBookingCreateSchema>;
export const CoachingConsultationBookingCreateSchema = z.object({ leadId: z.string().uuid(), providerId: CoachingProviderIdSchema, startTime: z.string().datetime() });
export type CoachingConsultationBookingCreate = z.infer<typeof CoachingConsultationBookingCreateSchema>;
export const CoachingAppointmentRescheduleSchema = z.object({ startTime: z.string().datetime() });
export type CoachingAppointmentReschedule = z.infer<typeof CoachingAppointmentRescheduleSchema>;
export const CoachingAppointmentCancelSchema = z.object({ reason: z.string().trim().max(1000).optional() });
export type CoachingAppointmentCancel = z.infer<typeof CoachingAppointmentCancelSchema>;
export const CoachingAdminMemberBookingCreateSchema = z.object({ membershipId: z.string().uuid(), providerId: CoachingProviderIdSchema, startTime: z.string().datetime() });
export type CoachingAdminMemberBookingCreate = z.infer<typeof CoachingAdminMemberBookingCreateSchema>;
export const CoachingAppointmentListQuerySchema = z.object({ from: z.string().datetime(), to: z.string().datetime(), membershipId: z.string().uuid().optional(), leadId: z.string().uuid().optional() }).refine(({ from, to }) => new Date(to) > new Date(from), { message: "to must be after from" });
export type CoachingAppointmentListQuery = z.infer<typeof CoachingAppointmentListQuerySchema>;
export const CoachingAvailabilityOverrideCreateSchema = z.object({ providerId: CoachingProviderIdSchema, startsAt: z.string().datetime(), endsAt: z.string().datetime(), available: z.boolean() }).refine(({ startsAt, endsAt }) => new Date(endsAt) > new Date(startsAt), { message: "endsAt must be after startsAt" });
export type CoachingAvailabilityOverrideCreate = z.infer<typeof CoachingAvailabilityOverrideCreateSchema>;
export const CoachingAppointmentOutcomeSchema = z.object({ outcome: z.enum(["COMPLETED", "NO_SHOW", "CANCELLED"]), note: z.string().trim().max(2000).optional() });
export type CoachingAppointmentOutcome = z.infer<typeof CoachingAppointmentOutcomeSchema>;
export const CoachingHttpsUrlSchema = z.string().url().refine(
  (value) => new URL(value).protocol === "https:",
  { message: "URL must use HTTPS" },
);
/** Scheduling configuration is organization-owned. Passing null clears the meeting URL. */
export const CoachingSchedulingConfigurationUpdateSchema = z.object({
  consultationDurationMinutes: z.number().int().min(5).max(120),
  memberCallDurationMinutes: z.number().int().min(5).max(120),
  cancellationNoticeMinutes: z.number().int().min(0).max(10_080),
  reservationTtlMinutes: z.number().int().min(5).max(120),
  videoMeetingUrl: CoachingHttpsUrlSchema.nullable().optional(),
});
export type CoachingSchedulingConfigurationUpdate = z.infer<typeof CoachingSchedulingConfigurationUpdateSchema>;
export const CoachingAppointmentSchema = CoachingAppointmentCreateSchema.extend({
  id: z.string().uuid(), appointmentId: z.string().uuid(), status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  endTime: z.string().datetime(), creditStatus: z.enum(["AVAILABLE", "RESERVED", "CONSUMED", "RELEASED", "EXPIRED"]).nullable(),
});
export type CoachingAppointment = z.infer<typeof CoachingAppointmentSchema>;

export const CoachingCheckInSubmitSchema = z.object({
  whatWentWell: z.string().trim().max(4000), obstacles: z.string().trim().max(4000),
  actionProgress: z.string().trim().max(4000), helpNeeded: z.string().trim().max(4000),
});
export type CoachingCheckInSubmit = z.infer<typeof CoachingCheckInSubmitSchema>;
export const CoachingMessageCreateSchema = z.object({ body: z.string().trim().min(1).max(5000) });
export type CoachingMessageCreate = z.infer<typeof CoachingMessageCreateSchema>;

export const CoachingProgramSnapshotSchema = ProgramSchema.omit({
  id: true,
  userId: true,
  startDate: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});
export type CoachingProgramSnapshot = z.infer<typeof CoachingProgramSnapshotSchema>;

export const CoachingPlanAssignmentRequestSchema = z.object({
  assignmentId: z.string().uuid(), coachingMemberId: z.string().uuid(), appUserId: z.string().min(1).max(256),
  sourcePlanId: z.string().min(1).max(256), sourcePlanVersion: z.string().min(1).max(256),
  startDate: z.string().datetime(), assignedByUserId: userIdSchema,
  program: CoachingProgramSnapshotSchema,
});
export type CoachingPlanAssignmentRequest = z.infer<typeof CoachingPlanAssignmentRequestSchema>;

export const CoachingPlanAssignmentResponseSchema = z.object({
  assignmentId: z.string().uuid(), status: CoachingAssignmentStatusSchema,
  deliveredAt: z.string().datetime().nullable().optional(), acknowledgement: z.string().nullable().optional(),
});
export type CoachingPlanAssignmentResponse = z.infer<typeof CoachingPlanAssignmentResponseSchema>;

export const CoachingActiveAssignmentSchema = z.object({
  assignmentId: z.string().uuid(),
  programId: z.string().min(1),
  sourcePlanVersion: z.string().min(1),
  status: CoachingAssignmentStatusSchema,
  deliveredAt: z.string().datetime().nullable(),
  acknowledgedAt: z.string().datetime().nullable(),
  programName: z.string().min(1),
});
export type CoachingActiveAssignment = z.infer<typeof CoachingActiveAssignmentSchema>;

export const CoachingLinkConsumeRequestSchema = z.object({
  coachingMemberId: z.string().uuid(),
  code: z.string().trim().min(8).max(256),
});
export type CoachingLinkConsumeRequest = z.infer<typeof CoachingLinkConsumeRequestSchema>;
export const CoachingLinkConsumeResponseSchema = z.object({
  linked: z.literal(true), appUserId: z.string().min(1), linkedAt: z.string().datetime(),
});
export type CoachingLinkConsumeResponse = z.infer<typeof CoachingLinkConsumeResponseSchema>;

/** The invite token is opaque and binds only after Identity JWT verification. */
export const CoachingIdentityExchangeSchema = z.object({ inviteToken: z.string().min(32).max(512).optional() });
export type CoachingIdentityExchange = z.infer<typeof CoachingIdentityExchangeSchema>;

/** Admin-only creation of a one-time invite. The opaque token is response-only. */
export const CoachingInviteCreateSchema = z.object({
  leadId: z.string().uuid(),
  expiresInHours: z.number().int().min(1).max(24 * 30).optional(),
  adultConfirmed: z.literal(true),
  partnerEligibilityConfirmed: z.literal(true),
});
export type CoachingInviteCreate = z.infer<typeof CoachingInviteCreateSchema>;

export const COACHING_APP_ACCESS_STATUSES = ["ACTIVE", "REVOKED"] as const;
export const CoachingAppAccessStatusSchema = z.enum(COACHING_APP_ACCESS_STATUSES);
export type CoachingAppAccessStatus = z.infer<typeof CoachingAppAccessStatusSchema>;

/** Health-to-Workouts entitlement projection after a durable app link exists. */
export const CoachingAppAccessGrantRequestSchema = z.object({
  coachingMemberId: z.string().uuid(),
  paidThroughAt: z.string().datetime().nullable(),
  status: CoachingAppAccessStatusSchema,
  sourceVersion: z.string().trim().min(1).max(256),
  sourceUpdatedAt: z.string().datetime(),
});
export type CoachingAppAccessGrantRequest = z.infer<typeof CoachingAppAccessGrantRequestSchema>;

export const CoachingAppAccessGrantResponseSchema = CoachingAppAccessGrantRequestSchema.extend({
  appUserId: z.string().min(1).max(256),
  updatedAt: z.string().datetime(),
});
export type CoachingAppAccessGrantResponse = z.infer<typeof CoachingAppAccessGrantResponseSchema>;

export const CoachingLinkCodeSchema = z.object({ code: z.string().trim().min(8).max(256) });
export type CoachingLinkCode = z.infer<typeof CoachingLinkCodeSchema>;

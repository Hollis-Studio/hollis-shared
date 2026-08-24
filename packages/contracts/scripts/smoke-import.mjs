const imports = [
  ["@hollis-studio/contracts", ["USER_TIER", "unwrapEnvelope"]],
  ["@hollis-studio/contracts/api", ["API_ROUTES", "unwrapEnvelope"]],
  ["@hollis-studio/contracts/domain", ["USER_TIER", "MASTER_OFFER_SHEET"]],
  ["@hollis-studio/contracts/schemas", ["emailSchema"]],
  ["@hollis-studio/contracts/constants", ["STORAGE_KEYS"]],
  ["@hollis-studio/contracts/admin", ["patientSummarySchema"]],
  [
    "@hollis-studio/contracts/admin/legal-documents",
    ["DOCUMENT_REGISTRY", "renderSignedDocumentContent"],
  ],
  ["@hollis-studio/contracts/ai", ["GeneratedExerciseSchema"]],
  ["@hollis-studio/contracts/public", ["ContactFormSchema"]],
  ["@hollis-studio/contracts/stripe", ["SubscriptionStatusSchema"]],
  ["@hollis-studio/contracts/password", ["passwordSchema"]],
  ["@hollis-studio/contracts/primitives", ["VolumeLevelSchema"]],
  ["@hollis-studio/contracts/errors", ["ApiError"]],
  ["@hollis-studio/contracts/api/routes/auth", ["AUTH_ROUTES"]],
  ["@hollis-studio/contracts/api/workouts-envelope", ["WorkoutsErrorEnvelopeSchema", "unwrapWorkoutsEnvelope"]],
  // Every subpath the hollis-workouts wire-contracts registry declares
  // (scripts/checks/wire-contracts-registry.json). Its WC-2 rule imports these
  // from the INSTALLED package, so a dist/exports regression here is a red
  // Workouts CI — pin them at publish time instead.
  ["@hollis-studio/contracts/domain/gym", ["GymProfileSchema", "GymExerciseInstanceSchema"]],
  ["@hollis-studio/contracts/domain/exercise-workouts", ["CanonicalExerciseRecordSchema"]],
  ["@hollis-studio/contracts/domain/training-session-log", ["ActiveTrainingSessionLogSchema"]],
  ["@hollis-studio/contracts/domain/workouts-user-profile", ["WorkoutsUserProfileSchema", "WorkoutsUserProfilePutBodySchema"]],
  ["@hollis-studio/contracts/domain/workouts-injuries", ["InjuryRecordBodySchema"]],
  ["@hollis-studio/contracts/domain/workouts-weeks", ["WeekDocumentSchema", "WeekDocumentBodySchema"]],
  ["@hollis-studio/contracts/domain/workouts-conversation-summary", ["ConversationRollingSummarySchema", "ConversationRollingSummaryBodySchema"]],
  ["@hollis-studio/contracts/domain/workouts-account", ["WorkoutsAccountDeletionAckSchema", "WORKOUTS_ACCOUNT_DELETION_ACK_VERSION"]],
  ["@hollis-studio/contracts/ai/persistence", ["AiAuditLogEntrySchema", "AiAuditLogCreateSchema"]],
  ["@hollis-studio/contracts/ai/workout-ai-wire", ["RecognizeEquipmentBodySchema"]],
  ["@hollis-studio/contracts/progression/baseline", ["ProgressionBaselineSchema", "CardioBaselineSchema"]],
  ["@hollis-studio/contracts/progression/program", ["ProgramSchema"]],
  ["@hollis-studio/contracts/progression/metrics", ["MetricBasketSnapshotRecordSchema"]],
  ["@hollis-studio/contracts/revenuecat", ["RevenueCatWebhookRequestSchema", "RevenueCatWebhookAckSchema"]],
  ["@hollis-studio/contracts/error-sanitization", ["sanitizeErrorMessage"]],
  ["@hollis-studio/contracts/sentry-sanitization", ["sanitizeSentryEvent"]],
];

for (const [specifier, expectedExports] of imports) {
  const module = await import(specifier);

  for (const exportName of expectedExports) {
    if (!(exportName in module)) {
      throw new Error(`${specifier} missing expected export ${exportName}`);
    }
  }
}

process.stdout.write("shared/contracts dist ESM smoke import passed\n");

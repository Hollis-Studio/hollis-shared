const imports = [
  ["@hollis-studio/contracts", ["USER_TIER", "unwrapEnvelope"]],
  ["@hollis-studio/contracts/api", ["API_ROUTES", "unwrapEnvelope"]],
  ["@hollis-studio/contracts/domain", ["USER_TIER", "MASTER_OFFER_SHEET"]],
  ["@hollis-studio/contracts/schemas", ["emailSchema"]],
  ["@hollis-studio/contracts/constants", ["STORAGE_KEYS"]],
  ["@hollis-studio/contracts/admin", ["patientSummarySchema"]],
  ["@hollis-studio/contracts/ai", ["GeneratedExerciseSchema"]],
  ["@hollis-studio/contracts/public", ["ContactFormSchema"]],
  ["@hollis-studio/contracts/stripe", ["SubscriptionStatusSchema"]],
  ["@hollis-studio/contracts/password", ["passwordSchema"]],
  ["@hollis-studio/contracts/primitives", ["VolumeLevelSchema"]],
  ["@hollis-studio/contracts/errors", ["ApiError"]],
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

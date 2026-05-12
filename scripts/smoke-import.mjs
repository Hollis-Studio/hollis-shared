const imports = [
  ["@hollis/contracts", ["USER_TIER", "unwrapEnvelope"]],
  ["@hollis/contracts/api", ["API_ROUTES", "unwrapEnvelope"]],
  ["@hollis/contracts/domain", ["USER_TIER", "MASTER_OFFER_SHEET"]],
  ["@hollis/contracts/schemas", ["emailSchema"]],
  ["@hollis/contracts/constants", ["STORAGE_KEYS"]],
  ["@hollis/contracts/admin", ["patientSummarySchema"]],
  ["@hollis/contracts/ai", ["GeneratedExerciseSchema"]],
  ["@hollis/contracts/public", ["ContactFormSchema"]],
  ["@hollis/contracts/stripe", ["SubscriptionStatusSchema"]],
  ["@hollis/contracts/password", ["passwordSchema"]],
  ["@hollis/contracts/primitives", ["VolumeLevelSchema"]],
  ["@hollis/contracts/errors", ["ApiError"]],
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

import { APP_REVIEW_ACCOUNTS } from "../domain/app-review";

describe("App review credential contracts", () => {
  it("exposes the canonical primaryClient reviewer account", () => {
    expect(APP_REVIEW_ACCOUNTS.primaryClient.id).toBe("HH-REV001");
    expect(APP_REVIEW_ACCOUNTS.primaryClient.email).toBe(
      "testuser@hollis.health",
    );
  });

  it("exposes the canonical reviewerAdmin account", () => {
    expect(APP_REVIEW_ACCOUNTS.reviewerAdmin.id).toBe("HH-REV002");
    expect(APP_REVIEW_ACCOUNTS.reviewerAdmin.email).toBe(
      "testadmin@hollis.health",
    );
  });

  // APP_REVIEW_PASSWORD and APP_REVIEW_CREDENTIALS have been removed from the
  // public contracts package. The password is now read from the
  // APP_REVIEW_PASSWORD environment variable in server-side seed scripts only.
  // Mobile and web-admin bundles must never import the password.
});

import {
  APP_REVIEW_ACCOUNTS,
  APP_REVIEW_CREDENTIALS,
  APP_REVIEW_PASSWORD,
} from "../domain/app-review";

describe("App review credential contracts", () => {
  it("keeps credential emails aligned with the canonical reviewer accounts", () => {
    expect(APP_REVIEW_CREDENTIALS.primaryClient.email).toBe(
      APP_REVIEW_ACCOUNTS.primaryClient.email,
    );
    expect(APP_REVIEW_CREDENTIALS.reviewerAdmin.email).toBe(
      APP_REVIEW_ACCOUNTS.reviewerAdmin.email,
    );
  });

  it("shares one published password across both reviewer accounts", () => {
    expect(APP_REVIEW_CREDENTIALS.primaryClient.password).toBe(
      APP_REVIEW_PASSWORD,
    );
    expect(APP_REVIEW_CREDENTIALS.reviewerAdmin.password).toBe(
      APP_REVIEW_PASSWORD,
    );
  });
});

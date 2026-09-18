import { COACHING_CALLS_PER_SERVICE_WINDOW, COACHING_INITIAL_TERM_CALLS, COACHING_INITIAL_TERM_DAYS, COACHING_SERVICE_WINDOW_DAYS } from "../domain/coaching.js";

describe("weekly coaching offer", () => {
  it("provides one call per seven-day window throughout the exact 90-day first term", () => {
    expect(COACHING_CALLS_PER_SERVICE_WINDOW).toBe(1);
    expect(COACHING_SERVICE_WINDOW_DAYS).toBe(7);
    expect(COACHING_INITIAL_TERM_DAYS).toBe(90);
    expect(COACHING_INITIAL_TERM_CALLS).toBe(13);
  });
});

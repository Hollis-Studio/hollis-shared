/**
 * @ai-context Workouts launch-pricing wire shapes | the informational
 * lifetime-seat counter behind `GET /v1/pricing/lifetime-availability` on the
 * Hollis Workouts server (hollis-workouts#89).
 *
 * The lifetime SKU (`hollis_workouts_intelligence_lifetime`, $199.99 one-time)
 * is capped at a fixed number of seats. The cap and the count live on the
 * server — one row per completed store purchase, written from the RevenueCat
 * webhook — so the number the paywall shows is always REAL (App Store
 * guideline 2.3 / FTC: no fabricated scarcity). The client never computes or
 * caches the cap; it renders what this response says and hides the lifetime
 * option entirely when `available` is false or the fetch fails (fail closed).
 *
 * `claimed` counts non-refunded production purchases, so it can go DOWN when
 * a seat is refunded. That is accurate and intended.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export declare const LifetimeAvailabilityResponseSchema: z.ZodObject<{
    claimed: z.ZodNumber;
    cap: z.ZodNumber;
    available: z.ZodBoolean;
}, z.core.$strip>;
export type LifetimeAvailabilityResponse = z.infer<typeof LifetimeAvailabilityResponseSchema>;
//# sourceMappingURL=workouts-pricing.d.ts.map
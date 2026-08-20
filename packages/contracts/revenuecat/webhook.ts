/**
 * @ai-context RevenueCat server-to-server webhook wire contract |
 * RevenueCatWebhookRequestSchema, RevenueCatWebhookEventSchema,
 * RevenueCatWebhookAckSchema, REVENUECAT_WEBHOOK_EVENT_TYPES.
 *
 * Tolerant-reader by design: RevenueCat adds event types and fields over
 * time, and a webhook receiver that 400s an unknown-but-well-formed event
 * makes RevenueCat retry (and eventually alert) on traffic the receiver
 * simply doesn't care about yet. `type` is therefore an open string with a
 * known-values const for handler switches, and both objects passthrough
 * unknown keys. Authentication is NOT part of this schema — the receiver
 * must verify the configured Authorization header before parsing.
 *
 * deps: zod
 * consumers: hollis-workouts server (POST /v1/webhooks/revenuecat)
 */
import { z } from 'zod';

/**
 * Event types this suite's receivers act on today. Deliberately NOT a
 * z.enum — an unknown type must still parse (and be acked) so RevenueCat
 * does not retry events we merely ignore. Use for exhaustive-ish switches:
 * `if (isKnownRevenueCatEventType(event.type)) ...`.
 */
export const REVENUECAT_WEBHOOK_EVENT_TYPES = [
  'TEST',
  'INITIAL_PURCHASE',
  'RENEWAL',
  'NON_RENEWING_PURCHASE',
  'CANCELLATION',
  'UNCANCELLATION',
  'EXPIRATION',
  'BILLING_ISSUE',
  'PRODUCT_CHANGE',
  'SUBSCRIPTION_PAUSED',
  'SUBSCRIPTION_EXTENDED',
  'TRANSFER',
] as const;
export type RevenueCatWebhookEventType =
  (typeof REVENUECAT_WEBHOOK_EVENT_TYPES)[number];

export function isKnownRevenueCatEventType(
  type: string,
): type is RevenueCatWebhookEventType {
  return (REVENUECAT_WEBHOOK_EVENT_TYPES as readonly string[]).includes(type);
}

/**
 * One webhook event. Only `type` is required: TRANSFER events carry
 * `transferred_from`/`transferred_to` arrays instead of `app_user_id`, and
 * RevenueCat nulls fields freely across stores, so everything else is
 * optional + nullish-tolerant.
 */
export const RevenueCatWebhookEventSchema = z
  .object({
    type: z.string().min(1),
    id: z.string().nullish(),
    event_timestamp_ms: z.number().nullish(),
    app_id: z.string().nullish(),
    app_user_id: z.string().nullish(),
    original_app_user_id: z.string().nullish(),
    aliases: z.array(z.string()).nullish(),
    product_id: z.string().nullish(),
    entitlement_ids: z.array(z.string()).nullish(),
    period_type: z.string().nullish(),
    purchased_at_ms: z.number().nullish(),
    expiration_at_ms: z.number().nullish(),
    /** 'SANDBOX' | 'PRODUCTION' — open string for forward-compat. */
    environment: z.string().nullish(),
    store: z.string().nullish(),
    transaction_id: z.string().nullish(),
    original_transaction_id: z.string().nullish(),
    /** CANCELLATION events. */
    cancel_reason: z.string().nullish(),
    /** EXPIRATION events. */
    expiration_reason: z.string().nullish(),
    /** PRODUCT_CHANGE events. */
    new_product_id: z.string().nullish(),
    /** BILLING_ISSUE events. */
    grace_period_expiration_at_ms: z.number().nullish(),
    /** SUBSCRIPTION_PAUSED events. */
    auto_resume_at_ms: z.number().nullish(),
    /** TRANSFER events — the user ids the entitlement moved between. */
    transferred_from: z.array(z.string()).nullish(),
    transferred_to: z.array(z.string()).nullish(),
    country_code: z.string().nullish(),
    currency: z.string().nullish(),
    price: z.number().nullish(),
    price_in_purchased_currency: z.number().nullish(),
    is_family_share: z.boolean().nullish(),
    offer_code: z.string().nullish(),
    presented_offering_id: z.string().nullish(),
  })
  .passthrough();
export type RevenueCatWebhookEvent = z.infer<
  typeof RevenueCatWebhookEventSchema
>;

/** Full POST body: `{ api_version: "1.0", event: {...} }`. */
export const RevenueCatWebhookRequestSchema = z
  .object({
    api_version: z.string().nullish(),
    event: RevenueCatWebhookEventSchema,
  })
  .passthrough();
export type RevenueCatWebhookRequest = z.infer<
  typeof RevenueCatWebhookRequestSchema
>;

/**
 * 200 ack body. RevenueCat only inspects the status code, but WC-1..WC-4
 * require every response body to round-trip a contract schema.
 */
export const RevenueCatWebhookAckSchema = z.object({
  received: z.literal(true),
});
export type RevenueCatWebhookAck = z.infer<typeof RevenueCatWebhookAckSchema>;

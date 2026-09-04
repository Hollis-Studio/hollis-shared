/**
 * @ai-context AI token pricing + USD cost estimation | MODEL_PRICING,
 * DEFAULT_PRICING, estimateCostUsd, estimateCostUsdDetailed,
 * estimateUsageCostUsd, longContextThresholdFor.
 *
 * Single source of truth for provider rates across the suite. It lives in
 * contracts rather than in either app because BOTH sides price the same
 * recorded rows and must agree to the cent:
 *   - hollis-workouts mobile: the Token Usage dashboard's "≈ $X" labels
 *     (src/utils/aiPricing.ts re-exports this module).
 *   - hollis-workouts server: the per-entitlement monthly COST budget in
 *     middleware/aiRateLimit.ts. Server isolation forbids the server importing
 *     app `src/`, so before this module the only way to give the server a price
 *     table was a second copy that nothing could keep in step.
 *
 * These numbers drive a spend ESTIMATE and a soft cost guard. They are never
 * used for billing, and an unrecognised model deliberately OVER-estimates
 * (DEFAULT_PRICING) so unattributed spend can never look cheaper than it is.
 *
 * deps: (none — pure arithmetic)
 * consumers: hollis-workouts server + mobile client
 */

/** USD per 1,000,000 tokens, by priced dimension. */
export interface ModelPricing {
  /** USD per 1,000,000 input (prompt) tokens — text / image / video. */
  inputPerMillion: number;
  /** USD per 1,000,000 output (completion + thinking) tokens. */
  outputPerMillion: number;
  /** USD per 1,000,000 prompt tokens served from context cache. */
  cachedInputPerMillion?: number;
  /** USD per 1,000,000 AUDIO input tokens, where the model prices audio apart. */
  audioInputPerMillion?: number;
  /** USD per 1,000,000 cached audio input tokens. */
  cachedAudioInputPerMillion?: number;
  /** Prompt size at which the long-context tier takes over (exclusive). */
  longContextThresholdTokens?: number;
  /** USD per 1,000,000 input tokens above longContextThresholdTokens. */
  longContextInputPerMillion?: number;
  /** USD per 1,000,000 output tokens for a prompt above the threshold. */
  longContextOutputPerMillion?: number;
  /** USD per 1,000,000 cached input tokens for a prompt above the threshold. */
  longContextCachedInputPerMillion?: number;
  /** USD per 1,000,000 tokens per hour of context-cache storage. */
  cacheStoragePerMillionPerHour?: number;
}

/** Token counts for a cost estimate that distinguishes cache and modality. */
export interface DetailedTokenCounts {
  /** Non-cached text / image / video prompt tokens. */
  inputTokens: number;
  /** Output (completion + thinking) tokens. */
  outputTokens: number;
  /** Prompt tokens served from context cache (text / image / video). */
  cachedInputTokens?: number;
  /** Non-cached AUDIO prompt tokens. */
  audioInputTokens?: number;
  /** Audio prompt tokens served from context cache. */
  cachedAudioInputTokens?: number;
  /** Token-hours of context-cache storage to bill (tokens × hours held). */
  cacheStorageTokenHours?: number;
  /**
   * Total prompt size used to pick the long-context tier. Defaults to the sum
   * of the prompt components above.
   */
  promptTokens?: number;
}

/**
 * The long-context slice of a cumulative recorded entry: the counters
 * contributed by calls whose own prompt crossed the model's
 * `longContextThresholdTokens`. Every field is a SUBSET of the same-named
 * field on the parent entry.
 *
 * This exists because the >200k tier is a per-REQUEST property. A month of
 * small calls sums past 200k without any single prompt doing so, so an
 * aggregate cannot reconstruct which tokens were billed at the long-context
 * rate — it has to be decided at record time and carried. Mirrors
 * AiLongContextUsageSchema in ./persistence.ts.
 */
export interface LongContextCounts {
  input: number;
  output: number;
  cachedInput?: number;
  audioInput?: number;
  cachedAudioInput?: number;
}

/**
 * Cumulative recorded token counts for one feature or one model over a month,
 * as written by the server accumulator (mirrors AiFeatureModelUsage in
 * ./persistence.ts).
 *
 * `cachedInput`, `audioInput`, `cachedAudioInput` and `imageInput` are SUBSETS
 * of `input` — the recorder keeps `input` equal to the provider's
 * promptTokenCount so the field never changes meaning between rows — and are
 * absent (treated as 0) on rows written before the contract carried them.
 */
export interface RecordedUsageCounts {
  input: number;
  output: number;
  cachedInput?: number;
  audioInput?: number;
  cachedAudioInput?: number;
  /**
   * Non-cached IMAGE / VIDEO prompt tokens. Recorded for attribution only:
   * Gemini prices image and video at the plain text input rate, so this
   * counter is inside the plain-input remainder and changes no number here.
   */
  imageInput?: number;
  /** Counters contributed by calls that crossed the long-context threshold. */
  longContext?: LongContextCounts;
  /** Token-hours of explicit context-cache storage attributable to this entry. */
  cacheStorageTokenHours?: number;
}

const MILLION = 1_000_000;

/**
 * Gemini pricing, USD per 1M tokens, STANDARD (non-batch) paid tier.
 * Source: https://ai.google.dev/gemini-api/docs/pricing — verified 2026-08-17.
 * Keys are the model identifiers passed to the server-side recorder (see server
 * env GEMINI_MODEL / GEMINI_EMBEDDING_MODEL).
 *
 * TIME-BOXED RATE — `gemini-3.7-flash` and `gemini-3.6-flash` are discounted
 * THROUGH 2026-12-31 and double on 2027-01-01 (input 0.75 → 1.50, output
 * 3.75 → 7.50, cached 0.075 → 0.15, cache storage 0.50 → 1.00). The values
 * below are the CURRENT (discounted) rates; a reader after that date must step
 * them up rather than assume the table is simply wrong.
 *
 * `gemini-3.6-flash` is retained after the 2026-08-17 default bump to
 * `gemini-3.7-flash` because the server accumulator stores the model string on
 * every historical AiTokenUsage row — dropping the key would silently reprice
 * months of recorded spend at the conservative DEFAULT_PRICING.
 *
 * `gemini-3.1-flash` (no suffix) was removed on 2026-08-14: it is not on the
 * price sheet, is not referenced anywhere in the repo, and carried an
 * unsourced estimate. Unknown keys now fall to the conservative DEFAULT_PRICING.
 */
export const MODEL_PRICING: Readonly<Record<string, ModelPricing>> = {
  'gemini-3.1-pro-preview': {
    inputPerMillion: 2.0,
    outputPerMillion: 12.0,
    cachedInputPerMillion: 0.2,
    longContextThresholdTokens: 200_000,
    longContextInputPerMillion: 4.0,
    longContextOutputPerMillion: 18.0,
    longContextCachedInputPerMillion: 0.4,
    cacheStoragePerMillionPerHour: 4.5,
  },
  // Current unified default (server env GEMINI_MODEL). Rates are identical to
  // gemini-3.6-flash on the 2026-08-17 price sheet: no audio-specific rate and
  // no long-context tier, so the >200k pricing step does not apply.
  'gemini-3.7-flash': {
    inputPerMillion: 0.75,
    outputPerMillion: 3.75,
    cachedInputPerMillion: 0.075,
    cacheStoragePerMillionPerHour: 0.5,
  },
  'gemini-3.6-flash': {
    inputPerMillion: 0.75,
    outputPerMillion: 3.75,
    cachedInputPerMillion: 0.075,
    cacheStoragePerMillionPerHour: 0.5,
  },
  'gemini-3.5-flash': {
    inputPerMillion: 1.5,
    outputPerMillion: 9.0,
    cachedInputPerMillion: 0.15,
    cacheStoragePerMillionPerHour: 1.0,
  },
  'gemini-3.1-flash-lite': {
    inputPerMillion: 0.25,
    outputPerMillion: 1.5,
    cachedInputPerMillion: 0.025,
    audioInputPerMillion: 0.5,
    cachedAudioInputPerMillion: 0.05,
    cacheStoragePerMillionPerHour: 1.0,
  },
  'gemini-embedding-001': {
    inputPerMillion: 0.15,
    outputPerMillion: 0,
  },
};

/**
 * Fallback when a model is unknown/unrecorded ("unknown" key, legacy rows).
 *
 * INVARIANT: every rate here is >= the corresponding MAXIMUM rate anywhere in
 * MODEL_PRICING, long-context tiers included, so an unattributed row can only
 * ever over-estimate. Derivation: input 4.00 and output 18.00 are
 * gemini-3.1-pro-preview's long-context rates; `cacheStoragePerMillionPerHour`
 * matches its 4.50 so cache storage is not billed as free for an unknown
 * model. Cached/audio dimensions are deliberately left unset:
 * estimateCostUsdDetailed then charges them at the (higher) plain input rate.
 * Raise this table whenever a costlier model is registered.
 */
export const DEFAULT_PRICING: ModelPricing = {
  inputPerMillion: 4.0,
  outputPerMillion: 18.0,
  cacheStoragePerMillionPerHour: 4.5,
};

function pricingFor(model: string): ModelPricing {
  return MODEL_PRICING[model] ?? DEFAULT_PRICING;
}

/**
 * Prompt size (exclusive) at which `model` starts billing the long-context
 * tier, or undefined when the model has no such tier. The server calls this at
 * RECORD time to decide whether one call's counters belong in the
 * `longContext` bucket — the only moment the per-request prompt size is known.
 */
export function longContextThresholdFor(model: string): number | undefined {
  return pricingFor(model).longContextThresholdTokens;
}

/** Estimated USD cost for one model's input/output token counts. */
export function estimateCostUsd(input: number, output: number, model: string): number {
  const price = pricingFor(model);
  return (input / MILLION) * price.inputPerMillion + (output / MILLION) * price.outputPerMillion;
}

/**
 * Estimated USD cost from aggregate input/output totals using DEFAULT_PRICING.
 * Use the per-model `estimateCostUsd` when a model breakdown is available — this
 * is the coarse fallback for legacy rows that carry no model attribution.
 */
export function estimateCostUsdFromTotals(input: number, output: number): number {
  return estimateCostUsd(input, output, 'unknown');
}

/** Resolved per-class rates for one tier (standard or long-context). */
interface TierRates {
  input: number;
  output: number;
  cached: number;
  audio: number;
  cachedAudio: number;
}

function ratesFor(price: ModelPricing, isLongContext: boolean): TierRates {
  const input =
    isLongContext && price.longContextInputPerMillion !== undefined
      ? price.longContextInputPerMillion
      : price.inputPerMillion;
  const output =
    isLongContext && price.longContextOutputPerMillion !== undefined
      ? price.longContextOutputPerMillion
      : price.outputPerMillion;
  const cached =
    isLongContext && price.longContextCachedInputPerMillion !== undefined
      ? price.longContextCachedInputPerMillion
      : (price.cachedInputPerMillion ?? input);
  return {
    input,
    output,
    cached,
    audio: price.audioInputPerMillion ?? input,
    cachedAudio: price.cachedAudioInputPerMillion ?? cached,
  };
}

/**
 * Estimated USD cost across every priced dimension: cached vs uncached input,
 * audio vs text/image/video, the >200k long-context tier, and context-cache
 * storage. Falls back to the flat input rate for any dimension the model does
 * not price separately, so a model without an audio or cache rate is charged as
 * plain input rather than silently free.
 *
 * `inputTokens` here is the NON-CACHED TEXT/IMAGE/VIDEO remainder, not the whole
 * prompt — the cached and audio counts are passed alongside it.
 */
export function estimateCostUsdDetailed(counts: DetailedTokenCounts, model: string): number {
  const price = pricingFor(model);

  const cachedInput = counts.cachedInputTokens ?? 0;
  const audioInput = counts.audioInputTokens ?? 0;
  const cachedAudioInput = counts.cachedAudioInputTokens ?? 0;
  const promptTokens =
    counts.promptTokens ?? counts.inputTokens + cachedInput + audioInput + cachedAudioInput;

  const threshold = price.longContextThresholdTokens;
  const rates = ratesFor(price, threshold !== undefined && promptTokens > threshold);

  const storageCost =
    price.cacheStoragePerMillionPerHour !== undefined
      ? ((counts.cacheStorageTokenHours ?? 0) / MILLION) * price.cacheStoragePerMillionPerHour
      : 0;

  return (
    (counts.inputTokens / MILLION) * rates.input +
    (counts.outputTokens / MILLION) * rates.output +
    (cachedInput / MILLION) * rates.cached +
    (audioInput / MILLION) * rates.audio +
    (cachedAudioInput / MILLION) * rates.cachedAudio +
    storageCost
  );
}

function nonNegTokens(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/** One tier's slice of a cumulative entry. `input` is the WHOLE prompt total. */
interface TierBucket {
  input: number;
  output: number;
  cachedInput: number;
  audioInput: number;
  cachedAudioInput: number;
}

function costForBucket(price: ModelPricing, isLongContext: boolean, bucket: TierBucket): number {
  const rates = ratesFor(price, isLongContext);
  const plainInput = Math.max(
    0,
    bucket.input - bucket.cachedInput - bucket.audioInput - bucket.cachedAudioInput,
  );
  return (
    (plainInput / MILLION) * rates.input +
    (bucket.output / MILLION) * rates.output +
    (bucket.cachedInput / MILLION) * rates.cached +
    (bucket.audioInput / MILLION) * rates.audio +
    (bucket.cachedAudioInput / MILLION) * rates.cachedAudio
  );
}

/**
 * Estimated USD cost for a CUMULATIVE recorded usage entry (one feature or one
 * model over a month). Splits `input` into its priced classes: the cached and
 * audio counters are subsets, so the remainder is what gets charged at the plain
 * text-input rate.
 *
 * The long-context tier is applied ONLY to the `longContext` sub-bucket the
 * recorder classified at request time. It is never inferred from the aggregate:
 * a month of small calls sums past 200k without any single prompt doing so, and
 * inferring the tier from that would over-price by up to 2x.
 *
 * Entries with no breakdown at all (every row written before the enriched
 * counters existed) short-circuit to `estimateCostUsd`, so this is
 * byte-identical to the pre-breakdown behaviour for historical data.
 */
export function estimateUsageCostUsd(usage: RecordedUsageCounts, model: string): number {
  const input = nonNegTokens(usage.input);
  const output = nonNegTokens(usage.output);
  const cachedInput = nonNegTokens(usage.cachedInput);
  const audioInput = nonNegTokens(usage.audioInput);
  const cachedAudioInput = nonNegTokens(usage.cachedAudioInput);

  const lc = usage.longContext;
  const lcInput = Math.min(nonNegTokens(lc?.input), input);
  const lcOutput = Math.min(nonNegTokens(lc?.output), output);
  const lcCachedInput = Math.min(nonNegTokens(lc?.cachedInput), cachedInput);
  const lcAudioInput = Math.min(nonNegTokens(lc?.audioInput), audioInput);
  const lcCachedAudioInput = Math.min(nonNegTokens(lc?.cachedAudioInput), cachedAudioInput);

  const hasLongContext = lcInput > 0 || lcOutput > 0;
  const hasBreakdown = cachedInput + audioInput + cachedAudioInput > 0;
  const storageTokenHours = nonNegTokens(usage.cacheStorageTokenHours);

  if (!hasLongContext && !hasBreakdown && storageTokenHours === 0) {
    return estimateCostUsd(input, output, model);
  }

  const price = pricingFor(model);
  const standard = costForBucket(price, false, {
    input: input - lcInput,
    output: output - lcOutput,
    cachedInput: cachedInput - lcCachedInput,
    audioInput: audioInput - lcAudioInput,
    cachedAudioInput: cachedAudioInput - lcCachedAudioInput,
  });
  const long = hasLongContext
    ? costForBucket(price, true, {
        input: lcInput,
        output: lcOutput,
        cachedInput: lcCachedInput,
        audioInput: lcAudioInput,
        cachedAudioInput: lcCachedAudioInput,
      })
    : 0;
  const storage =
    price.cacheStoragePerMillionPerHour !== undefined
      ? (storageTokenHours / MILLION) * price.cacheStoragePerMillionPerHour
      : 0;

  return standard + long + storage;
}

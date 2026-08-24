/**
 * @ai-context Workouts REST envelope (alpha.56, hollis-workouts#43)
 *
 * The Hollis Workouts server wraps every `/v1/**` response in `{ ok, data|err }`
 * while Hollis Health / Identity use `{ success, data }` + a flat `error`
 * string. Before alpha.56 the Workouts envelope had no contracts owner and was
 * hand-mirrored in four places across two repos, so nothing detected drift
 * between the server's emitter and the mobile client's parser.
 *
 * These tests pin the divergence deliberately: they fail if the two envelopes
 * are ever accidentally unified, or if the Workouts shape drifts.
 */

import { z } from 'zod';

import { unwrapEnvelope } from '../api/response';
import {
  WorkoutsErrorDetailSchema,
  WorkoutsErrorEnvelopeSchema,
  createWorkoutsSuccessEnvelopeSchema,
  isWorkoutsErrorEnvelope,
  unwrapWorkoutsEnvelope,
} from '../api/workouts-envelope';
import type { WorkoutsSuccessEnvelope } from '../api/workouts-envelope';

describe('Workouts error envelope', () => {
  it('accepts the shape AppError.toJSON() emits', () => {
    expect(
      WorkoutsErrorEnvelopeSchema.safeParse({
        ok: false,
        err: { code: 'NOT_FOUND', message: 'Gym not found' },
      }).success,
    ).toBe(true);
  });

  it('carries AppError details through untouched', () => {
    const parsed = WorkoutsErrorEnvelopeSchema.parse({
      ok: false,
      err: {
        code: 'VALIDATION_FAILED',
        message: 'Invalid body',
        details: [{ path: ['name'], code: 'too_small' }],
      },
    });

    expect(parsed.err.details).toEqual([{ path: ['name'], code: 'too_small' }]);
  });

  it('rejects the Health flat-error envelope (the two must not converge)', () => {
    expect(
      WorkoutsErrorEnvelopeSchema.safeParse({ success: false, error: 'Gym not found' }).success,
    ).toBe(false);
  });

  it('rejects ok:true and an empty error code', () => {
    expect(
      WorkoutsErrorEnvelopeSchema.safeParse({ ok: true, err: { code: 'X', message: 'y' } }).success,
    ).toBe(false);
    expect(WorkoutsErrorDetailSchema.safeParse({ code: '', message: 'y' }).success).toBe(false);
  });

  it('narrows unknown bodies with isWorkoutsErrorEnvelope', () => {
    const body: unknown = { ok: false, err: { code: 'ENTITLEMENT_REQUIRED', message: 'Upgrade' } };

    expect(isWorkoutsErrorEnvelope(body)).toBe(true);
    if (isWorkoutsErrorEnvelope(body)) expect(body.err.code).toBe('ENTITLEMENT_REQUIRED');

    expect(isWorkoutsErrorEnvelope({ ok: true, data: 1 })).toBe(false);
    expect(isWorkoutsErrorEnvelope(null)).toBe(false);
  });
});

describe('Workouts success envelope', () => {
  const GymSchema = z.object({ id: z.string(), name: z.string() });

  it('validates a whole response body around a payload schema', () => {
    const schema = createWorkoutsSuccessEnvelopeSchema(GymSchema);

    expect(schema.safeParse({ ok: true, data: { id: 'g1', name: 'Home' } }).success).toBe(true);
    expect(schema.safeParse({ ok: true, data: { id: 'g1' } }).success).toBe(false);
    expect(schema.safeParse({ success: true, data: { id: 'g1', name: 'Home' } }).success).toBe(
      false,
    );
  });

  it('unwraps ok-enveloped payloads and passes bare values through', () => {
    const enveloped: WorkoutsSuccessEnvelope<{ id: string }> = { ok: true, data: { id: 'g1' } };

    expect(unwrapWorkoutsEnvelope(enveloped)).toEqual({ id: 'g1' });
    expect(unwrapWorkoutsEnvelope({ id: 'g1' })).toEqual({ id: 'g1' });
  });

  it('leaves an already-unwrapped paginated page alone', () => {
    const page = { data: [{ id: 'g1' }], pagination: { limit: 50, hasMore: false } };

    expect(unwrapWorkoutsEnvelope(page)).toBe(page);
  });

  it('does not unwrap the other suite envelope, and vice versa', () => {
    // Each unwrapper is a no-op on the other server's shape — which is exactly
    // why apiClient must pick by base URL rather than trying one and falling
    // back to the other.
    const health = { success: true, data: { id: 'h1' } };
    const workouts = { ok: true, data: { id: 'w1' } };

    expect(unwrapWorkoutsEnvelope(health)).toBe(health);
    expect(unwrapEnvelope(workouts)).toBe(workouts);
  });
});

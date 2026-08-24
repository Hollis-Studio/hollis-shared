/**
 * @ai-context Workouts account-deletion acknowledgement (alpha.56, hollis-workouts#43)
 *
 * `DELETE /v1/users/me` used to answer `204 No Content`, which left the single
 * destructive endpoint in the Workouts API as the only route no contract could
 * describe — the last straggler in that repo's wire-contracts registry. These
 * tests pin the 200 acknowledgement that replaced it, and pin the deliberate
 * open-endedness of `deletedModels` (a user-scoped Prisma table must be addable
 * without a contracts release).
 */

import {
  WORKOUTS_ACCOUNT_DELETION_ACK_VERSION,
  WorkoutsAccountDeletionAckSchema,
} from '../domain/workouts-account';

const valid = {
  deleted: true as const,
  userId: 'user_123',
  deletedAt: '2026-08-24T17:04:05.000Z',
  deletedModels: { session: 412, gym: 3, userProfile: 1 },
  ackVersion: WORKOUTS_ACCOUNT_DELETION_ACK_VERSION,
};

describe('WorkoutsAccountDeletionAckSchema', () => {
  it('accepts the acknowledgement the route emits', () => {
    expect(WorkoutsAccountDeletionAckSchema.parse(valid)).toEqual(valid);
  });

  it('accepts model keys the contract has never heard of', () => {
    // The wipe transaction covers ~20 user-scoped tables and grows. A closed
    // enum here would make a *correct* deletion fail its own response parse.
    const parsed = WorkoutsAccountDeletionAckSchema.parse({
      ...valid,
      deletedModels: { ...valid.deletedModels, someTableAddedNextQuarter: 0 },
    });

    expect(parsed.deletedModels.someTableAddedNextQuarter).toBe(0);
  });

  it('rejects deleted:false — a failure is an error envelope, not this shape', () => {
    expect(
      WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, deleted: false }).success,
    ).toBe(false);
  });

  it('rejects an empty userId, a non-ISO deletedAt, and fractional counts', () => {
    expect(WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, userId: '' }).success).toBe(false);
    expect(
      WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, deletedAt: '2026-08-24' }).success,
    ).toBe(false);
    expect(
      WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, deletedModels: { session: 1.5 } })
        .success,
    ).toBe(false);
    expect(
      WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, deletedModels: { session: -1 } })
        .success,
    ).toBe(false);
  });

  it('rejects an ackVersion the client cannot interpret', () => {
    expect(WorkoutsAccountDeletionAckSchema.safeParse({ ...valid, ackVersion: 2 }).success).toBe(
      false,
    );
  });
});

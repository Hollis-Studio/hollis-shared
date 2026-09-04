/**
 * @ai-context Workouts program rotation contract (alpha.62, hollis-workouts#70)
 *
 * Pins the wire decisions the rotation rests on: local civil dates (never
 * instants), inclusive windows that may not run backwards, nullable
 * `programId` from day one, unique entry ids, the server-owned pointer fields
 * being accepted-but-ignored on PUT, and the "never saved" document answering
 * with nulls instead of a 404.
 */

import {
  PROGRAM_ROTATION_MAX_ENTRIES,
  PROGRAM_ROTATION_SCHEMA_VERSION,
  ProgramRotationAdvanceBodySchema,
  ProgramRotationEntrySchema,
  ProgramRotationPutBodySchema,
  ProgramRotationSchema,
} from '../domain/workouts-program-rotation';

const fallBulk = {
  id: 'entry_fall_bulk',
  programId: 'program_bulk',
  label: null,
  phase: 'build' as const,
  startDate: '2026-09-01',
  endDate: '2026-11-30',
};

const winterMaintain = {
  id: 'entry_winter_maintain',
  programId: null,
  label: 'Winter maintain',
  phase: 'maintain' as const,
  startDate: '2026-12-01',
  endDate: '2027-02-28',
};

const savedDocument = {
  userId: 'user_123',
  schemaVersion: PROGRAM_ROTATION_SCHEMA_VERSION,
  enabled: true,
  entries: [fallBulk, winterMaintain],
  currentEntryId: 'entry_fall_bulk',
  currentEntryAppliedAt: '2026-09-07T13:00:00.000Z',
  createdAt: '2026-08-30T10:00:00.000Z',
  updatedAt: '2026-09-07T13:00:00.000Z',
};

describe('ProgramRotationEntrySchema', () => {
  it('accepts a program-backed entry and a program-less labelled block', () => {
    expect(ProgramRotationEntrySchema.parse(fallBulk)).toEqual(fallBulk);
    expect(ProgramRotationEntrySchema.parse(winterMaintain)).toEqual(winterMaintain);
  });

  it('rejects a window that ends before it starts', () => {
    const result = ProgramRotationEntrySchema.safeParse({
      ...fallBulk,
      startDate: '2026-11-30',
      endDate: '2026-09-01',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a single-day window (start equals end)', () => {
    expect(
      ProgramRotationEntrySchema.safeParse({
        ...fallBulk,
        startDate: '2026-09-01',
        endDate: '2026-09-01',
      }).success,
    ).toBe(true);
  });

  it('rejects instants and impossible calendar dates — windows are local civil dates', () => {
    expect(
      ProgramRotationEntrySchema.safeParse({ ...fallBulk, startDate: '2026-09-01T00:00:00Z' })
        .success,
    ).toBe(false);
    expect(
      ProgramRotationEntrySchema.safeParse({ ...fallBulk, endDate: '2026-02-30' }).success,
    ).toBe(false);
  });

  it('rejects a phase the profile would not accept', () => {
    expect(
      ProgramRotationEntrySchema.safeParse({ ...fallBulk, phase: 'hypertrophy' }).success,
    ).toBe(false);
  });
});

describe('ProgramRotationPutBodySchema', () => {
  it('accepts the whole document a sync PUT sends, including server-owned stamps', () => {
    const parsed = ProgramRotationPutBodySchema.parse(savedDocument);
    expect(parsed.entries).toHaveLength(2);
    expect(parsed.currentEntryId).toBe('entry_fall_bulk');
    expect(parsed.updatedAt).toBeInstanceOf(Date);
  });

  it('accepts the minimal client-authored body', () => {
    expect(
      ProgramRotationPutBodySchema.safeParse({
        schemaVersion: 1,
        enabled: false,
        entries: [],
      }).success,
    ).toBe(true);
  });

  it('rejects duplicate entry ids', () => {
    const result = ProgramRotationPutBodySchema.safeParse({
      schemaVersion: 1,
      enabled: true,
      entries: [fallBulk, { ...winterMaintain, id: fallBulk.id }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects more entries than the documented ceiling', () => {
    const entries = Array.from({ length: PROGRAM_ROTATION_MAX_ENTRIES + 1 }, (_, i) => ({
      ...fallBulk,
      id: `entry_${i}`,
    }));
    expect(
      ProgramRotationPutBodySchema.safeParse({ schemaVersion: 1, enabled: true, entries }).success,
    ).toBe(false);
  });

  it('refuses an unknown schema version rather than reading it positionally', () => {
    expect(
      ProgramRotationPutBodySchema.safeParse({ schemaVersion: 2, enabled: true, entries: [] })
        .success,
    ).toBe(false);
  });
});

describe('ProgramRotationSchema', () => {
  it('accepts a saved document and coerces the server stamps to dates', () => {
    const parsed = ProgramRotationSchema.parse(savedDocument);
    expect(parsed.currentEntryAppliedAt).toBeInstanceOf(Date);
    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(parsed.updatedAt).toBeInstanceOf(Date);
  });

  it('accepts the never-saved document: disabled, empty, every stamp null', () => {
    const parsed = ProgramRotationSchema.parse({
      userId: 'user_123',
      schemaVersion: 1,
      enabled: false,
      entries: [],
      currentEntryId: null,
      currentEntryAppliedAt: null,
      createdAt: null,
      updatedAt: null,
    });
    expect(parsed.updatedAt).toBeNull();
    expect(parsed.currentEntryAppliedAt).toBeNull();
  });
});

describe('ProgramRotationAdvanceBodySchema', () => {
  it('accepts a first advance (no current entry) and a subsequent one', () => {
    expect(
      ProgramRotationAdvanceBodySchema.parse({
        entryId: 'entry_fall_bulk',
        expectedCurrentEntryId: null,
      }),
    ).toEqual({ entryId: 'entry_fall_bulk', expectedCurrentEntryId: null });
    expect(
      ProgramRotationAdvanceBodySchema.safeParse({
        entryId: 'entry_winter_maintain',
        expectedCurrentEntryId: 'entry_fall_bulk',
      }).success,
    ).toBe(true);
  });

  it('requires the expectation to be stated explicitly', () => {
    expect(ProgramRotationAdvanceBodySchema.safeParse({ entryId: 'entry_fall_bulk' }).success).toBe(
      false,
    );
  });
});

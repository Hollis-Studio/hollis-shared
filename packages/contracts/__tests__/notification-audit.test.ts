import { AiAuditLogEntrySchema } from '../ai/persistence.js';

describe('notification audit records', () => {
  const receipt = { id: 'receipt', timestamp: new Date(), surface: 'smart_notification', modelTier: 'deterministic', action: 'auto_applied', persisted: false, sourceRef: { type: 'smart_notification', channel: 'pre_lift' }, aiOutput: { source: 'fallback' } };
  it('represents deterministic notifications without claiming AI generation', () => {
    expect(AiAuditLogEntrySchema.parse(receipt).modelTier).toBe('deterministic');
  });
  it('still rejects arbitrary surfaces and provider model IDs as tiers', () => {
    expect(AiAuditLogEntrySchema.safeParse({ ...receipt, surface: 'unknown' }).success).toBe(false);
    expect(AiAuditLogEntrySchema.safeParse({ ...receipt, modelTier: 'gemini-3-flash-preview' }).success).toBe(false);
  });
});

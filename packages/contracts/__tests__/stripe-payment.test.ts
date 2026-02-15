/**
 * @ai-context Stripe Payment Contracts Tests | validates all payment domain contracts
 *
 * This test suite verifies:
 * 1. StripeMetadataSchema validates metadata (500 char limit per value, 50 keys max)
 * 2. SetupIntentSchema validates valid setup intent data
 * 3. PaymentMethodSchema validates payment method data
 * 4. CollectPaymentRequestSchema validates payment requests, rejects negative/over-limit amounts
 * 5. RefundRequestSchema validates refund requests
 * 6. StripeConfigSchema validates config
 *
 * Run: npx jest shared/contracts/__tests__/stripe-payment.test.ts
 */

import {
    CollectPaymentRequestSchema,
    PaymentMethodSchema,
    RefundRequestSchema,
    SetupIntentSchema,
    StripeConfigSchema,
    StripeMetadataSchema,
} from '../stripe/payment';

// ============================================================================
// HELPERS
// ============================================================================

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

// ============================================================================
// STRIPE METADATA TESTS
// ============================================================================

describe('Stripe Payment Contracts', () => {
  describe('StripeMetadataSchema', () => {
    describe('valid objects', () => {
      it('should accept empty metadata', () => {
        const result = StripeMetadataSchema.safeParse({});
        expect(result.success).toBe(true);
      });

      it('should accept metadata with single key-value pair', () => {
        const result = StripeMetadataSchema.safeParse({ userId: '123' });
        expect(result.success).toBe(true);
      });

      it('should accept metadata with multiple key-value pairs', () => {
        const result = StripeMetadataSchema.safeParse({
          userId: '123',
          type: 'mobile_session_purchase',
          quantity: '5',
        });
        expect(result.success).toBe(true);
      });

      it('should accept metadata value at exactly 500 characters', () => {
        const result = StripeMetadataSchema.safeParse({
          longValue: 'x'.repeat(500),
        });
        expect(result.success).toBe(true);
      });

      it('should accept metadata with exactly 50 keys', () => {
        const metadata: Record<string, string> = {};
        for (let i = 0; i < 50; i++) {
          metadata[`key${i}`] = `value${i}`;
        }
        const result = StripeMetadataSchema.safeParse(metadata);
        expect(result.success).toBe(true);
      });

      it('should accept metadata value at 499 characters', () => {
        const result = StripeMetadataSchema.safeParse({
          longValue: 'x'.repeat(499),
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject metadata value exceeding 500 characters', () => {
        const result = StripeMetadataSchema.safeParse({
          longValue: 'x'.repeat(501),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.message).toContain('500 characters or less');
        }
      });

      it('should reject metadata with more than 50 keys', () => {
        const metadata: Record<string, string> = {};
        for (let i = 0; i < 51; i++) {
          metadata[`key${i}`] = `value${i}`;
        }
        const result = StripeMetadataSchema.safeParse(metadata);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.message).toContain('more than 50 keys');
        }
      });

      it('should reject metadata with non-string values', () => {
        const result = StripeMetadataSchema.safeParse({
          userId: 123,
        });
        expect(result.success).toBe(false);
      });

      it('should reject metadata with array values', () => {
        const result = StripeMetadataSchema.safeParse({
          items: ['item1', 'item2'],
        });
        expect(result.success).toBe(false);
      });

      it('should reject metadata with object values', () => {
        const result = StripeMetadataSchema.safeParse({
          nested: { key: 'value' },
        });
        expect(result.success).toBe(false);
      });

      it('should reject null', () => {
        expect(StripeMetadataSchema.safeParse(null).success).toBe(false);
      });

      it('should reject array', () => {
        expect(StripeMetadataSchema.safeParse([]).success).toBe(false);
      });

      it('should reject string', () => {
        expect(StripeMetadataSchema.safeParse('metadata').success).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should reject metadata with one value exceeding 500 chars even if others are valid', () => {
        const result = StripeMetadataSchema.safeParse({
          validKey: 'valid value',
          invalidKey: 'x'.repeat(501),
          anotherValidKey: 'another valid value',
        });
        expect(result.success).toBe(false);
      });

      it('should accept metadata with multiple values at exactly 500 chars', () => {
        const result = StripeMetadataSchema.safeParse({
          key1: 'x'.repeat(500),
          key2: 'y'.repeat(500),
          key3: 'z'.repeat(500),
        });
        expect(result.success).toBe(true);
      });

      it('should reject metadata with 51 keys even if all values are short', () => {
        const metadata: Record<string, string> = {};
        for (let i = 0; i < 51; i++) {
          metadata[`k${i}`] = 'v';
        }
        const result = StripeMetadataSchema.safeParse(metadata);
        expect(result.success).toBe(false);
      });
    });
  });

// ============================================================================
// SETUP INTENT TESTS
// ============================================================================

  describe('SetupIntentSchema', () => {
    describe('valid objects', () => {
      it('should accept a valid setup intent', () => {
        const result = SetupIntentSchema.safeParse({
          clientSecret: 'seti_1234567890_secret_abc',
          customerId: 'cus_1234567890',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.clientSecret).toBe('seti_1234567890_secret_abc');
          expect(result.data.customerId).toBe('cus_1234567890');
        }
      });

      it('should accept any non-empty strings', () => {
        const result = SetupIntentSchema.safeParse({
          clientSecret: 'a',
          customerId: 'b',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing clientSecret', () => {
        const result = SetupIntentSchema.safeParse({
          customerId: 'cus_1234567890',
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing customerId', () => {
        const result = SetupIntentSchema.safeParse({
          clientSecret: 'seti_1234567890_secret_abc',
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-string clientSecret', () => {
        const result = SetupIntentSchema.safeParse({
          clientSecret: 123,
          customerId: 'cus_1234567890',
        });
        expect(result.success).toBe(false);
      });

      it('should reject empty object', () => {
        const result = SetupIntentSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject null', () => {
        expect(SetupIntentSchema.safeParse(null).success).toBe(false);
      });

      it('should reject undefined', () => {
        expect(SetupIntentSchema.safeParse(undefined).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // PAYMENT METHOD TESTS
  // ============================================================================

  describe('PaymentMethodSchema', () => {
    const validPaymentMethod = {
      id: 'pm_1234567890',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2027,
      isDefault: true,
    };

    describe('valid objects', () => {
      it('should accept a valid payment method', () => {
        const result = PaymentMethodSchema.safeParse(validPaymentMethod);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.id).toBe('pm_1234567890');
          expect(result.data.brand).toBe('visa');
          expect(result.data.last4).toBe('4242');
          expect(result.data.expMonth).toBe(12);
          expect(result.data.expYear).toBe(2027);
          expect(result.data.isDefault).toBe(true);
        }
      });

      it('should accept different card brands', () => {
        for (const brand of ['visa', 'mastercard', 'amex', 'discover']) {
          const result = PaymentMethodSchema.safeParse({
            ...validPaymentMethod,
            brand,
          });
          expect(result.success).toBe(true);
        }
      });

      it('should accept isDefault as false', () => {
        const result = PaymentMethodSchema.safeParse({
          ...validPaymentMethod,
          isDefault: false,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing id', () => {
        const { id: _id, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing brand', () => {
        const { brand: _b, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing last4', () => {
        const { last4: _l, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing expMonth', () => {
        const { expMonth: _e, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing expYear', () => {
        const { expYear: _e, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing isDefault', () => {
        const { isDefault: _d, ...rest } = validPaymentMethod;
        const result = PaymentMethodSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject non-integer expMonth', () => {
        const result = PaymentMethodSchema.safeParse({
          ...validPaymentMethod,
          expMonth: 12.5,
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-integer expYear', () => {
        const result = PaymentMethodSchema.safeParse({
          ...validPaymentMethod,
          expYear: 2027.5,
        });
        expect(result.success).toBe(false);
      });

      it('should reject empty object', () => {
        const result = PaymentMethodSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject null', () => {
        expect(PaymentMethodSchema.safeParse(null).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // COLLECT PAYMENT REQUEST TESTS
  // ============================================================================

  describe('CollectPaymentRequestSchema', () => {
    const validPaymentRequest = {
      userId: VALID_UUID,
      amountInCents: 5000,
      description: 'Session charge',
    };

    describe('valid objects', () => {
      it('should accept a valid payment request', () => {
        const result = CollectPaymentRequestSchema.safeParse(validPaymentRequest);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.userId).toBe(VALID_UUID);
          expect(result.data.amountInCents).toBe(5000);
          expect(result.data.description).toBe('Session charge');
        }
      });

      it('should accept payment request with metadata', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          metadata: { sessionId: 'sess_123', type: 'training' },
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.metadata).toEqual({ sessionId: 'sess_123', type: 'training' });
        }
      });

      it('should accept the minimum positive amount (1 cent)', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: 1,
        });
        expect(result.success).toBe(true);
      });

      it('should accept the maximum amount ($5,000 = 500000 cents)', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: 500_000,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject negative amount', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: -100,
        });
        expect(result.success).toBe(false);
      });

      it('should reject zero amount', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: 0,
        });
        expect(result.success).toBe(false);
      });

      it('should reject amount exceeding maximum ($5,000)', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: 500_001,
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-integer amount', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          amountInCents: 50.5,
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing userId', () => {
        const { userId: _u, ...rest } = validPaymentRequest;
        const result = CollectPaymentRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject invalid userId (not UUID)', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          userId: 'not-a-uuid',
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing description', () => {
        const { description: _d, ...rest } = validPaymentRequest;
        const result = CollectPaymentRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing amountInCents', () => {
        const { amountInCents: _a, ...rest } = validPaymentRequest;
        const result = CollectPaymentRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject empty object', () => {
        const result = CollectPaymentRequestSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject metadata value exceeding 500 characters', () => {
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          metadata: { longValue: 'x'.repeat(501) },
        });
        expect(result.success).toBe(false);
      });

      it('should reject metadata with more than 50 keys', () => {
        const metadata: Record<string, string> = {};
        for (let i = 0; i < 51; i++) {
          metadata[`key${i}`] = `value${i}`;
        }
        const result = CollectPaymentRequestSchema.safeParse({
          ...validPaymentRequest,
          metadata,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // REFUND REQUEST TESTS
  // ============================================================================

  describe('RefundRequestSchema', () => {
    const validRefund = {
      paymentIntentId: 'pi_1234567890',
    };

    describe('valid objects', () => {
      it('should accept refund with paymentIntentId only (full refund)', () => {
        const result = RefundRequestSchema.safeParse(validRefund);
        expect(result.success).toBe(true);
      });

      it('should accept partial refund with amountInCents', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 2500,
        });
        expect(result.success).toBe(true);
      });

      it('should accept refund with all optional fields', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 5000,
          reason: 'requested_by_customer',
          notes: 'Customer requested refund for unused session.',
        });
        expect(result.success).toBe(true);
      });

      it.each(['requested_by_customer', 'duplicate', 'fraudulent'] as const)(
        'should accept reason: %s',
        (reason) => {
          const result = RefundRequestSchema.safeParse({ ...validRefund, reason });
          expect(result.success).toBe(true);
        },
      );

      it('should accept maximum refund amount ($5,000)', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 500_000,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing paymentIntentId', () => {
        const result = RefundRequestSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject invalid reason', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          reason: 'because_i_said_so',
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative amountInCents', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: -100,
        });
        expect(result.success).toBe(false);
      });

      it('should reject zero amountInCents', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 0,
        });
        expect(result.success).toBe(false);
      });

      it('should reject amountInCents over maximum', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 500_001,
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-integer amountInCents', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          amountInCents: 25.50,
        });
        expect(result.success).toBe(false);
      });

      it('should reject notes exceeding 500 characters', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          notes: 'x'.repeat(501),
        });
        expect(result.success).toBe(false);
      });

      it('should accept notes at exactly 500 characters', () => {
        const result = RefundRequestSchema.safeParse({
          ...validRefund,
          notes: 'x'.repeat(500),
        });
        expect(result.success).toBe(true);
      });

      it('should reject null', () => {
        expect(RefundRequestSchema.safeParse(null).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // STRIPE CONFIG TESTS
  // ============================================================================

  describe('StripeConfigSchema', () => {
    describe('valid objects', () => {
      it('should accept valid config', () => {
        const result = StripeConfigSchema.safeParse({
          publishableKey: 'pk_test_1234567890',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.publishableKey).toBe('pk_test_1234567890');
        }
      });

      it('should accept live key format', () => {
        const result = StripeConfigSchema.safeParse({
          publishableKey: 'pk_live_abcdefghijklmnop',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject missing publishableKey', () => {
        const result = StripeConfigSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject non-string publishableKey', () => {
        const result = StripeConfigSchema.safeParse({
          publishableKey: 12345,
        });
        expect(result.success).toBe(false);
      });

      it('should reject null', () => {
        expect(StripeConfigSchema.safeParse(null).success).toBe(false);
      });

      it('should reject undefined', () => {
        expect(StripeConfigSchema.safeParse(undefined).success).toBe(false);
      });
    });
  });
});

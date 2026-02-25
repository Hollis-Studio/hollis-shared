/**
 * @ai-context Message and Conversation contracts for user-to-user messaging
 *
 * This module provides the canonical definitions for messaging types:
 * - Messages with sender/receiver info
 * - Conversations (chat threads)
 * - Send message requests
 * - Unread count tracking
 *
 * IMPORTANT: All messaging types MUST be imported from here.
 *
 * deps: zod, user.ts | consumers: all codebases
 */
import { z } from "zod";

import type { MessagingRecipientRole } from "./user";

// ============================================================================
// CONSTANTS
// ============================================================================

/** Canonical max length for message content — all surfaces MUST use this. */
export const MESSAGE_MAX_LENGTH = 5000 as const;

// ============================================================================
// MESSAGE PARTICIPANT SCHEMA
// ============================================================================

/**
 * Canonical participant shape used in messages and conversations.
 * firstName/lastName are nullable to match DB reality (Prisma String?).
 */
export const MessageParticipantSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
});

export type MessageParticipantContract = z.infer<
  typeof MessageParticipantSchema
>;

// ============================================================================
// MESSAGE SCHEMA
// ============================================================================

export const MessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().max(MESSAGE_MAX_LENGTH),
  attachmentUrl: z.string().nullable().optional(),
  isRead: z.boolean().default(false),
  createdAt: z.string(), // ISO timestamp
  updatedAt: z.string().optional(),
  // Populated sender/receiver info
  sender: MessageParticipantSchema.optional(),
  receiver: MessageParticipantSchema.optional(),
});

export type MessageContract = z.infer<typeof MessageSchema>;

// ============================================================================
// CONVERSATION SCHEMA
// ============================================================================

/** Conversation represents a unique chat thread between two users */
export const ConversationSchema = z.object({
  id: z.string(), // Composite key or unique ID
  participantIds: z.array(z.string()).length(2),
  lastMessage: MessageSchema.optional(),
  unreadCount: z.number().default(0),
  participant: MessageParticipantSchema.optional(), // The "other" participant in the conversation
});

export type ConversationContract = z.infer<typeof ConversationSchema>;

// ============================================================================
// SEND MESSAGE REQUEST
// ============================================================================

export const SendMessageRequestSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(MESSAGE_MAX_LENGTH),
  attachmentUrl: z.string().optional(),
});

export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

// ============================================================================
// UNREAD COUNTS
// ============================================================================

/** Unread counts response - uses typed keys from MESSAGE_RECIPIENT_ROLES */
export const UnreadCountsSchema = z.object({
  FITNESS_COORDINATOR: z.number(),
  CLINICIAN: z.number(),
  total: z.number().optional(),
});

export type UnreadCountsContract = z.infer<typeof UnreadCountsSchema>;

/** Type-safe unread counts using MessagingRecipientRole keys */
export type TypedUnreadCounts = Record<MessagingRecipientRole, number> & {
  total?: number;
};

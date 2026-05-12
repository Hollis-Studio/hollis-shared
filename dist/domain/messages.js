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
import { createPaginatedListSchema } from "./pagination.js";
import { MESSAGE_RECIPIENT_ROLES, UserRoleSchema } from "./user.js";
// ============================================================================
// CONSTANTS
// ============================================================================
/** Canonical max length for message content — all surfaces MUST use this. */
export const MESSAGE_MAX_LENGTH = 5000;
// ============================================================================
// MESSAGE PARTICIPANT SCHEMA
// ============================================================================
/**
 * Canonical participant shape used in messages and conversations.
 * firstName/lastName are nullable to match DB reality (Prisma String?).
 * role is the canonical role of the underlying user record.
 */
export const MessageParticipantSchema = z.object({
    id: z.string(),
    email: z.string(),
    role: UserRoleSchema,
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
});
// ============================================================================
// MESSAGE SCHEMA
// ============================================================================
export const MessageSchema = z.object({
    id: z.string(),
    senderId: z.string().nullable(),
    receiverId: z.string().nullable(),
    content: z.string().max(MESSAGE_MAX_LENGTH),
    attachmentUrl: z.string().nullable().optional(),
    isRead: z.boolean().default(false),
    createdAt: z.string(), // ISO timestamp
    updatedAt: z.string().optional(),
    // Populated sender/receiver info
    // nullable: Prisma returns null (not undefined) when the related user record is absent
    sender: MessageParticipantSchema.nullable().optional(),
    receiver: MessageParticipantSchema.nullable().optional(),
});
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
// ============================================================================
// ADMIN USER SEARCH
// ============================================================================
/** Canonical user-search row used by admin messaging recipient lookup. */
export const UserSearchResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: UserRoleSchema,
});
/** Canonical paginated response for admin user search results. */
export const UserSearchResponseSchema = createPaginatedListSchema(UserSearchResultSchema);
// ============================================================================
// SEND MESSAGE REQUEST
// ============================================================================
/**
 * Canonical request schema for sending a message.
 *
 * Supports two modes:
 * - Direct send: provide `receiverId` (UUID of the target user)
 * - Role-based send: provide `recipientRole` (resolved server-side to the
 *   sender's assigned clinician or fitness coordinator)
 *
 * At least one of `receiverId` or `recipientRole` must be present.
 *
 * NOTE: `senderId` is intentionally absent — the server derives sender identity
 * from the authenticated JWT. Never trust a client-supplied sender ID.
 */
export const SendMessageRequestSchema = z
    .object({
    receiverId: z.string().min(1, "receiverId is required").optional(),
    recipientRole: z.enum(MESSAGE_RECIPIENT_ROLES).optional(),
    content: z
        .string()
        .min(1, "Message content is required")
        .max(MESSAGE_MAX_LENGTH),
    attachmentUrl: z.string().optional(),
})
    .refine((data) => data.receiverId ?? data.recipientRole, {
    message: "Either receiverId or recipientRole is required",
    path: ["receiverId"],
});
// ============================================================================
// UNREAD COUNTS
// ============================================================================
const unreadCountsShape = MESSAGE_RECIPIENT_ROLES.reduce((shape, role) => {
    shape[role] = z.number();
    return shape;
}, 
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- seed empty accumulator for reduce
{});
/** Unread counts response - uses typed keys from MESSAGE_RECIPIENT_ROLES */
export const UnreadCountsSchema = z.object(unreadCountsShape).extend({
    total: z.number().optional(),
});
//# sourceMappingURL=messages.js.map
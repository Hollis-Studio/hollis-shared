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
import type { MessagingRecipientRole } from "./user.js";
/** Canonical max length for message content — all surfaces MUST use this. */
export declare const MESSAGE_MAX_LENGTH: 5000;
/**
 * Canonical participant shape used in messages and conversations.
 * firstName/lastName are nullable to match DB reality (Prisma String?).
 * role is the canonical role of the underlying user record.
 */
export declare const MessageParticipantSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type MessageParticipantContract = z.infer<typeof MessageParticipantSchema>;
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    senderId: z.ZodNullable<z.ZodString>;
    receiverId: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    attachmentUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isRead: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    sender: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
        firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    receiver: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
        firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type MessageContract = z.infer<typeof MessageSchema>;
/** Conversation represents a unique chat thread between two users */
export declare const ConversationSchema: z.ZodObject<{
    id: z.ZodString;
    participantIds: z.ZodArray<z.ZodString>;
    lastMessage: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        senderId: z.ZodNullable<z.ZodString>;
        receiverId: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        attachmentUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isRead: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        sender: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            role: z.ZodEnum<{
                ADMIN: "ADMIN";
                CLINICIAN: "CLINICIAN";
                TRAINER: "TRAINER";
                CLIENT: "CLIENT";
            }>;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        receiver: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            role: z.ZodEnum<{
                ADMIN: "ADMIN";
                CLINICIAN: "CLINICIAN";
                TRAINER: "TRAINER";
                CLIENT: "CLIENT";
            }>;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    unreadCount: z.ZodDefault<z.ZodNumber>;
    participant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
        firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ConversationContract = z.infer<typeof ConversationSchema>;
/** Canonical user-search row used by admin messaging recipient lookup. */
export declare const UserSearchResultSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
}, z.core.$strip>;
export type UserSearchResultContract = z.infer<typeof UserSearchResultSchema>;
/** Canonical paginated response for admin user search results. */
export declare const UserSearchResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UserSearchResponseContract = z.infer<typeof UserSearchResponseSchema>;
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
export declare const SendMessageRequestSchema: z.ZodObject<{
    receiverId: z.ZodOptional<z.ZodString>;
    recipientRole: z.ZodOptional<z.ZodEnum<{
        CLINICIAN: "CLINICIAN";
        FITNESS_COORDINATOR: "FITNESS_COORDINATOR";
    }>>;
    content: z.ZodString;
    attachmentUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
/** Unread counts response - uses typed keys from MESSAGE_RECIPIENT_ROLES */
export declare const UnreadCountsSchema: z.ZodObject<{
    CLINICIAN: z.ZodNumber;
    FITNESS_COORDINATOR: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type UnreadCountsContract = z.infer<typeof UnreadCountsSchema>;
/** Type-safe unread counts using MessagingRecipientRole keys */
export type TypedUnreadCounts = Record<MessagingRecipientRole, number> & {
    total?: number;
};
//# sourceMappingURL=messages.d.ts.map
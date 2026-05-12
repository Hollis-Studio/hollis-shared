/**
 * @ai-context Admin Tasks domain contracts | task types, priorities, and statuses
 *
 * This module provides canonical definitions for admin task management:
 * - Admin task types (specific scenarios requiring manual intervention)
 * - Admin task priorities (LOW, NORMAL, HIGH, URGENT)
 * - Admin task statuses (PENDING, IN_PROGRESS, RESOLVED, DISMISSED)
 *
 * deps: zod | consumers: server, web-admin
 */
import { z } from "zod";
/**
 * Admin task types - specific scenarios requiring manual review/intervention.
 *
 * Billing/Payment tasks:
 * - REFUND_AFTER_SESSION_RESET: Refund received after sessions already allocated
 * - VOIDED_INVOICE_AFTER_RESET: Invoice voided after sessions already allocated
 * - DISPUTE_LOST: Chargeback dispute was lost
 * - DISPUTE_CREATED: Chargeback filed - needs response
 * - DISPUTE_UNLINKED: Chargeback filed but couldn't be linked to a user
 * - PAYMENT_ISSUE: General payment issue requiring review
 * - MOBILE_SESSION_REFUND: Mobile session purchase was refunded
 * - MISSING_DISPUTE_RECORD: Dispute closed but no local record found after 24 hours
 * - REFUND_SERVICE_REVOCATION: Service automatically revoked due to refund, pending admin review
 *
 * Inventory tasks:
 * - INVENTORY_BACKORDER: Product ordered that went to negative stock
 *
 * General:
 * - MANUAL_REVIEW: Generic manual review task
 */
export declare const ADMIN_TASK_TYPES: readonly ["REFUND_AFTER_SESSION_RESET", "VOIDED_INVOICE_AFTER_RESET", "DISPUTE_LOST", "DISPUTE_CREATED", "DISPUTE_UNLINKED", "PAYMENT_ISSUE", "INVENTORY_BACKORDER", "MANUAL_REVIEW", "MOBILE_SESSION_REFUND", "MISSING_DISPUTE_RECORD", "REFUND_FAILED", "REFUND_SERVICE_REVOCATION"];
export type AdminTaskType = z.infer<typeof AdminTaskTypeSchema>;
export declare const AdminTaskTypeSchema: z.ZodEnum<{
    DISPUTE_CREATED: "DISPUTE_CREATED";
    REFUND_AFTER_SESSION_RESET: "REFUND_AFTER_SESSION_RESET";
    VOIDED_INVOICE_AFTER_RESET: "VOIDED_INVOICE_AFTER_RESET";
    DISPUTE_LOST: "DISPUTE_LOST";
    DISPUTE_UNLINKED: "DISPUTE_UNLINKED";
    PAYMENT_ISSUE: "PAYMENT_ISSUE";
    INVENTORY_BACKORDER: "INVENTORY_BACKORDER";
    MANUAL_REVIEW: "MANUAL_REVIEW";
    MOBILE_SESSION_REFUND: "MOBILE_SESSION_REFUND";
    MISSING_DISPUTE_RECORD: "MISSING_DISPUTE_RECORD";
    REFUND_FAILED: "REFUND_FAILED";
    REFUND_SERVICE_REVOCATION: "REFUND_SERVICE_REVOCATION";
}>;
/** Centralized admin task type constants for equality checks */
export declare const ADMIN_TASK_TYPE: {
    readonly REFUND_AFTER_SESSION_RESET: AdminTaskType;
    readonly VOIDED_INVOICE_AFTER_RESET: AdminTaskType;
    readonly DISPUTE_LOST: AdminTaskType;
    readonly DISPUTE_CREATED: AdminTaskType;
    readonly DISPUTE_UNLINKED: AdminTaskType;
    readonly PAYMENT_ISSUE: AdminTaskType;
    readonly INVENTORY_BACKORDER: AdminTaskType;
    readonly MANUAL_REVIEW: AdminTaskType;
    readonly MOBILE_SESSION_REFUND: AdminTaskType;
    readonly MISSING_DISPUTE_RECORD: AdminTaskType;
    readonly REFUND_FAILED: AdminTaskType;
    readonly REFUND_SERVICE_REVOCATION: AdminTaskType;
};
/** Human-readable labels for admin task types */
export declare const ADMIN_TASK_TYPE_LABELS: Record<AdminTaskType, string>;
/**
 * Check if a string is a valid admin task type
 */
export declare function isAdminTaskType(value: string): value is AdminTaskType;
/**
 * Admin task priority levels.
 * - LOW: Can be addressed during regular maintenance
 * - NORMAL: Standard priority, address in normal workflow
 * - HIGH: Requires prompt attention, may impact operations
 * - URGENT: Critical issue requiring immediate action
 */
export declare const ADMIN_TASK_PRIORITIES: readonly ["LOW", "NORMAL", "HIGH", "URGENT"];
export type AdminTaskPriority = z.infer<typeof AdminTaskPrioritySchema>;
export declare const AdminTaskPrioritySchema: z.ZodEnum<{
    LOW: "LOW";
    HIGH: "HIGH";
    NORMAL: "NORMAL";
    URGENT: "URGENT";
}>;
/** Centralized admin task priority constants for equality checks */
export declare const ADMIN_TASK_PRIORITY: {
    readonly LOW: AdminTaskPriority;
    readonly NORMAL: AdminTaskPriority;
    readonly HIGH: AdminTaskPriority;
    readonly URGENT: AdminTaskPriority;
};
/** Human-readable labels for admin task priorities */
export declare const ADMIN_TASK_PRIORITY_LABELS: Record<AdminTaskPriority, string>;
/**
 * Check if a string is a valid admin task priority
 */
export declare function isAdminTaskPriority(value: string): value is AdminTaskPriority;
/**
 * Admin task lifecycle status.
 * - PENDING: Task created, awaiting assignment/action
 * - IN_PROGRESS: Task assigned and being worked on
 * - RESOLVED: Task completed successfully
 * - DISMISSED: Task closed without action (not relevant, duplicate, etc.)
 */
export declare const ADMIN_TASK_STATUSES: readonly ["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED"];
export type AdminTaskStatus = z.infer<typeof AdminTaskStatusSchema>;
export declare const AdminTaskStatusSchema: z.ZodEnum<{
    PENDING: "PENDING";
    IN_PROGRESS: "IN_PROGRESS";
    RESOLVED: "RESOLVED";
    DISMISSED: "DISMISSED";
}>;
/** Centralized admin task status constants for equality checks */
export declare const ADMIN_TASK_STATUS: {
    readonly PENDING: AdminTaskStatus;
    readonly IN_PROGRESS: AdminTaskStatus;
    readonly RESOLVED: AdminTaskStatus;
    readonly DISMISSED: AdminTaskStatus;
};
/** Human-readable labels for admin task statuses */
export declare const ADMIN_TASK_STATUS_LABELS: Record<AdminTaskStatus, string>;
/**
 * Check if a string is a valid admin task status
 */
export declare function isAdminTaskStatus(value: string): value is AdminTaskStatus;
//# sourceMappingURL=admin-tasks.d.ts.map
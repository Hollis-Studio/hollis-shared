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
// ============================================================================
// ADMIN TASK TYPE
// ============================================================================
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
export const ADMIN_TASK_TYPES = [
    "REFUND_AFTER_SESSION_RESET",
    "VOIDED_INVOICE_AFTER_RESET",
    "DISPUTE_LOST",
    "DISPUTE_CREATED",
    "DISPUTE_UNLINKED",
    "PAYMENT_ISSUE",
    "INVENTORY_BACKORDER",
    "MANUAL_REVIEW",
    "MOBILE_SESSION_REFUND",
    "MISSING_DISPUTE_RECORD",
    "REFUND_FAILED",
    "REFUND_SERVICE_REVOCATION",
];
export const AdminTaskTypeSchema = z.enum(ADMIN_TASK_TYPES);
/** Centralized admin task type constants for equality checks */
export const ADMIN_TASK_TYPE = {
    REFUND_AFTER_SESSION_RESET: "REFUND_AFTER_SESSION_RESET",
    VOIDED_INVOICE_AFTER_RESET: "VOIDED_INVOICE_AFTER_RESET",
    DISPUTE_LOST: "DISPUTE_LOST",
    DISPUTE_CREATED: "DISPUTE_CREATED",
    DISPUTE_UNLINKED: "DISPUTE_UNLINKED",
    PAYMENT_ISSUE: "PAYMENT_ISSUE",
    INVENTORY_BACKORDER: "INVENTORY_BACKORDER",
    MANUAL_REVIEW: "MANUAL_REVIEW",
    MOBILE_SESSION_REFUND: "MOBILE_SESSION_REFUND",
    MISSING_DISPUTE_RECORD: "MISSING_DISPUTE_RECORD",
    REFUND_FAILED: "REFUND_FAILED",
    REFUND_SERVICE_REVOCATION: "REFUND_SERVICE_REVOCATION",
};
/** Human-readable labels for admin task types */
export const ADMIN_TASK_TYPE_LABELS = {
    REFUND_AFTER_SESSION_RESET: "Refund After Session Reset",
    VOIDED_INVOICE_AFTER_RESET: "Voided Invoice After Reset",
    DISPUTE_LOST: "Dispute Lost",
    DISPUTE_CREATED: "Dispute Created",
    DISPUTE_UNLINKED: "Dispute Unlinked",
    PAYMENT_ISSUE: "Payment Issue",
    INVENTORY_BACKORDER: "Inventory Backorder",
    MANUAL_REVIEW: "Manual Review",
    MOBILE_SESSION_REFUND: "Mobile Session Refund",
    MISSING_DISPUTE_RECORD: "Missing Dispute Record",
    REFUND_FAILED: "Refund Failed",
    REFUND_SERVICE_REVOCATION: "Refund Service Revocation",
};
/**
 * Check if a string is a valid admin task type
 */
export function isAdminTaskType(value) {
    return ADMIN_TASK_TYPES.includes(value);
}
// ============================================================================
// ADMIN TASK PRIORITY
// ============================================================================
/**
 * Admin task priority levels.
 * - LOW: Can be addressed during regular maintenance
 * - NORMAL: Standard priority, address in normal workflow
 * - HIGH: Requires prompt attention, may impact operations
 * - URGENT: Critical issue requiring immediate action
 */
export const ADMIN_TASK_PRIORITIES = [
    "LOW",
    "NORMAL",
    "HIGH",
    "URGENT",
];
export const AdminTaskPrioritySchema = z.enum(ADMIN_TASK_PRIORITIES);
/** Centralized admin task priority constants for equality checks */
export const ADMIN_TASK_PRIORITY = {
    LOW: "LOW",
    NORMAL: "NORMAL",
    HIGH: "HIGH",
    URGENT: "URGENT",
};
/** Human-readable labels for admin task priorities */
export const ADMIN_TASK_PRIORITY_LABELS = {
    LOW: "Low",
    NORMAL: "Normal",
    HIGH: "High",
    URGENT: "Urgent",
};
/**
 * Check if a string is a valid admin task priority
 */
export function isAdminTaskPriority(value) {
    return ADMIN_TASK_PRIORITIES.includes(value);
}
// ============================================================================
// ADMIN TASK STATUS
// ============================================================================
/**
 * Admin task lifecycle status.
 * - PENDING: Task created, awaiting assignment/action
 * - IN_PROGRESS: Task assigned and being worked on
 * - RESOLVED: Task completed successfully
 * - DISMISSED: Task closed without action (not relevant, duplicate, etc.)
 */
export const ADMIN_TASK_STATUSES = [
    "PENDING",
    "IN_PROGRESS",
    "RESOLVED",
    "DISMISSED",
];
export const AdminTaskStatusSchema = z.enum(ADMIN_TASK_STATUSES);
/** Centralized admin task status constants for equality checks */
export const ADMIN_TASK_STATUS = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    DISMISSED: "DISMISSED",
};
/** Human-readable labels for admin task statuses */
export const ADMIN_TASK_STATUS_LABELS = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    DISMISSED: "Dismissed",
};
/**
 * Check if a string is a valid admin task status
 */
export function isAdminTaskStatus(value) {
    return ADMIN_TASK_STATUSES.includes(value);
}
//# sourceMappingURL=admin-tasks.js.map
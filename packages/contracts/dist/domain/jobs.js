/**
 * @ai-context Jobs domain contracts | cron job run statuses
 *
 * Provides canonical type definitions for background job tracking:
 * - CronJobStatus: outcome values for CronJobRun records
 *
 * deps: none | consumers: server (jobs/), shared contracts
 */
// ============================================================================
// CRON JOB RUN STATUS
// ============================================================================
/**
 * Status values for cron job run records.
 * Matches the string values stored in CronJobRun.status in the database.
 */
export const CRON_JOB_STATUS = {
    SUCCESS: "success",
    FAILURE: "failure",
    PARTIAL: "partial",
};
//# sourceMappingURL=jobs.js.map
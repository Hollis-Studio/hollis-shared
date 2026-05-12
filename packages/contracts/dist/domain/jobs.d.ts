/**
 * @ai-context Jobs domain contracts | cron job run statuses
 *
 * Provides canonical type definitions for background job tracking:
 * - CronJobStatus: outcome values for CronJobRun records
 *
 * deps: none | consumers: server (jobs/), shared contracts
 */
/**
 * Status values for cron job run records.
 * Matches the string values stored in CronJobRun.status in the database.
 */
export declare const CRON_JOB_STATUS: {
    readonly SUCCESS: "success";
    readonly FAILURE: "failure";
    readonly PARTIAL: "partial";
};
export type CronJobStatus = (typeof CRON_JOB_STATUS)[keyof typeof CRON_JOB_STATUS];
//# sourceMappingURL=jobs.d.ts.map
/**
 * @ai-context Labs Routes | lab results and panels API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Labs API routes.
 * Base path: /api/labs
 *
 * @group LABS
 */
export declare const LABS_ROUTES: {
    /**
     * GET /api/labs - Get lab panels for user
     * Query params: userId, includePanels
     */
    readonly LIST: "/api/labs";
    /**
     * GET /api/labs?userId={userId}&includeReports=true - Get lab reports for user
     * @param userId - User's unique identifier
     */
    readonly getReports: (userId: string) => `/api/labs?userId=${string}&includeReports=true`;
    /**
     * GET /api/labs/reports/:reportId - Get specific lab report
     * @param reportId - Lab report's unique identifier
     */
    readonly getReport: (reportId: string) => `/api/labs/reports/${string}`;
    /**
     * GET /api/labs/panels/:panelId - Get specific lab panel
     * @param panelId - Lab panel's unique identifier
     */
    readonly getPanel: (panelId: string) => `/api/labs/panels/${string}`;
    /**
     * GET /api/labs/metric-definitions - List canonical lab metric definitions
     * Query params: search, category, page, limit
     * Used for biomarker picker dropdown
     */
    readonly METRIC_DEFINITIONS: "/api/labs/metric-definitions";
};
//# sourceMappingURL=labs.d.ts.map
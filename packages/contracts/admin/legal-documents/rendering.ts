import type { UserTier } from "../../domain/user.js";

export interface SignedDocumentRenderClientInfo {
  name: string;
  email: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  address?: string | null;
  cityStateZip?: string | null;
  memberId?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  selectedTier?: UserTier | null;
  contractDurationMonths?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export type SignedDocumentOptInSelections = Record<string, boolean>;

function formatDateForDocument(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function checkbox(checked: boolean): string {
  return checked ? "[x]" : "[ ]";
}

/**
 * Renders the canonical legal document text for signing from shared contracts.
 * Server code should compute the stored legal content hash from this rendered
 * text, not from client-submitted document text.
 */
export function renderSignedDocumentContent(
  content: string,
  clientInfo: SignedDocumentRenderClientInfo,
  today: string,
  optInSelections: SignedDocumentOptInSelections = {},
): string {
  const tier = clientInfo.selectedTier ?? "";
  const durationMonths = clientInfo.contractDurationMonths;

  return content
    .replace(/\{\{MEMBER_NAME\}\}/g, clientInfo.name)
    .replace(/\{\{EMAIL\}\}/g, clientInfo.email)
    .replace(/\{\{MEMBER_EMAIL\}\}/g, clientInfo.email)
    .replace(
      /\{\{DATE_OF_BIRTH\}\}/g,
      clientInfo.dateOfBirth ? formatDateForDocument(clientInfo.dateOfBirth) : "",
    )
    .replace(
      /\{\{MEMBER_DOB\}\}/g,
      clientInfo.dateOfBirth ? formatDateForDocument(clientInfo.dateOfBirth) : "",
    )
    .replace(/\{\{PHONE\}\}/g, clientInfo.phone ?? "")
    .replace(/\{\{ADDRESS\}\}/g, clientInfo.address ?? "")
    .replace(/\{\{CITY_STATE_ZIP\}\}/g, clientInfo.cityStateZip ?? "")
    .replace(/\{\{MEMBER_ID\}\}/g, clientInfo.memberId ?? "To be assigned")
    .replace(/\{\{EMERGENCY_CONTACT_NAME\}\}/g, clientInfo.emergencyContactName ?? "")
    .replace(/\{\{EMERGENCY_CONTACT_PHONE\}\}/g, clientInfo.emergencyContactPhone ?? "")
    .replace(/\{\{DATE\}\}/g, today)
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, today)
    .replace(/\{\{SIGNING_DATE\}\}/g, today)
    .replace(
      /\{\{START_DATE\}\}/g,
      clientInfo.startDate ? formatDateForDocument(clientInfo.startDate) : today,
    )
    .replace(
      /\{\{END_DATE\}\}/g,
      clientInfo.endDate ? formatDateForDocument(clientInfo.endDate) : "See Exhibit A",
    )
    .replace(/\{\{CHECK_TIER_ESSENTIALS\}\}/g, checkbox(tier === "ESSENTIALS"))
    .replace(/\{\{CHECK_TIER_CORE\}\}/g, checkbox(tier === "CORE"))
    .replace(/\{\{CHECK_TIER_CONCIERGE\}\}/g, checkbox(tier === "CONCIERGE"))
    .replace(/\{\{CHECK_TERM_4MO\}\}/g, checkbox(durationMonths === 4))
    .replace(/\{\{CHECK_TERM_8MO\}\}/g, checkbox(durationMonths === 8))
    .replace(/\{\{CHECK_TERM_12MO\}\}/g, checkbox(durationMonths === 12))
    .replace(/\{\{SIGNATURE\}\}/g, "[Signed electronically below]")
    .replace(/\{\{INITIALS_[A-Z_]+\}\}/g, "[Initialed below]")
    .replace(/\{\{OPT_IN_([A-Z_]+)\}\}/g, (_match, token: string) =>
      checkbox(optInSelections[token.toLowerCase()] === true),
    )
    .replace(/\{\{MARKETING_OPT_IN\}\}/g, "[See selections below]");
}

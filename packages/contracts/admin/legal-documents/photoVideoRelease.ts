/**
 * Photo, Video, and Testimonial Release — static document content.
 *
 * Source: docs/09-Legal/HH Legal/internal/photo-video-release.mdx
 * The docMeta block has been extracted into `meta`. Blank field placeholders
 * replaced by template tokens. This document is optional — members may skip it.
 * Instead of initials sections, it has opt-in use type definitions that the
 * signing UI renders as checkboxes.
 */

export const meta = {
  title: "Photo, Video, and Testimonial Release",
  version: "1.1.0",
  effectiveDate: "2026-03-04",
  contentHash: "6fca2f06",
};

export const content = `**DRAFT — FOR ATTORNEY REVIEW**

# Photo, Video, and Testimonial Release

**Hollis Health LLC**
Home Office: 691 S Seguin, New Braunfels, TX 78130
(210) 891-9005 | legal@hollis.health

---

## Section 1. Parties

This Photo, Video, and Testimonial Release ("Release") is entered into as of the date of Releaser's signature below by and between:

**Hollis Health LLC**, a Texas limited liability company, doing business as Hollis Health, with its home office at 691 S Seguin, New Braunfels, TX 78130 ("Company," "we," "us," or "our"); and

**Releaser:**

| Field | Value |
|---|---|
| Full Legal Name | {{MEMBER_NAME}} |
| Date of Birth | {{DATE_OF_BIRTH}} |
| Address | {{ADDRESS}} |
| Email Address | {{EMAIL}} |
| Phone Number | {{PHONE}} |

---

## Section 2. Voluntary Nature of Release

Granting publicity, media, or testimonial rights is voluntary. You are not required to sign this Release to purchase or maintain services, and declining to sign it will not affect your pricing or service availability.

---

## Section 3. Materials Covered

If you grant authorization below, the authorized materials may include:

- Photographs;
- Video recordings;
- Audio recordings;
- Written testimonials or quotes you approve or provide;
- Recorded testimonials;
- Before-and-after images; and
- Limited progress information expressly authorized by you under Section 6.

---

## Section 4. Permitted Uses

Authorized materials may be used for lawful business purposes such as:

- Company's website;
- Social media channels;
- Email newsletters;
- Digital or print advertising;
- Public relations materials; and
- Internal training materials.

Company may edit, crop, or format authorized materials for these uses, so long as Company does not use them in a defamatory, materially misleading, or false-light manner.

---

## Section 5. Testimonials

If you authorize testimonial use, you represent that any testimonial you provide reflects your honest opinion and experience. Company may make minor edits for grammar, length, or formatting, but Company will not intentionally attribute a materially false statement to you.

Where Company uses a testimonial in advertising, Company intends to comply with applicable FTC endorsement requirements.

---

## Section 6. Sensitive Health and Progress Information

### 6.1 Before-and-After Content

Before-and-after images may be especially sensitive in a health and fitness context. Company will not use before-and-after images unless you expressly opt in below.

### 6.2 Progress Metrics

Company will not use identifiable body composition metrics, weight-change metrics, or other sensitive progress information unless you expressly opt in below.

### 6.3 Additional Privacy Limits

Nothing in this Release authorizes Company to use protected health information, sensitive health data, or clinical records beyond what you expressly authorize here and what is otherwise permitted by applicable law. If Company intends to use health-related information in a way that requires additional authorization, Company will request that authorization separately.

---

## Section 7. Scope of Authorization

Check only the permissions you want to grant:

- {{OPT_IN_MARKETING_SOCIAL}} **Photographs and general video** — Posed, candid, or action photos/video taken in connection with Company services
- {{OPT_IN_TESTIMONIAL_WRITTEN}} **Written testimonial** — Written quote, review, or testimonial attributed to me
- {{OPT_IN_TESTIMONIAL_RECORDED}} **Recorded testimonial** — Audio or video testimonial provided by me
- {{OPT_IN_BEFORE_AFTER}} **Before-and-after images** — Side-by-side progress images with general timing context
- {{OPT_IN_PROGRESS_METRICS}} **Identifiable progress metrics** — Body composition or similar progress data used with my image, likeness, or testimonial
- {{OPT_IN_SOCIAL_MEDIA}} **Social media use** — Use of any authorized materials on Company social channels

If no box is checked, **no authorization is granted**.

---

## Section 8. Compensation and Waiver

Unless a separate written agreement says otherwise, no compensation is owed for any authorized use under this Release.

For materials you authorize, you waive claims based solely on the ordinary authorized use of those materials, including ordinary claims for right of publicity or invasion of privacy, to the maximum extent permitted by law. This waiver does not apply to defamatory, materially misleading, or unauthorized uses.

---

## Section 9. Revocation

You may revoke this Release at any time by written notice to legal@hollis.health. Revocation applies prospectively only. Company will use commercially reasonable efforts to stop new uses after receipt of revocation, but revocation does not require Company to recall or remove already published materials or archived third-party copies outside Company's control.

---

## Section 10. Governing Law

This Release shall be governed by Texas law. Any dispute arising under this Release shall be resolved in accordance with the applicable dispute resolution provisions governing your relationship with Company, if any.

---

## Section 11. Signature Block

I HAVE READ THIS RELEASE CAREFULLY. I UNDERSTAND ITS TERMS. I AM SIGNING IT FREELY AND VOLUNTARILY.

**RELEASER:**

Signature: {{SIGNATURE}} Date: {{SIGNING_DATE}}

Printed Name: {{MEMBER_NAME}}

---

**FOR HOLLIS HEALTH LLC (Witness/Acceptance):**

Signature: ______________________________________ Date: ______________

Printed Name: ______________________________________

Title: ______________________________________

---

*This document was prepared for attorney review and is not a final legal instrument. Hollis Health LLC makes no representation that this document is legally sufficient without independent legal counsel review.*`;

/**
 * No initials sections — this document uses opt-in checkboxes per use type.
 * The signing flow renders PhotoVideoUseType checkboxes before the signature canvas.
 */
export const initialsSections = [] as const;

/**
 * Opt-in use types for the Photo/Video Release (Section 7).
 * Keys match PHOTO_VIDEO_USE_TYPES in shared/contracts/admin/consent-schemas.ts.
 */
export const useTypes = [
  {
    key: "marketing_social",
    label: "Photographs and general video",
    description:
      "Posed, candid, or action photos/video taken in connection with Company services for use on the Company website, social media, newsletters, advertising, or public relations materials.",
  },
  {
    key: "testimonial_written",
    label: "Written testimonial",
    description:
      "Written quote, review, or testimonial attributed to you for use on the Company website, social media, newsletters, or advertising.",
  },
  {
    key: "testimonial_recorded",
    label: "Recorded testimonial",
    description:
      "Audio or video testimonial provided by you for use in Company training materials, advertising, or public relations.",
  },
  {
    key: "before_after",
    label: "Before-and-after images",
    description:
      "Side-by-side progress images with general timing context.",
  },
  {
    key: "progress_metrics",
    label: "Identifiable progress metrics",
    description:
      "Body composition or similar progress data used with your image, likeness, or testimonial.",
  },
  {
    key: "social_media",
    label: "Social media use",
    description:
      "Use of any authorized materials on Company social channels.",
  },
] as const;

export type PhotoVideoUseTypeKey = (typeof useTypes)[number]["key"];

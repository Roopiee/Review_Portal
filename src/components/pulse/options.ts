// Single source of truth for the enums + display labels used across the
// Pulse flow. Values match the Postgres enums defined in run-migration.ts.

export const DEPARTMENTS = [
  { value: "product_engineering", label: "Product Engineering" },
  { value: "design", label: "Design" },
  { value: "growth_marketing", label: "Growth & Marketing" },
  { value: "client_delivery", label: "Client Delivery" },
  { value: "hr", label: "HR" },
] as const;

export const TENURES = [
  { value: "lt_6m", label: "under 6 months" },
  { value: "m6_12", label: "6–12 months" },
  { value: "y1_3", label: "1–3 years" },
  { value: "y3_5", label: "3–5 years" },
  { value: "y5_plus", label: "5+ years" },
] as const;

export const EMOTIONS = [
  { value: "drained", label: "Drained", emoji: "\u{1F614}" },
  { value: "neutral", label: "Neutral", emoji: "\u{1F610}" },
  { value: "okay", label: "Okay", emoji: "\u{1F642}" },
  { value: "good", label: "Good", emoji: "\u{1F60A}" },
  { value: "great", label: "Great", emoji: "\u{1F929}" },
] as const;

export const ENERGIZERS = [
  "Shipping fast",
  "Cross-team work",
  "Mentoring",
  "Customer impact",
  "Design polish",
  "Hard problems",
  "Quiet focus time",
  "Learning",
] as const;

// Positive-tone keywords surfaced to the user as chips. They feed the
// Mistral prompt that drafts a 4-5 line review.
export const REVIEW_KEYWORDS = [
  "Happy",
  "Positive",
  "Growth",
  "Supportive team",
  "Great culture",
  "Collaborative",
  "Inspiring leadership",
  "Learning",
  "Ownership",
  "Impact",
  "Work-life balance",
  "Recognition",
  "Innovation",
  "Empowerment",
  "Trust",
  "Friendly environment",
  "Career growth",
  "Flexibility",
  "Smart teammates",
  "Meaningful work",
  "Mentorship",
  "Diversity",
  "Transparent leadership",
  "Fast-paced",
] as const;

export const PLATFORMS = [
  {
    value: "ambitionbox",
    label: "AmbitionBox",
    logoClass: "pf-ambition",
    logo: "A",
    href: "https://www.ambitionbox.com/contribute/company-review-v3?campaign=company_info_header&company_name=NetConnectGlobal",
  },
  {
    value: "google",
    label: "Google",
    logoClass: "pf-google",
    logo: "GOOGLE_SVG",
    href: "https://www.google.com/search?q=NetConnectGlobal+Bangalore",
  },
  {
    value: "glassdoor",
    label: "Glassdoor",
    logoClass: "pf-glassdoor",
    logo: "G",
    href: "https://www.glassdoor.co.in/surveys/employer/create?i=648576&j=true&y=&c=PAGE_INFOSITE_TOP&rt=https://www.glassdoor.co.in/Reviews/NetConnectGlobal-Reviews-E648576.htm",
  },
] as const;

export type DepartmentValue = (typeof DEPARTMENTS)[number]["value"];
export type TenureValue = (typeof TENURES)[number]["value"];
export type EmotionValue = (typeof EMOTIONS)[number]["value"];
export type PlatformValue = (typeof PLATFORMS)[number]["value"];

export interface PulseFormData {
  name: string;
  role: string;
  department: DepartmentValue | "";
  tenure: TenureValue | "";
  emotion: EmotionValue;
  energizers: string[];
  reflection: string;
  improvements: string;
  platformsVisited: PlatformValue[];
}

export const INITIAL_FORM_DATA: PulseFormData = {
  name: "",
  role: "",
  department: "",
  tenure: "",
  emotion: "good",
  energizers: ["Shipping fast", "Cross-team work", "Design polish"],
  reflection: "",
  improvements: "",
  platformsVisited: [],
};

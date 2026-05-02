/** ISO 3166-1 alpha-2 (lowercase) — used with flagcdn.com PNG assets */
export type CountryEntry = {
  name: string;
  iso2: string;
};

export const COUNTRIES_WITH_FLAGS: CountryEntry[] = [
  { name: "United Kingdom", iso2: "gb" },
  { name: "United States", iso2: "us" },
  { name: "Canada", iso2: "ca" },
  { name: "Australia", iso2: "au" },
  { name: "Germany", iso2: "de" },
  { name: "France", iso2: "fr" },
  { name: "Italy", iso2: "it" },
  { name: "Spain", iso2: "es" },
  { name: "Netherlands", iso2: "nl" },
  { name: "UAE", iso2: "ae" },
  { name: "Saudi Arabia", iso2: "sa" },
  { name: "New Zealand", iso2: "nz" },
  { name: "Ireland", iso2: "ie" },
  { name: "Sweden", iso2: "se" },
  { name: "Portugal", iso2: "pt" },
  { name: "Japan", iso2: "jp" },
];

export const SERVICE_ITEMS = [
  {
    title: "Visa strategy & eligibility",
    description:
      "Route planning, timelines, and eligibility checks tailored to your profile and destination.",
  },
  {
    title: "Application & documentation",
    description:
      "Form preparation, document lists, and review packs so submissions stay complete and consistent.",
  },
  {
    title: "Compliance & updates",
    description:
      "Policy change alerts and checklist tracking until decision — study, work, visit, and family routes.",
  },
];

export const BENEFIT_ITEMS = [
  "Dedicated adviser workflow with clear milestones",
  "Referral-friendly dashboard for verified activity",
  "Secure handling of sensitive documents",
  "Faster turnaround with structured review cycles",
  "Transparent progress toward referral goals",
];

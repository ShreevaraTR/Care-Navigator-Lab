import type { PlanSource } from "@/domain/plan-knowledge";

export const BENEFITS_OVERVIEW = "rhus-benefits-overview-2025-12-16";
export const PUBLIC_PAGE = "rhus-public-page-2026-10-03";

export const rhusSources: PlanSource[] = [
  {
    id: BENEFITS_OVERVIEW,
    title: "Remote Health USA — Benefits overview",
    publisher: "SafetyWing",
    plan: "Remote Health USA",
    authority: "benefits_overview",
    url: "https://safetywing.com/api/policy/113",
    documentVersion: "RH USA benefits synopsis Full_2025-12-16",
    documentDate: "2025-12-16",
    pages: 21,
    accessedAt: "2026-10-03",
    localExtract: "docs/plan-sources/rhus-benefits-overview-2025-12-16.extract.txt",
    sha256: "077a86d39535d55e507fc706b232929059ce328245bdd45c8c4b253d7591cf04",
    notes:
      "States that it 'reflects the coverage in the official Summary Plan Document (SPD) in a friendlier format' (p.15). The SPD governs where they differ. Pages 16–21 cover optional dental/vision add-ons.",
  },
  {
    id: PUBLIC_PAGE,
    title: "Remote Health USA public plan page",
    publisher: "SafetyWing",
    plan: "Remote Health USA",
    authority: "public_page",
    url: "https://safetywing.com/remote-health-us",
    documentVersion: "Live web page (no version string)",
    accessedAt: "2026-10-03",
    localExtract: "docs/plan-sources/rhus-public-page-2026-10-03.extract.txt",
    notes: "Marketing page with a legal disclosure and FAQ. Used for plan structure and eligibility. Benefit details defer to the benefits overview.",
  },
];

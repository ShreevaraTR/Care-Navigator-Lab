import type { Skill } from "@/domain/taxonomy";

/**
 * Case specifications that cannot be built yet because the source material they depend on is missing.
 * They are deliberately NOT simulation cases: no tasks, no answers, nothing a grader could use.
 */
export interface BlockedCaseSpec {
  slot: string;
  title: string;
  status: "BLOCKED_PENDING_SPD";
  difficulty: "complex";
  scenario: string;
  skills: Skill[];
  /** Plan rules it would use that already exist in the knowledge base. */
  existingRules: string[];
  concepts: string[];
  /** What must be sourced before the case can be written. */
  blockedBy: string[];
  /** Questions the SPD must answer. Do NOT answer them from memory or general practice. */
  openQuestions: string[];
  /** When unblocked, this spec can replace or extend a numbered portfolio case. */
  replaces?: number;
}

export const appealsPlaceholder: BlockedCaseSpec = {
  slot: "A1",
  title: "Medical-necessity denial: the member wants to appeal",
  status: "BLOCKED_PENDING_SPD",
  difficulty: "complex",
  scenario:
    "A pre-authorization for a specialty service is denied as not medically necessary. The treating physician believes the reviewer lacked key documentation. The member asks how to appeal, how long it takes, and whether they can get the service in the meantime.",
  skills: ["appeals", "denials", "specialty_authorization", "prior_auth", "provider_communication", "member_communication", "plain_english"],
  existingRules: ["rhus.structure.medical_necessity", "rhus.structure.spd_governs", "rhus.structure.bywater_tpa", "rhus.pa.member_must_confirm"],
  concepts: ["appeal", "denial", "medical-necessity", "prior-authorization", "care-coordination", "member-communication"],
  blockedBy: [
    "Remote Health USA Summary Plan Description (SPD): claims and appeals procedures section",
    "Any administrator (Bywater) appeal instructions referenced by the SPD",
  ],
  openQuestions: [
    "Who may file (member, authorized representative, provider) and how (form, address, portal)?",
    "Filing deadlines after a denial, and decision timeframes (standard vs. urgent/expedited)",
    "How many internal appeal levels exist, and whether external review is available",
    "What documentation is required or recommended",
    "Whether pre-service (authorization) and post-service (claim) appeals differ",
    "How the plan communicates appeal decisions",
  ],
};

export const blockedSpecs: BlockedCaseSpec[] = [appealsPlaceholder];

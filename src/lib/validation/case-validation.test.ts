import { describe, expect, it } from "vitest";
import { sample01MriBill } from "@/content/cases/sample-01-mri-bill";
import { CaseSchema, type SimulationCaseInput } from "@/domain/case";
import { caseFact, planRule } from "@/domain/provenance";
import { validateCaseContent, type IssueCode } from "./case-validation";

/** Clone the sample, apply a mutation, and return the issue codes it produces. */
function codesFor(mutate: (c: SimulationCaseInput) => void): IssueCode[] {
  const c = structuredClone(sample01MriBill);
  mutate(c);
  return validateCaseContent(CaseSchema.parse(c)).map((i) => i.code);
}

const doc = <T extends string>(c: SimulationCaseInput, type: T) =>
  c.documents.find((d) => d.type === type) as Extract<SimulationCaseInput["documents"][number], { type: T }>;
const addReasoning = (text: string) => (c: SimulationCaseInput) => c.debrief.correctReasoning.push(text);

describe("sample case", () => {
  it("passes every content check", () => {
    expect(validateCaseContent(CaseSchema.parse(sample01MriBill))).toEqual([]);
  });

  it("no longer applies coinsurance to the in-network MRI", () => {
    const all = JSON.stringify(sample01MriBill);
    expect(all).not.toMatch(/member will likely owe 20%/i);
    expect(all).not.toMatch(/may owe your usual share for imaging \(20%/i);
  });
});

describe("quality control: required failures", () => {
  it("fails when an in-network MRI is said to carry 20% coinsurance (text)", () => {
    expect(codesFor(addReasoning("After reprocessing, the member will owe 20% coinsurance on the allowed amount."))).toContain("IN_NETWORK_COST_SHARE");
  });

  it("fails when an in-network EOB line applies coinsurance", () => {
    expect(codesFor((c) => (doc(c, "eob").lines[0].coinsurance = 48000))).toContain("IN_NETWORK_COST_SHARE");
  });

  it("allows out-of-network coinsurance statements", () => {
    expect(codesFor(addReasoning("Out of network, the member would pay up to 30% coinsurance after the $1,000 deductible."))).toEqual([]);
  });

  it("fails when a plan rule is restated with different text", () => {
    expect(
      codesFor((c) => {
        const item = doc(c, "benefit_summary").items[0];
        item.value = "Covered at 80% after deductible";
      }),
    ).toContain("PLAN_RULE_RESTATED");
  });

  it("fails when text contradicts a registered plan value", () => {
    expect(codesFor(addReasoning("The in-network deductible is $1,500 for this member."))).toContain("CONTRADICTS_PLAN_RULE");
    expect(codesFor(addReasoning("The prior authorization penalty is 20% of the charge, up to $1,000."))).toContain("CONTRADICTS_PLAN_RULE");
  });

  it("fails when a simulated fact is presented as Remote Health USA policy", () => {
    expect(
      codesFor((c) => doc(c, "benefit_summary").items.push({ label: "Imaging coinsurance", value: "20% after deductible", provenance: caseFact() })),
    ).toContain("SIMULATED_FACT_AS_PLAN_RULE");
  });

  it("fails when a case says a service requires authorization and the source says otherwise", () => {
    expect(codesFor((c) => (doc(c, "authorization").requirement = { benefitKey: "pcp_visit", required: true }))).toContain("PREAUTH_CONTRADICTION");
  });

  it("fails when a case says MRI needs no authorization", () => {
    expect(codesFor((c) => (doc(c, "authorization").requirement = { benefitKey: "diagnostic_mri", required: false }))).toContain("PREAUTH_CONTRADICTION");
  });

  it("fails when an unclear pre-auth rule is relied on without acknowledgement", () => {
    expect(codesFor((c) => (doc(c, "authorization").requirement = { benefitKey: "diagnostic_labs", required: true }))).toContain("UNCLEAR_PLAN_RULE");
  });

  it("fails when the member is said to owe money while the EOB shows $0", () => {
    expect(codesFor(addReasoning("The member owes $2,400 to Lakeside."))).toContain("OWES_DESPITE_ZERO_EOB");
    expect(codesFor(addReasoning("Jordan is responsible for $480 after reprocessing."))).toContain("OWES_DESPITE_ZERO_EOB");
  });

  it("does not flag negated statements about the $0 EOB", () => {
    expect(codesFor(addReasoning("The member does not owe $2,400 based on the EOB."))).toEqual([]);
  });

  it("fails when the EOB amount task disagrees with the EOB", () => {
    expect(
      codesFor((c) => {
        const cr = c.tasks.find((t) => t.id === "t-eob-owed")!.criteria[0];
        cr.grading = { mode: "auto_amount", expectedCents: 240000, toleranceCents: 0 };
      }),
    ).toContain("EOB_AMOUNT_MISMATCH");
  });

  it("fails when a provider bill is treated as an EOB", () => {
    expect(codesFor((c) => (doc(c, "provider_bill").title = "EOB from Lakeside"))).toContain("BILL_TREATED_AS_EOB");
    expect(codesFor(addReasoning("The EOB is a bill the member must pay."))).toContain("BILL_TREATED_AS_EOB");
  });

  it("fails when CPT is treated as a diagnosis", () => {
    expect(codesFor((c) => (c.codes![0].role = "diagnosis"))).toContain("CPT_AS_DIAGNOSIS");
    expect(codesFor((c) => (doc(c, "claim").lines[0].diagnosisCodes = ["72148"]))).toContain("CPT_AS_DIAGNOSIS");
    expect(codesFor(addReasoning("The CPT code 72148 describes the diagnosis."))).toContain("CPT_AS_DIAGNOSIS");
  });

  it("fails when ICD-10 is treated as the procedure performed", () => {
    expect(codesFor((c) => (c.codes![1].role = "service"))).toContain("ICD_AS_PROCEDURE");
    expect(codesFor((c) => (doc(c, "claim").lines[0].code = "M54.16"))).toContain("ICD_AS_PROCEDURE");
    expect(codesFor(addReasoning("The ICD-10 code M54.16 describes the procedure performed."))).toContain("ICD_AS_PROCEDURE");
  });

  it("fails when a SafetyWing-specific appeals rule is invented", () => {
    expect(codesFor(addReasoning("Under Remote Health USA, appeals must be filed within 180 days of the denial."))).toContain("INVENTED_APPEALS_RULE");
    expect(
      codesFor((c) => {
        c.knowledge.planRules!.push("rhus.appeals.deadline");
        c.tasks[0].criteria[0].basis.push({ kind: "plan_rule", ruleId: "rhus.appeals.deadline" });
      }),
    ).toContain("UNKNOWN_PLAN_RULE");
  });

  it("fails when a fictional plan is presented as Remote Health USA", () => {
    expect(
      codesFor((c) => {
        c.plan = { planId: "fictional", name: "Remote Health USA (training)", provenance: caseFact() };
      }),
    ).toContain("FICTIONAL_PLAN_PRESENTED_AS_REAL");
  });

  it("fails when a criterion's basis is not declared or does not exist", () => {
    expect(codesFor((c) => c.tasks[0].criteria[0].basis.push({ kind: "case_fact", documentId: "doc-missing" }))).toContain("UNKNOWN_CASE_FACT");
    expect(
      codesFor((c) => {
        c.tasks[0].criteria[0].basis.push({ kind: "plan_rule", ruleId: "rhus.cost.oop.out_of_network" });
      }),
    ).toContain("UNDECLARED_PLAN_RULE");
    expect(
      codesFor((c) => {
        const d = doc(c, "benefit_summary");
        d.items[0].provenance = planRule("rhus.made_up.rule");
        d.items[0].ruleId = "rhus.made_up.rule";
      }),
    ).toContain("UNKNOWN_PLAN_RULE");
  });
});

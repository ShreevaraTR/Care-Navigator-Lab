import { CaseSchema, type SimulationCase, type SimulationCaseInput } from "@/domain/case";
import type { Provenance } from "@/domain/provenance";
import { planSources } from "@/content/plan-sources";
import { sample01MriBill } from "./sample-01-mri-bill";

/** Register new cases here. Each is validated against the schema at load time. */
const rawCases: SimulationCaseInput[] = [sample01MriBill];

/** Collect every provenance object in a case so plan_rule citations can be checked. */
function collectProvenance(value: unknown, out: Provenance[] = []): Provenance[] {
  if (Array.isArray(value)) value.forEach((v) => collectProvenance(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "provenance" && v && typeof v === "object") out.push(v as Provenance);
      else collectProvenance(v, out);
    }
  }
  return out;
}

export function validateCase(raw: SimulationCaseInput): SimulationCase {
  const parsed = CaseSchema.parse(raw);
  const known = new Set(planSources.map((s) => s.id));
  for (const p of collectProvenance(parsed)) {
    if (p.kind === "plan_rule" && !known.has(p.sourceRef ?? ""))
      throw new Error(`${parsed.id}: plan_rule cites unregistered source "${p.sourceRef}"`);
  }
  return parsed;
}

export const cases: SimulationCase[] = rawCases.map(validateCase);

export const caseById = (id: string) => cases.find((c) => c.id === id);

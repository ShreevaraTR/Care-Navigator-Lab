import { CaseSchema, type SimulationCase, type SimulationCaseInput } from "@/domain/case";
import { validateCaseContent } from "@/lib/validation/case-validation";
import { sample01MriBill } from "./sample-01-mri-bill";
import { portfolioCases } from "./portfolio";

/** Register new cases here. Each is schema-checked and content-validated at load time. */
const rawCases: SimulationCaseInput[] = [sample01MriBill, ...portfolioCases];

export class CaseValidationError extends Error {
  constructor(
    readonly caseId: string,
    readonly issues: { code: string; message: string }[],
  ) {
    super(`${caseId} failed validation:\n${issues.map((i) => `  [${i.code}] ${i.message}`).join("\n")}`);
  }
}

export function validateCase(raw: SimulationCaseInput): SimulationCase {
  const parsed = CaseSchema.parse(raw);
  const issues = validateCaseContent(parsed);
  if (issues.length) throw new CaseValidationError(parsed.id, issues);
  return parsed;
}

export const cases: SimulationCase[] = rawCases.map(validateCase);

export const caseById = (id: string) => cases.find((c) => c.id === id);

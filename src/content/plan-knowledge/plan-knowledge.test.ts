import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { benefits, planRules, planSources, preAuthList, ruleById } from "./index";

const root = process.cwd();

/** Normalise typography and whitespace so verbatim quotes can be matched against PDF/HTML extracts. */
export const normalize = (s: string) =>
  s
    .replace(/[‘’ʼ′]/g, "'")
    .replace(/[“”ˮʺ]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

function loadPages(path: string): Map<number, string> {
  const text = readFileSync(resolve(root, path), "utf8");
  const pages = new Map<number, string>();
  const parts = text.split(/^=+ PAGE (\d+)$/m);
  for (let i = 1; i < parts.length; i += 2) pages.set(Number(parts[i]), normalize(parts[i + 1]));
  pages.set(0, normalize(text)); // whole document
  return pages;
}

const extracts = new Map(planSources.map((s) => [s.id, loadPages(s.localExtract)]));

describe("plan knowledge base", () => {
  it("has unique rule ids", () => {
    expect(new Set(planRules.map((r) => r.id)).size).toBe(planRules.length);
  });

  it("every citation points at a registered source", () => {
    for (const r of planRules) for (const c of r.citations) expect(extracts.has(c.sourceId), `${r.id} → ${c.sourceId}`).toBe(true);
  });

  it("every quote appears verbatim in the cited page of the source extract", () => {
    const failures: string[] = [];
    for (const r of planRules) {
      for (const c of r.citations) {
        const pages = extracts.get(c.sourceId)!;
        const haystack = pages.get(c.page ?? 0);
        if (!haystack) {
          failures.push(`${r.id}: page ${c.page} missing`);
          continue;
        }
        for (const segment of c.quote.split(" … ").map(normalize))
          if (!haystack.includes(segment)) failures.push(`${r.id} (p.${c.page ?? "-"}): "${segment}"`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("covers all twenty pre-authorization list items A–T", () => {
    expect(preAuthList.map((p) => p.letter).join("")).toBe("ABCDEFGHIJKLMNOPQRST");
  });

  it("pre-auth list links point at real benefits", () => {
    const keys = new Set(benefits.map((b) => b.key));
    for (const p of preAuthList) for (const k of p.benefitKeys) expect(keys.has(k), `${p.letter} → ${k}`).toBe(true);
    for (const b of benefits) for (const l of b.preAuthListRefs) expect(preAuthList.some((p) => p.letter === l)).toBe(true);
  });

  it("benefit entries that claim a list letter must be required / partial / unclear", () => {
    for (const b of benefits) if (b.preAuthListRefs.length) expect(b.preAuth, b.key).not.toBe("not_stated");
  });

  it("encodes the core MRI facts correctly", () => {
    const mri = benefits.find((b) => b.key === "diagnostic_mri")!;
    expect(mri.inNetwork?.planPaysPct).toBe(100);
    expect(mri.outOfNetwork).toMatchObject({ planPaysPct: 70, afterDeductible: true });
    expect(mri.preAuth).toBe("required");
    expect(ruleById("rhus.cost.deductible.in_network")?.statement).toMatch(/\$0 individual \/ \$0 family/);
    expect(ruleById("rhus.pa.penalty")?.statement).toMatch(/10%.*\$500/);
  });

  it("covers every benefit topic required by the knowledge-base spec", () => {
    const required = [
      "physician_services_hospital", "pcp_visit", "specialist_visit", "urgent_care", "emergency_services", "hospital_room", "surgery",
      "day_surgery", "oral_surgery", "diagnostic_mri", "diagnostic_ct", "diagnostic_pet", "diagnostic_labs", "mental_health", "substance_use",
      "physical_therapy", "speech_therapy", "occupational_therapy", "home_health", "hospice", "dialysis", "oncology", "infusion", "dme",
      "prosthetics", "preventive_routine", "maternity_delivery", "reproductive_underlying_cause", "acupuncture", "chiropractic",
      "pharmacy_retail", "hearing_aids", "diabetic_supplies", "ambulance_emergency",
    ];
    const keys = new Set(benefits.map((b) => b.key));
    expect(required.filter((k) => !keys.has(k))).toEqual([]);
  });
});

describe("generated rules register", () => {
  it("docs/plan-sources/RHUS_RULES.md is up to date (run `npm run kb:docs`)", async () => {
    const { renderRulesDoc } = await import("./rules-doc");
    const { writeFileSync, existsSync } = await import("node:fs");
    const path = resolve(root, "docs/plan-sources/RHUS_RULES.md");
    const expected = renderRulesDoc();
    if (process.env.UPDATE_KB_DOCS) writeFileSync(path, expected);
    expect(existsSync(path) ? readFileSync(path, "utf8") : "").toBe(expected);
  });
});

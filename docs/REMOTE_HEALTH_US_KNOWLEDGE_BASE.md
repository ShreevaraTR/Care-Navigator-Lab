# Remote Health USA knowledge base

This is the lab's single source of truth for **plan-specific** facts about SafetyWing's Remote Health USA plan. If a fact is not in this knowledge base, it is **not a plan rule** in this lab, however plausible it sounds.

- Code: `src/content/plan-knowledge/`
- Generated register of every rule with its citation: [`docs/plan-sources/RHUS_RULES.md`](plan-sources/RHUS_RULES.md)
- Verification extracts of the sources: `docs/plan-sources/*.extract.txt`
- In the app: **Learn → Remote Health USA knowledge base** (`/learn/remote-health-usa`)

> Educational use only. This knowledge base summarises public plan material for training. It is not plan advice and does not replace the Summary Plan Description.

## 1. Source hierarchy

| Rank | Source | Status in this lab |
|---|---|---|
| 1 | **Summary Plan Description (SPD)**: the governing plan document | **Not yet provided.** The benefits overview says it "reflects the coverage in the official Summary Plan Document (SPD) in a friendlier format" (p.15). |
| 2 | **Benefits overview** (official PDF) | Registered. Primary source for costs, benefits, pre-authorization and exclusions. |
| 3 | **Public plan page** (safetywing.com) | Registered. Used for plan structure, roles, eligibility and FAQ statements. |
| n/a | General U.S. insurance knowledge | **Never** a plan rule. Lives in `src/content/learn/concepts.ts` as general concepts. |

When sources disagree, the higher-ranked source wins, and the rule is marked `needs_clarification` until the SPD resolves it.

## 2. Current source documents

| Id | Document | URL | Version / date | Accessed | Integrity |
|---|---|---|---|---|---|
| `rhus-benefits-overview-2025-12-16` | Remote Health USA: Benefits overview (21 pp.) | https://safetywing.com/api/policy/113 | PDF title "RH USA benefits synopsis Full_2025-12-16", created 2025-12-16 | 2026-10-03 | SHA-256 `077a86d3…7591cf04` |
| `rhus-public-page-2026-10-03` | Remote Health USA public page | https://safetywing.com/remote-health-us | Live page, no version string | 2026-10-03 | Text extract committed |

Each source has a committed text extract (`docs/plan-sources/*.extract.txt`): page-marked for the PDF, visible text for the web page. The PDF itself is not committed. Its hash is recorded so a future download can be checked against it.

## 3. How a plan rule is recorded

Every rule (`PlanRule` in `src/domain/plan-knowledge.ts`) has:

| Field | Meaning |
|---|---|
| `id` | Stable id, e.g. `rhus.benefit.diagnostic_mri`, `rhus.pa.penalty` |
| `section` / `topic` | Where it belongs (plan_structure, eligibility, costs, pharmacy, benefits, prior_authorization, exclusions, add_ons) |
| `statement` | Our plain restatement. It must not go beyond the quote. |
| `citations[]` | Source id → source name, URL and version (from the registry), **page number**, **section heading**, **verbatim quote** |
| `status` | `confirmed` or `needs_clarification` |
| `confidence` | `high` / `medium` / `low` |
| `note` | How to read it, or why it needs clarification |

Date accessed and document version come from the source registry.

**Verified automatically:** a test (`plan-knowledge.test.ts`) checks that every quote appears word for word on the cited page of the extract. Quotes that span the PDF's two-column layout are split into segments joined by " … ", and each segment must match. Currently all 130 rules pass.

Three kinds of entries share one rule registry:
- `rhus.<section>.*`: hand-written rules (`rhus/rules.ts`)
- `rhus.benefit.<key>`: one per benefit (`rhus/benefits.ts`): in/out-of-network coverage, limits, pre-authorization status, special conditions
- `rhus.pa.list.<a–t>`: the 20 services on the official pre-authorization list (`rhus/preauth.ts`)

## 4. What the knowledge base covers

### Plan structure and roles
- Employer-sponsored, **self-funded** ERISA plans with integrated medical stop-loss. The source says they are "not traditional insurance plans".
- **Stop-loss** (Roundstone) protects only the plan sponsor, not individual employees.
- **Bywater**: handles claims and plan administration (licensed TPA).
- **SafetyWing**: not an insurer, broker or TPA. It provides setup, information, support and plan-design tools, and does not underwrite or administer plans.
- **Cigna**: provides the PPO **network**. The sources do *not* say Cigna insures the plan or processes claims.
- One PPO plan nationwide. Out-of-network care is allowed but discouraged. In-network providers bill the plan directly. Out-of-network providers may not, in which case the member files.
- Eligibility: **full-time employees only** (no 1099 contractors or part-time). Unlimited family members.

### Costs and member responsibility
| | In network | Out of network |
|---|---|---|
| Deductible | $0 / $0 family | $1,000 / $3,500 family |
| Plan pays (most covered services) | 100% | 70% after deductible (member coinsurance up to 30%) |
| Coinsurance / provider copays | none | up to 30% coinsurance |
| Out-of-pocket limit | $1,000 single / $3,000 family | $2,000 single / $7,000 family |
| Prescriptions | $10 / $30 / $50 copays (retail 30-day, mail 90-day), specialty $50, preventive $0, no deductible | (source doesn't distinguish) |

Plus: deductibles and out-of-pocket limits are tracked separately in vs. out of network. Balance billing is possible out of network above the plan's allowed rate. Out-of-network charges above what the plan agrees to pay, and non-covered services (including pre-authorization penalties), never count toward the out-of-pocket limit. Emergency services for an emergency condition and emergency ambulance are 100% out of network too.

### Benefits
65 entries covering every benefit row in the overview: physician, PCP, specialist, walk-in, urgent care, emergency, ambulance (emergency / non-emergency), hospital room, ICU, surgery, day surgery, oral surgery, wisdom teeth, endoscopy, diagnostic testing (MRI, CT, PET, X-ray and labs as separate entries), genetic and allergy testing, preventive care, mental health, substance use, PT/ST/OT, home health, skilled nursing, hospice, dialysis, cardiac and pulmonary rehab, oncology, injections, infusion, transplants, hyperbaric oxygen, TMJ, DME, hearing aids, prosthetics, diabetic supplies, reproductive health, infertility (not covered), contraception, maternity, acupuncture, chiropractic, all other eligible expenses, and pharmacy tiers.

### Pre-authorization
- Process: the in-network provider usually requests it. The **member is responsible for confirming** it.
- **Penalty:** covered charges reduced by **10%, up to $500**, and the penalty **doesn't count** toward the deductible or out-of-pocket maximum.
- Emergency admission notification: within 24 hours (72 hours on weekends/holidays, by the following Monday).
- The full A–T list (inpatient admissions, transplants, stays over 48 hours, dialysis, chemo/radiation, reconstructive/spinal surgery, hyperbaric oxygen, DME over 30 days and insulin pumps, outpatient SUD programs, outpatient surgery/procedures/private duty nursing, **MRI/PET/CT**, infusion, home health, genetic testing, air/water ambulance, hospice, prosthetics, pain-program injections, morbid-obesity treatment, gender-dysphoria surgery).

The simulator also teaches two distinctions as **general concepts**, not plan rules: *required ≠ obtained*, and *obtained ≠ linked to the claim*.

### Exclusions and add-ons
A selected set of claims-relevant exclusions (not specified as covered, experimental, cosmetic, outside the U.S., weekend admissions, infertility, workers' comp, coverage dates, admin fees and missed appointments, maintenance therapy). Dental and vision add-ons exist only if the employer offered them. Their details are not modelled yet.

## 5. Known limitations and open questions (`needs_clarification`)

| Rule | Issue |
|---|---|
| `rhus.cost.oop.in_network_contributors` | p.2 says non-emergency ambulance counts toward the in-network out-of-pocket limit. p.3 says non-emergency ambulance is not covered. |
| `rhus.benefit.urgent_care` | Benefit row says pre-authorization required. Not on the A–T list. |
| `rhus.benefit.emergency_room_non_emergency` | Same as urgent care. |
| `rhus.benefit.diagnostic_xray`, `rhus.benefit.diagnostic_labs` | The diagnostic-testing row (incl. X-ray, labs) says pre-authorization required. The list names only MRI/PET/CT. |
| `rhus.benefit.mental_health`, `rhus.benefit.substance_use` | Unclear whether office/virtual visits need pre-authorization (list covers inpatient and outpatient SUD programs). |
| `rhus.benefit.maternity_delivery` | No pre-authorization stated on the row. Inpatient admission / stays over 48 hours list items may apply. |
| `rhus.benefit.routine_eye_exam` | Benefit row covers 1 exam. Exclusions say vision exams aren't covered except after eye surgery. |

**Not in any registered source** (never teach as plan rules): appeals/grievance procedures and deadlines, claim filing deadlines, how denials or penalties appear on the administrator's EOB, in-network provider contract terms (e.g. hold-harmless), who must make the emergency notification call, coordination of benefits/subrogation, and waiting periods.

## 6. General concepts vs. plan rules vs. case facts vs. assumptions

| Kind | Where it lives | Label in the app |
|---|---|---|
| **Authoritative plan rule** | `src/content/plan-knowledge` (with citation) | "Plan rule (official)" (blue; links to the rule) |
| **General insurance concept** | `src/content/learn/concepts.ts` | "General concept" |
| **Simulated case fact** | Case documents with `provenance: caseFact()` | "Simulated case fact" |
| **Assumption** | `case.assumptions[]` | "Assumption" |

The app never renders a case fact as a plan rule. A Remote Health USA case's benefit summary may only contain plan-rule items, and their text is pulled from the knowledge base, so it can't be restated differently.

## 7. Versioning

- **Sources** are versioned by document version + access date. A new benefits overview gets a **new source id** (e.g. `rhus-benefits-overview-2026-xx-xx`) and a new extract. Old ones stay for traceability.
- **Rules** keep stable ids. When a source changes a rule, update its statement and citation in the same commit as the new source, then run `npm run kb:docs` and `npm test`.
- **Cases** carry a `version`. Bump it whenever plan logic or content changes. Attempt records store the version they were taken against, and the review page warns on mismatch.
- When the **SPD** arrives: register it with `authority: "spd"`, re-check every `needs_clarification` rule, and add an `appeals` section only from SPD text.

## 8. How cases cite plan rules

```ts
knowledge: { planRules: ["rhus.benefit.diagnostic_mri", "rhus.pa.penalty"], generalConcepts: [...], acknowledgedUnclearRules: [] },
// benefit summary items: text comes from the knowledge base
{ label: "MRI benefit", ruleId: "rhus.benefit.diagnostic_mri", provenance: planRule("rhus.benefit.diagnostic_mri") },
// rubric criteria: every criterion states its basis
basis: [{ kind: "plan_rule", ruleId: "rhus.pa.penalty" }, { kind: "case_fact", documentId: "doc-auth" }],
```

See [`CASE_AUTHORING_GUIDE.md`](CASE_AUTHORING_GUIDE.md) for the full process and the validation rules.

## 9. Updating the knowledge base

1. Download the new source. Save an extract under `docs/plan-sources/` with a metadata header (id, URL, version, accessed date, SHA-256).
2. Register it in `src/content/plan-knowledge/rhus/sources.ts`.
3. Add or update rules with verbatim quotes and page numbers.
4. `npm test`: quote verification must pass.
5. `npm run kb:docs`: regenerates `RHUS_RULES.md`. Commit both.

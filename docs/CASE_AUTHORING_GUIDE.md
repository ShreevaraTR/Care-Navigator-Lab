# Case authoring guide

How we will write the ~20 portfolio cases. A case should feel like a real Care Navigator ticket, test several competencies at once, and be fully explainable from cited knowledge.

## 1. The non-negotiables

1. **Every answer must be explainable** from one of:
   1. a cited **plan rule** (`rhus.*` in the knowledge base),
   2. a registered **general concept** (`src/content/learn/concepts.ts`),
   3. a stated **fictional case fact** (a document in the case), or
   4. a stated **assumption** (`case.assumptions[]`).
2. **Never present a case fact as SafetyWing policy.** Plan facts come only from the knowledge base. If the plan material doesn't say it, the case can't use it as policy.
3. **No invented SafetyWing procedures,** especially appeals: no deadlines, levels or forms until the SPD is registered.
4. **Avoid `needs_clarification` rules** as the hinge of a case. If unavoidable, list the rule in `knowledge.acknowledgedUnclearRules` and add an assumption that makes the scenario unambiguous.
5. **CPT content:** code numbers plus our own plain-language summaries only. Never AMA descriptor text, and never bulk code lists.
6. Fictional people, providers, IDs and amounts. Clearly fictional names. No real providers.

## 2. Case anatomy (`src/domain/case.ts`)

| Part | Purpose |
|---|---|
| `ticket` | The member's message: the trigger, in their words (may contain misunderstandings) |
| `plan` | `planId: "rhus"` (checked against the knowledge base) or `"fictional"` (may not be named as SafetyWing / Remote Health) |
| `knowledge` | Declared plan rules, general concepts, and acknowledged unclear rules |
| `member`, `provider`, `codes` | Context. Codes have `role: "service"` (CPT/HCPCS) or `"diagnosis"` (ICD-10-CM). |
| `documents` | Evidence packet: `claim`, `eob`, `provider_bill`, `authorization`, `benefit_summary`, `note` |
| `assumptions` | What the trainee should take as given |
| `tasks` | Structured findings (single/multi choice, amount), an investigation write-up, a member reply |
| `criteria` | Points, category, expectation, **feedbackIfMissed** (explains *why*), grading mode, **basis** |
| `debrief` | What happened, correct reasoning, model member response, concepts to review |

Documents may be *deliberately wrong* (a provider statement that overbills, a claim missing an authorization number). That's the point of the investigation. The case's **own voice** (model answers, rubric, debrief, correct options) must always be right, and that is what validation checks.

## 3. Writing workflow

1. **Pick a blueprint slot** (section 6) and its target competencies.
2. **List the knowledge** first: which plan rules (open `/learn/remote-health-usa` and copy the ids), which concepts, which facts the documents must establish.
3. **Design the twist**: one or two inconsistencies the trainee must find (bill ≠ EOB, auth not linked, wrong network tier, diagnosis/procedure mismatch, premature bill…).
4. **Build the documents** so the twist is discoverable, not announced. Make the numbers internally consistent (allowed = plan paid + member cost share on covered lines).
5. **Write the tasks**: 5–8 structured findings, 1 investigation write-up, 1 member reply. Use distractor options that reflect real mistakes (e.g. importing coinsurance from another plan).
6. **Write criteria**: every criterion has a `basis`. `feedbackIfMissed` must explain the reasoning, e.g. "You correctly identified X but missed Y, therefore Z."
7. **Write the debrief and model member reply** (80–150 words: empathy, plain English, ownership, no promises, next step).
8. **Register** the case in `src/content/cases/index.ts` and run `npm test`.
9. **Play it end to end** in the app, including self-review, and read the review page as a learner would.

## 4. Automatic validation (`src/lib/validation/case-validation.ts`)

A case **will not load** if any check fails. Each check has a test that proves it fires.

| Code | Fails when… |
|---|---|
| `UNKNOWN_PLAN_RULE` / `UNDECLARED_PLAN_RULE` | A cited rule doesn't exist, or is used without being declared in `knowledge.planRules` |
| `UNCLEAR_PLAN_RULE` | A `needs_clarification` rule (or an "unclear" pre-auth benefit) is relied on without acknowledgement |
| `UNKNOWN_CONCEPT` / `UNDECLARED_CONCEPT` / `UNKNOWN_CASE_FACT` / `UNKNOWN_ASSUMPTION` | A criterion basis points at nothing |
| `SIMULATED_FACT_AS_PLAN_RULE` | A case fact appears in a Remote Health USA benefit summary, or a fictional plan cites plan rules |
| `FICTIONAL_PLAN_PRESENTED_AS_REAL` | A fictional plan is named SafetyWing / Remote Health / Bywater, or summaries are mislabelled |
| `PLAN_RULE_RESTATED` | A plan-rule item supplies its own text instead of the knowledge-base statement |
| `IN_NETWORK_COST_SHARE` | An in-network EOB line has deductible/copay/coinsurance, or the text applies in-network coinsurance/copays (e.g. "20% coinsurance" on an in-network MRI) |
| `CONTRADICTS_PLAN_RULE` | Text gives a different in/out-of-network deductible or pre-auth penalty than the registered rules |
| `PREAUTH_CONTRADICTION` | An authorization record's `requirement` contradicts the benefit's pre-auth status (required where the source states none, or not required where it is) |
| `OWES_DESPITE_ZERO_EOB` | The case's voice says the member owes money while the EOB shows $0 (negations like "does not owe" are fine) |
| `EOB_AMOUNT_MISMATCH` | A task with `measures: "eob_member_responsibility"` expects a different amount than the EOB |
| `BILL_TREATED_AS_EOB` | A provider bill is titled as an EOB (or vice versa), or the text calls an EOB a bill |
| `CPT_AS_DIAGNOSIS` / `ICD_AS_PROCEDURE` | Code roles or fields are swapped, or the text says CPT is the diagnosis / ICD-10 is the procedure |
| `CODE_FORMAT` / `CODE_NOT_REFERENCED` | Malformed codes, or claim/auth/EOB codes that aren't declared in `case.codes` |
| `INVENTED_APPEALS_RULE` | The text states a plan-specific appeals deadline, level or filing rule |

Text checks are heuristics over the case's own voice, so write plainly. If a correct sentence trips a check, rephrase it rather than weakening the check. If a check misses something, add a failing test to `case-validation.test.ts` and then tighten the check.

## 5. Grading and the AI-grader contract

- Structured tasks are auto-graded. Written answers are self-graded against the rubric (for now).
- Any future AI grader must use `buildGraderBrief()` (`src/lib/grading/grader-brief.ts`). It receives **only** the case's declared plan rules (verbatim, with citations), declared concepts, case facts and rubric, plus explicit instructions never to state or confirm any other SafetyWing rule. A test enforces that undeclared rules never reach the grader.
- Scoring: 100-point model (claims 20, EOB 20, CPT/ICD 15, prior auth 15, plan knowledge 10, problem solving 10, communication 10), normalised over the categories a case tests.

## 6. The 20-case portfolio

The portfolio is built. See [`20_CASE_PORTFOLIO.md`](20_CASE_PORTFOLIO.md), which is generated from the case files (`npm run portfolio:docs`), for the case table, skill coverage, scoring-category exposure, prior-authorization situations and task mix. The appeals case is a `BLOCKED_PENDING_SPD` placeholder (`src/content/cases/portfolio/placeholders.ts`) until the SPD is sourced.

Authoring helpers live in `src/content/cases/portfolio/helpers.ts` (`choice`, `selectAll`, `amount`, `investigation`, `memberReply`, `knownVsUnknown`, `planRulesDoc`, `knowledge`, `eobLine`, code builders). `portfolio.test.ts` enforces numbering, the difficulty progression, 3–8 skills per case, a mixed task set, ≥2 cases per portfolio skill, and that every case scores exactly 100 with perfect answers.

Additional validation added in Phase 3: `EOB_ARITHMETIC` (allowed = plan paid + cost share + not covered), `UNTESTED_DELIBERATE_ERROR` (planted document errors must be cited by a criterion), and `PORTFOLIO_SHAPE`.

## 7. Definition of done for a case

- [ ] `npm test` passes (schema + content validation + knowledge base)
- [ ] Every criterion has a basis; every plan fact is a cited rule
- [ ] No `needs_clarification` rule used without acknowledgement and an assumption
- [ ] Numbers are internally consistent across claim, EOB and bill
- [ ] Model member reply: 80–150 words, plain English, no promises, a next step
- [ ] Played end to end in the app; the review reads well
- [ ] `version` bumped if editing an existing case

# Care Navigator Lab

A simulation-based training lab for practising the work of a health-plan **Care Navigator**: U.S. health insurance claims, EOB interpretation, medical billing, prior authorization, CPT/ICD-10 concepts, denials and appeals, provider/member coordination, and explaining all of it clearly to a member.

Each case is a realistic member ticket with an evidence packet (claim, EOB, provider bill, authorization record, benefits, notes). You investigate, answer structured and written tasks, write the member reply, and get a scored review that explains *why* points were lost.

> **Educational simulation only.** Completing cases here does not make anyone a certified coder, claims professional, or insurance professional. Plan-specific content comes only from authoritative material that the user supplies (see [Accuracy rules](#accuracy-rules)).

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # scoring + content validation tests
npm run build      # typecheck + production build
```

Attempts are saved in your browser's localStorage. To back them up, use **Case History → Export all (JSON)**, or export each completed case as a Markdown portfolio record.

## Stack

Vite · React 19 · TypeScript (strict) · React Router · Tailwind CSS v4 · Zod · Vitest. There is no backend yet.

## Structure

```
src/
  app/                 Router
  components/          Layout shell + shared UI primitives (Card, Badge, SourceBadge…)
  domain/              Zod schemas: the data model
    provenance.ts      plan_rule | general_concept | case_fact | assumption
    taxonomy.ts        Scoring categories + weights, case types, skills
    case.ts            Simulation case: ticket, documents, codes, tasks, rubric, debrief
    attempt.ts         An attempt = the portfolio record (answers, grades, score)
  content/
    cases/             Case files (validated at load time)
    learn/             Learn-area topic outline
    plan-sources/      Registry of authoritative plan documents (empty for now)
  lib/
    scoring/           Auto-grading + 100-point scoring engine (unit tested)
    storage/           AttemptRepository interface + localStorage implementation
    stats/             Dashboard aggregates
    portfolio/         Markdown portfolio-record export
  features/
    dashboard/  learn/  simulations/  history/
docs/plan-sources/     Where authoritative Remote Health USA material goes
```

## How a case works

1. **Brief → Start.** Starting creates an `Attempt` and autosaves as you work.
2. **Workspace.** The left column holds the ticket, the evidence documents (tabbed), a code reference and working assumptions. The right column holds investigation notes and tasks.
3. **Tasks** come in five kinds: `single_choice`, `multi_choice`, `amount`, `free_text` (investigation write-up) and `member_response`.
4. **Rubric.** Each task has criteria. Each criterion has a scoring category, a point value, an expectation, and `feedbackIfMissed`, which explains why the points matter.
   - `auto_choice` / `auto_amount` criteria are graded deterministically on submit.
   - `self` criteria (written answers) are graded by the trainee against the model answer. An AI or human reviewer grader can fill the same slot later without schema changes (`gradedBy: "ai" | "reviewer"`).
5. **Review.** Shows the score by category, what you identified correctly, every lost point with its explanation, the correct reasoning, a task-by-task comparison, the suggested member response, skills tested, areas to improve, and concepts to review. It also has reflection and recording-link fields.

### Scoring

Category weights: claims reasoning 20, EOB interpretation 20, CPT/ICD 15, prior authorization 15, plan knowledge 10, problem solving 10, member communication 10.

Each tested category scores `earned / available × weight`. The total is then normalised over the categories the case actually tests, so every case is out of 100. Partial credit is 50%.

## Accuracy rules

Every fact in a case carries **provenance**, and the UI labels it:

| Kind | Meaning |
|---|---|
| `plan_rule` | From authoritative plan material. **Must** cite a registered source in `content/plan-sources`. |
| `general_concept` | General U.S. health insurance concept, not plan-specific. |
| `case_fact` | Fictional fact invented for the simulation. |
| `assumption` | Something the trainee is told to assume. |

Content validation (it runs at load time and in tests) rejects any `plan_rule` that doesn't cite a registered source. The plan-source registry is intentionally empty, so **no Remote Health USA policy exists in the app yet**. The "Remote Health USA fundamentals" topic stays locked until material is added. See [`docs/plan-sources/README.md`](docs/plan-sources/README.md).

**CPT:** only code numbers plus our own plain-language summaries. The AMA descriptor set is never reproduced. **ICD-10-CM** is public domain (CDC/NCHS).

## Adding a case

1. Create `src/content/cases/<id>.ts` exporting a `SimulationCaseInput`. Use `sample-01-mri-bill.ts` as the template.
2. Register it in `src/content/cases/index.ts`.
3. Run `npm test`. Schema, rubric and provenance checks will flag mistakes.
4. Portfolio cases set `portfolioNumber` (1–20) and `isSample: false`. Bump `version` whenever you edit the content.

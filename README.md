# Care Navigator Lab

A simulation-based training lab for practising the work of a health-plan **Care Navigator**: U.S. health insurance claims, EOB interpretation, medical billing, prior authorization, CPT/ICD-10 concepts, denials and appeals, provider/member coordination, and explaining all of it clearly to a member.

Each case is a realistic member ticket with an evidence packet (claim, EOB, provider bill, authorization record, benefits, notes). You investigate, answer structured and written tasks, write the member reply, and get a scored review that explains *why* points were lost.

> **Educational simulation only.** Completing cases here does not make anyone a certified coder, claims professional, or insurance professional. Plan-specific content comes only from official Remote Health USA material, cited page by page (see [Accuracy rules](#accuracy-rules)).

**Docs:** [Remote Health USA knowledge base](docs/REMOTE_HEALTH_US_KNOWLEDGE_BASE.md) · [Case authoring guide](docs/CASE_AUTHORING_GUIDE.md) · [Plan rules register](docs/plan-sources/RHUS_RULES.md)

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # scoring, case validation, knowledge-base quote verification, lessons
npm run typecheck  # TypeScript (app + tests)
npm run build      # typecheck + production build
npm run kb:docs    # regenerate docs/plan-sources/RHUS_RULES.md after editing plan rules
```

Attempts are saved in your browser's localStorage. To back them up, use **Case History → Export all (JSON)**, or export each completed case as a Markdown portfolio record.

## Stack

Vite · React 19 · TypeScript (strict) · React Router · Tailwind CSS v4 · Zod · Vitest. There is no backend yet.

## Structure

```
src/
  app/                    Router
  components/             Layout shell + shared UI primitives (Card, Badge, SourceBadge…)
  domain/                 Zod schemas / types: the data model
    provenance.ts         plan_rule | general_concept | case_fact | assumption
    plan-knowledge.ts     Plan sources, rules, citations, benefits, pre-auth list
    case.ts               Simulation case: ticket, documents, codes, tasks, rubric (with basis), debrief
    attempt.ts            An attempt = the portfolio record
    lesson.ts             7-part lesson model
  content/
    plan-knowledge/       Remote Health USA knowledge base (sources, rules, benefits, pre-auth list)
    learn/                General concepts + lessons
    cases/                Case files (validated at load time)
  lib/
    validation/           Case quality control (plan consistency, coding, EOB, appeals…)
    grading/              Grader contract for future AI grading
    scoring/              Auto-grading + 100-point scoring engine
    storage/  stats/  portfolio/
  features/
    dashboard/  learn/  simulations/  history/
docs/
  REMOTE_HEALTH_US_KNOWLEDGE_BASE.md, CASE_AUTHORING_GUIDE.md
  plan-sources/           Source extracts + generated rules register
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

Every fact carries **provenance**, and the UI labels it:

| Kind | Meaning |
|---|---|
| `plan_rule` | Directly supported by official Remote Health USA material. Must cite a rule id in the knowledge base, which carries a verbatim, page-referenced citation. |
| `general_concept` | General U.S. health insurance concept, not plan-specific. |
| `case_fact` | Fictional fact invented for the simulation. |
| `assumption` | Something the trainee is told to assume. |

Safeguards (all tested):
- Every plan-rule quote is checked word for word against the committed source extract.
- Cases fail to load if they contradict a plan rule, apply in-network coinsurance, treat a bill as an EOB, swap CPT/ICD-10, say the member owes money when the EOB shows $0, contradict the pre-authorization list, present a case fact as policy, or invent a SafetyWing appeals rule.
- The future AI grader only receives the plan rules a case declares.

**CPT:** only code numbers plus our own plain-language summaries. The AMA descriptor set is never reproduced. **ICD-10-CM** is public domain (CDC/NCHS).

## Adding a case

Follow [`docs/CASE_AUTHORING_GUIDE.md`](docs/CASE_AUTHORING_GUIDE.md). In short: declare the plan rules and concepts the case tests, give every rubric criterion a basis, register the case in `src/content/cases/index.ts`, and run `npm test`.

/**
 * Lesson model. Each lesson has seven parts:
 *   1. Explanation  2. Example  3. What to look for  4. Mini exercise  5. Answer  6. Explanation  7. Related concepts
 *
 * Every content block carries a source label. Blocks default to "general_concept". A block that
 * states plan-specific facts must be a `rule` block (renders the official rule and its citation) or
 * set `source: { kind: "plan_rule", ruleIds }`.
 */

export type LessonSource =
  | { kind: "general_concept" }
  | { kind: "plan_rule"; ruleIds: string[] }
  | { kind: "case_fact" }
  | { kind: "assumption" };

export type LessonBlock =
  | { type: "p"; text: string; source?: LessonSource }
  | { type: "list"; items: string[]; ordered?: boolean; source?: LessonSource }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][]; source?: LessonSource }
  | { type: "callout"; tone: "key" | "warn"; text: string; source?: LessonSource }
  /** Renders official rules verbatim from the knowledge base, with citation. */
  | { type: "rules"; ruleIds: string[] }
  /** Renders the official pre-authorization list (A–T). */
  | { type: "preauth_list" };

export interface LessonExercise {
  prompt: string;
  context?: LessonBlock[];
  options: { id: string; label: string }[];
  correctOptionIds: string[];
  /** 5. Answer */
  answer: string;
  /** 6. Explanation */
  explanation: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  summary: string;
  /** 1. Explanation */
  explanation: LessonBlock[];
  /** 2. Example */
  example: { title: string; blocks: LessonBlock[] };
  /** 3. What to look for */
  whatToLookFor: string[];
  /** 4–6. Mini exercise, answer, explanation */
  exercise: LessonExercise;
  /** 7. Related concepts (concept ids) */
  relatedConcepts: string[];
  /** Knowledge-base topics this lesson relates to (rule ids), shown as further reading. */
  planRules: string[];
}

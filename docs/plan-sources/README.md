# Authoritative plan sources

This folder holds the **source of truth** for plan-specific rules (Remote Health USA). It is empty on purpose: the lab must not invent SafetyWing policy.

## Adding material

1. Put the document (or a faithful text extract, with page/section references) in this folder, e.g. `remote-health-usa-plan-details-2026.md`.
2. Register it in `src/content/plan-sources/index.ts`:

   ```ts
   { id: "rhu-plan-details-2026", title: "Remote Health USA: Plan details", plan: "Remote Health USA",
     effectiveDate: "2026-01-01", location: "docs/plan-sources/remote-health-usa-plan-details-2026.md",
     addedAt: "2026-10-03" }
   ```

3. Cite it from case content:

   ```ts
   provenance: { kind: "plan_rule", sourceRef: "rhu-plan-details-2026", locator: "§4.2 Prior authorization" }
   ```

Validation fails if a `plan_rule` cites an unregistered source. Anything not backed by a document here must be labelled `general_concept`, `case_fact` or `assumption`.

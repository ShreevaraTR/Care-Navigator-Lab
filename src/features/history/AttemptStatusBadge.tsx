import { Badge } from "@/components/ui";
import type { AttemptStatus } from "@/domain/attempt";

export function AttemptStatusBadge({ status }: { status: AttemptStatus }) {
  if (status === "completed") return <Badge tone="green">Completed</Badge>;
  if (status === "awaiting_self_review") return <Badge tone="amber">Needs self-review</Badge>;
  return <Badge tone="brand">In progress</Badge>;
}

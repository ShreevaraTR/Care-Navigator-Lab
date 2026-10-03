import { useState } from "react";
import type { Answer } from "@/domain/attempt";
import type { Task } from "@/domain/case";
import { cx } from "@/components/ui";
import { formatCents, parseDollarsToCents } from "@/lib/format/money";

interface Props {
  task: Task;
  answer: Answer | undefined;
  onChange: (a: Answer) => void;
  disabled?: boolean;
}

export function TaskInput({ task, answer, onChange, disabled }: Props) {
  if (task.kind === "single_choice" || task.kind === "multi_choice") {
    const multi = task.kind === "multi_choice";
    const picked = answer?.kind === "choice" ? answer.optionIds : [];
    return (
      <div className="space-y-1.5">
        {task.options!.map((o) => {
          const checked = picked.includes(o.id);
          return (
            <label
              key={o.id}
              className={cx(
                "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-[13px] transition-colors",
                checked ? "border-brand bg-brand-soft" : "border-line hover:bg-slate-50",
                disabled && "cursor-default opacity-70",
              )}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={task.id}
                checked={checked}
                disabled={disabled}
                className="mt-0.5 accent-brand"
                onChange={() => {
                  const next = multi ? (checked ? picked.filter((id) => id !== o.id) : [...picked, o.id]) : [o.id];
                  onChange({ kind: "choice", optionIds: next });
                }}
              />
              <span>{o.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (task.kind === "amount") return <AmountInput answer={answer} onChange={onChange} disabled={disabled} />;

  const text = answer?.kind === "text" ? answer.text : "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <textarea
        className="field min-h-36 resize-y"
        value={text}
        disabled={disabled}
        placeholder={task.kind === "member_response" ? "Hi …" : "Your reasoning…"}
        onChange={(e) => onChange({ kind: "text", text: e.target.value })}
      />
      <div className="mt-1 text-right text-[11px] text-ink-faint">{words} words</div>
    </div>
  );
}

function AmountInput({ answer, onChange, disabled }: Omit<Props, "task">) {
  const cents = answer?.kind === "amount" ? answer.cents : null;
  const [raw, setRaw] = useState(cents === null ? "" : (cents / 100).toFixed(2));
  const invalid = raw.trim() !== "" && parseDollarsToCents(raw) === null;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-44">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted">$</span>
        <input
          inputMode="decimal"
          className={cx("field num pl-6", invalid && "border-rose-400")}
          value={raw}
          disabled={disabled}
          placeholder="0.00"
          onChange={(e) => {
            setRaw(e.target.value);
            onChange({ kind: "amount", cents: parseDollarsToCents(e.target.value) });
          }}
        />
      </div>
      {cents !== null && !invalid && <span className="num text-[12px] text-ink-muted">{formatCents(cents)}</span>}
      {invalid && <span className="text-[12px] text-rose-700">Enter a dollar amount</span>}
    </div>
  );
}

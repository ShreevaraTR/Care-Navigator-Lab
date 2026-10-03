import { useSyncExternalStore } from "react";
import { AttemptSchema, type Attempt } from "@/domain/attempt";

/**
 * Persistence boundary for attempts.
 *
 * Phase 1 stores attempts in the browser's localStorage. Everything else in the app talks
 * to the AttemptRepository interface, so swapping in a server/database later only means
 * writing another implementation.
 */
export interface AttemptRepository {
  list(): Attempt[];
  get(id: string): Attempt | undefined;
  save(attempt: Attempt): void;
  remove(id: string): void;
  subscribe(listener: () => void): () => void;
}

const STORAGE_KEY = "cnl.attempts.v1";

class LocalStorageAttemptRepository implements AttemptRepository {
  private cache: Attempt[] | null = null;
  private listeners = new Set<() => void>();

  list(): Attempt[] {
    if (this.cache) return this.cache;
    let parsed: Attempt[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(raw)) {
        // Drop records that no longer match the schema rather than crashing the app.
        parsed = raw.flatMap((r) => {
          const res = AttemptSchema.safeParse(r);
          return res.success ? [res.data] : [];
        });
      }
    } catch {
      parsed = [];
    }
    this.cache = parsed.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    return this.cache;
  }

  get(id: string) {
    return this.list().find((a) => a.id === id);
  }

  save(attempt: Attempt) {
    const others = this.list().filter((a) => a.id !== attempt.id);
    this.write([attempt, ...others]);
  }

  remove(id: string) {
    this.write(this.list().filter((a) => a.id !== id));
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private write(next: Attempt[]) {
    this.cache = [...next].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch {
      // Storage unavailable (private mode / quota). Keep in-memory state so the session still works.
    }
    this.listeners.forEach((l) => l());
  }
}

export const attemptRepository: AttemptRepository = new LocalStorageAttemptRepository();

export function useAttempts(): Attempt[] {
  return useSyncExternalStore(
    (l) => attemptRepository.subscribe(l),
    () => attemptRepository.list(),
  );
}

export function useAttempt(id: string | undefined): Attempt | undefined {
  const all = useAttempts();
  return id ? all.find((a) => a.id === id) : undefined;
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

import { Injectable, signal } from '@angular/core';

/** How long a change stays flagged, in ms. */
const HOLD_MS = 5000;

/**
 * Marks platform status as recently changed.
 *
 * Metrics are polled rather than pushed, so a change surfaces on the next tick
 * and can be up to the poll interval old. The flag therefore means "this moved
 * recently", not "this moved just now" — which is why it dwells rather than
 * flashing.
 */
@Injectable({ providedIn: 'root' })
export class StatusChangeService {
  private readonly seen = new Map<string, string>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly _changed = signal<ReadonlySet<string>>(new Set<string>());

  readonly changed = this._changed.asReadonly();

  /**
   * Feed the current signature of every tracked key. Anything differing from
   * the previous poll is flagged for HOLD_MS. A first sighting is not a change:
   * starting the app should not light up every badge at once.
   */
  track(state: Record<string, string>): void {
    for (const [key, value] of Object.entries(state)) {
      const previous = this.seen.get(key);
      this.seen.set(key, value);
      if (previous !== undefined && previous !== value) {
        this.flag(key);
      }
    }
  }

  isChanged(key: string): boolean {
    return this._changed().has(key);
  }

  private flag(key: string): void {
    const running = this.timers.get(key);
    if (running) clearTimeout(running);

    this._changed.update(keys => new Set(keys).add(key));
    this.timers.set(key, setTimeout(() => {
      this._changed.update(keys => {
        const next = new Set(keys);
        next.delete(key);
        return next;
      });
      this.timers.delete(key);
    }, HOLD_MS));
  }
}

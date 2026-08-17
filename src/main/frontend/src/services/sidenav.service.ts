import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavs: { [key: string]: MatSidenav } = {};
  private readonly activePanelSubject = new BehaviorSubject<string | null>(null);
  public readonly activePanel$ = this.activePanelSubject.asObservable();

  registerSidenav(id: string, sidenav: MatSidenav): void {
    this.sidenavs[id] = sidenav;
  }

  open(id: string): void {
    const currentActivePanel = this.activePanelSubject.value;

    // If opening the same panel, do nothing
    if (currentActivePanel === id) {
      return;
    }

    // Close all other sidenavs
    Object.entries(this.sidenavs).forEach(([sidenavId, sidenav]) => {
      if (sidenavId !== id && sidenav.opened) {
        sidenav.close();
      }
    });

    // Open the requested sidenav. MatSidenav animates its own slide via a
    // 400ms transform transition; adding a competing CSS animation here
    // overrides that transition and makes the panels jump mid-slide.
    const sidenav = this.sidenavs[id];
    if (sidenav && !sidenav.opened) {
      sidenav.open();
      this.activePanelSubject.next(id);
    }
  }

  close(id: string): void {
    const sidenav = this.sidenavs[id];
    if (sidenav && sidenav.opened) {
      sidenav.close();
      this.activePanelSubject.next(null);
    }
  }

  toggle(id: string): void {
    const sidenav = this.sidenavs[id];
    if (!sidenav) return;

    if (sidenav.opened) {
      this.close(id);
    } else {
      this.open(id);
    }
  }

  /**
   * Get the currently active panel ID
   */
  getActivePanel(): string | null {
    return this.activePanelSubject.value;
  }

  /**
   * Notify that a panel was closed externally (e.g., by backdrop click)
   */
  notifyPanelClosed(id: string): void {
    if (this.activePanelSubject.value === id) {
      this.activePanelSubject.next(null);
    }
  }
}

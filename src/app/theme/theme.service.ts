import { Injectable, Inject, EventEmitter } from '@angular/core';
import { THEMES, ACTIVE_THEME, Theme, DEFAULT_THEME } from './symbols';
import { BehaviorSubject, filter, Observable, Subject, take } from 'rxjs';
import { ICONS } from './theme.icons';

@Injectable()
export class ThemeService {
  themeChange = new EventEmitter<Theme>();
  theme: string = null;
  them = new EventEmitter<Theme>();
  iconsChange = new Subject<any>();
  public showLayout: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /***/
  constructor(@Inject(THEMES) public themes: Theme[], @Inject(ACTIVE_THEME) public activeTheme: Observable<string>) {
    this.activeTheme
      .pipe(
        filter((val) => !!val), // filter null val
        take(1), // only take first non-null val
      )
      .subscribe({
        next: (_activeTheme) => {
          this.theme = _activeTheme;
        },
      });
  }

  /**
   * initialize theme
   */
  public init(theme?: string): void {
    this.setTheme(theme || DEFAULT_THEME);
    const active = this.getActiveTheme();
    document.body.classList.add(active.key);

    if (this.getActiveTheme()) {
      this.iconsChange.next(ICONS[this.getActiveTheme().icons]);
    }
    this.initIcons();
  }

  /**
   * return current active theme
   */
  public getActiveTheme(): Theme {
    const theme = this.themes.find((t) => t.key === this.theme) ?? this.themes[this.themes.length - 1];
    if (!theme) {
      throw new Error(`Theme not found: '${this.theme}'`);
    }
    return theme;
  }

  /**
   * set active theme
   *
   * @param newTheme to be active
   */
  public setTheme(newTheme: string): void {
    const oldTheme = this.theme;
    document.body.classList.remove(oldTheme);
    document.body.classList.add(newTheme);
    // Maje the changes and inform all observers
    this.theme = newTheme;
    this.themeChange.emit(this.getActiveTheme());
    this.iconsChange.next(ICONS[this.getActiveTheme().icons]);
  }

  /**
   * initialize theme icons based on current theme
   */
  private initIcons(): void {
    if (this.getActiveTheme()) {
      this.iconsChange.next(ICONS[this.getActiveTheme().icons]);
    }
  }
}

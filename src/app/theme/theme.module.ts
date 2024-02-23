import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from './theme.service';
import { THEMES, ACTIVE_THEME, ThemeOptions } from './symbols';
import { of } from 'rxjs';

@NgModule({
  imports: [CommonModule],
  providers: [ThemeService],
})
export class ThemeModule {
  /**
   * For root method for theme module, for initial default values
   *
   * @param options
   */
  static forRoot(options: ThemeOptions): ModuleWithProviders<ThemeModule> {
    const { useFactory, useValue } = options.active;
    let activeThemeProvider: Provider;

    /**
     * If value is provided use that otherwise use provided factory function
     */
    if (useValue) {
      activeThemeProvider = {
        provide: ACTIVE_THEME,
        useValue: of(useValue),
      };
    } else {
      activeThemeProvider = {
        provide: ACTIVE_THEME,
        useFactory,
      };
    }

    return {
      ngModule: ThemeModule,
      providers: [
        {
          provide: THEMES,
          useValue: options.themes,
        },
        activeThemeProvider,
      ],
    };
  }
}

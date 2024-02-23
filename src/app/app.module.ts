import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { AppComponent } from './app.component';
import { EssentialsModule } from './modules/essentials/essentials.module';
import { THEMES_LIST } from './theme/symbols';
import { ThemeModule } from './theme/theme.module';
import { SpiderChartComponent } from './spider-chart/spider-chart.component'

@NgModule({
  declarations: [AppComponent, SpiderChartComponent],
  imports: [
    BrowserModule,
    ThemeModule.forRoot({
      themes: THEMES_LIST,
      active: {
        useFactory: () => of('dark') as Observable<string>,
      },
    }),
    EssentialsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

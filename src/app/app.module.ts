import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { TreeComponent } from './components/tree/tree.component';
import { HeroComponent } from './components/hero/hero.component';
import { CardHeroComponent } from './components/card-hero/card-hero.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StatisticComponent,
    TreeComponent,
    HeroComponent,
    CardHeroComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

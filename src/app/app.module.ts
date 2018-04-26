import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardHeroComponent } from './components/card-hero/card-hero.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { HeroComponent } from './components/hero/hero.component';
import { MapComponent } from './components/map/map.component';
import { MapSettingsComponent } from './components/map-settings/map-settings.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { TreeComponent } from './components/tree/tree.component';

import { MapService } from './shared/services';


@NgModule({
  declarations: [
    AppComponent,
    CardHeroComponent,
    GameMenuComponent,
    HeroComponent,
    MapComponent,
    MapSettingsComponent,
    StatisticComponent,
    TreeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }

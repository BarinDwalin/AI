import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {
  CardHeroComponent,
  GameMenuComponent,
  HeroComponent,
  ItemComponent,
  MapComponent,
  MapSettingsComponent,
  StatisticComponent,
  TreeComponent,
} from './components';

import { ImageService, MapService } from '@shared/services';
import { HeroSettingsComponent } from './components/map-settings/hero-settings/hero-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    CardHeroComponent,
    GameMenuComponent,
    HeroComponent,
    ItemComponent,
    MapComponent,
    MapSettingsComponent,
    StatisticComponent,
    TreeComponent,
    HeroSettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ImageService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

import { ImageService, MapService } from './shared/services';


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
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [ImageService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }

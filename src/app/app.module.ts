import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {
  CardHeroComponent,
  GameMenuComponent,
  HeroComponent,
  HeroSettingsComponent,
  ItemComponent,
  LandSettingsComponent,
  MapComponent,
  MapSettingsComponent,
  StatisticComponent,
  TreeComponent,
} from './components';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ImageService, MapService } from '@shared/services';

@NgModule({
  declarations: [
    AppComponent,
    CardHeroComponent,
    GameMenuComponent,
    HeroComponent,
    HeroSettingsComponent,
    ItemComponent,
    LandSettingsComponent,
    MapComponent,
    MapSettingsComponent,
    StatisticComponent,
    TreeComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

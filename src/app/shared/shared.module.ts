import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageService, MapService } from '@shared/services';
import { WizardComponent, WizardStepComponent } from '@shared/components';

@NgModule({
  declarations: [
    WizardComponent,
    WizardStepComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    WizardComponent,
    WizardStepComponent,
  ],
  providers: [ImageService, MapService],
})
export class SharedModule { }

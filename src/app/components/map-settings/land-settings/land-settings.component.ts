import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { MapSettings } from '@app/shared/game';


@Component({
  selector: 'app-land-settings',
  templateUrl: './land-settings.component.html',
  styleUrls: ['./land-settings.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandSettingsComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  increaseMapSize() {
    this.updateField('mapSize', 1);
  }
  decreaseMapSize() {
    this.updateField('mapSize', -1);
  }
  addTree() {
    this.updateField('treesCount', 1);
  }
  removeTree() {
    this.updateField('treesCount', -1);
  }

  private updateField(field: string, change: number) {
    const value = this.form.get(['landSettings', field]).value + change;
    this.form.get('landSettings').patchValue({
      [field]: value,
    });
  }
}

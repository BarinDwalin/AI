import {
  ChangeDetectionStrategy, Component, EventEmitter, OnChanges, OnInit, Output, ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MapSettings } from '@shared/game';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSettingsComponent implements OnInit, OnChanges {
  @Output() createGame = new EventEmitter<MapSettings>();
  settings = new MapSettings();
  settingsForm: FormGroup;
  buttonSettings = {
    completeButtonName: 'Создать карту',
  };

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  createForm() {
    this.settingsForm = this.fb.group({
      heroesCount: this.fb.group(this.settings.heroesCount),
      landSettings: this.fb.group({
        mapSize: [ this.settings.mapSize, Validators.required ],
        treesCount: this.settings.treesCount,
      }),
    });
  }
  onSubmit() {
    const settings = this.prepareSaveSettings();
    this.createGame.next(settings);
  }

  rebuildForm() {
    this.settingsForm.reset({
      heroesCount: this.settings.heroesCount,
      mapSize: this.settings.mapSize,
      treesCount: this.settings.treesCount,
    });
  }
  revert() { this.rebuildForm(); }
  prepareSaveSettings(): MapSettings {
    const formModel = this.settingsForm.value;
    const saveMapSettings: MapSettings = {
      heroesCount: Object.assign({}, formModel.heroesCount),
      mapSize: formModel.landSettings.mapSize,
      treesCount: formModel.landSettings.treesCount,
    };
    return saveMapSettings;
  }

}

import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MapSettings } from '@shared/game';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.css']
})
export class MapSettingsComponent implements OnInit, OnChanges {
  @Output() createGame = new EventEmitter<MapSettings>();
  settings = new MapSettings();
  settingsForm: FormGroup;

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
    const settings = new MapSettings();
    this.settingsForm = this.fb.group({
      heroesCount: this.fb.group(settings.heroesCount),
      mapSize: [ settings.mapSize, Validators.required ],
      treesCount: settings.treesCount,
    });
  }
  onSubmit() {
    this.settings = this.prepareSaveSettings();
    console.log(this.settings);
    this.createGame.next(this.settings);
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
      mapSize: formModel.mapSize,
      treesCount: formModel.treesCount,
    };
    return saveMapSettings;
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
  addHero(hero: string) {
    this.updateHeroesCount(hero, 1);
  }
  removeHero(hero: string) {
    this.updateHeroesCount(hero, -1);
  }

  private updateField(field: string, change: number) {
    const value = this.settingsForm.get(field).value + change;
    this.settingsForm.patchValue({
      [field]: value,
    });
  }
  private updateHeroesCount(hero: string, change: number) {
    const heroesCountControl: AbstractControl = this.settingsForm.get('heroesCount');
    const heroesCount = heroesCountControl.get(hero).value + change;
    heroesCountControl.patchValue({
      [hero]: heroesCount,
    });
  }
}

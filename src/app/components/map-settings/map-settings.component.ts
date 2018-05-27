import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.rebuildForm();
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
    // this.settings = this.prepareSaveSettings();
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


  increaseMapSize() {
    this.settings.mapSize++;
  }
  decreaseMapSize() {
    this.settings.mapSize--;
  }
  addTree() {
    this.settings.treesCount++;
  }
  removeTree() {
    this.settings.treesCount--;
  }
  addHero(hero: string) {
    this.settings.heroesCount[hero]++;
  }
  removeHero(hero: string) {
    this.settings.heroesCount[hero]--;
  }
}

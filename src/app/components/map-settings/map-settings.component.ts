import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapSettings } from '../../shared/game';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.css']
})
export class MapSettingsComponent implements OnInit {
  @Output() createGame = new EventEmitter<MapSettings>();
  settings = new MapSettings();

  constructor() { }

  ngOnInit() {
  }

  newGame() {
    this.createGame.next(this.settings);
  }

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

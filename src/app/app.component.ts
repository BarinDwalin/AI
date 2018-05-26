import { Component, OnInit } from '@angular/core';

import { Game, MapSettings } from '@shared/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Собиратели яблок';
  game: Game;

  get isGameRunning() { return !!Game.map; }

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
  }

  createGame(mapSettings: MapSettings) {
    this.game.createMap(mapSettings);
    console.log(Game.map);
  }
}

import { Component, OnInit } from '@angular/core';

import { Game } from './shared/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Собиратели яблок';
  game: Game;
  // настройки карты
  mapSize = 10;
  treesCount = 10;
  heroesCount = {
    thinkingRandom: 5,
    thinkingPickAndRandomMove: 5,
    thinkingSearchPathWithFullMap: 5,
    thinkingSearchPathWithVisibility: 5,
  };
  memoryType: 'shortTerm' | 'longTerm' = 'shortTerm';

  get isGameRunning() { return !!Game.map; }

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
  }

  createGame() {
    this.game.createMap(
      this.mapSize,
      this.treesCount,
      this.heroesCount,
    );
    Game.map = Game.map;
    console.log(Game.map);
  }

  changeMemoryType(memoryType) {
    if (this.memoryType !== memoryType) {
      this.memoryType = memoryType;
    }
  }

  changeTimeout(timeout) {
    this.game.timeout = timeout;
  }

  run() {
    this.game.run();
  }

  stop() {
    this.game.stop();
  }

  increaseMapSize() {
    this.mapSize++;
  }
  decreaseMapSize() {
    this.mapSize--;
  }
  addTree() {
    this.treesCount++;
  }
  removeTree() {
    this.treesCount--;
  }
  addHero(hero: string) {
    this.heroesCount[hero]++;
  }
  removeHero(hero: string) {
    this.heroesCount[hero]--;
  }
}

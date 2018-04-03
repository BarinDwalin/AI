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
  treesCount = 10;
  heroesThinkingRandomCount = 5;
  heroesThinkingSearchPathWithFullMapCount = 5;
  heroesThinkingSearchPathWithVisibilityCount = 5;

  get isGameRunning() { return !!Game.map; }

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
  }

  createGame() {
    this.game.createMap(
      this.treesCount,
      this.heroesThinkingRandomCount,
      this.heroesThinkingSearchPathWithFullMapCount,
      this.heroesThinkingSearchPathWithVisibilityCount,
    );
    Game.map = Game.map;
    console.log(Game.map);
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

  addTree() {
    this.treesCount++;
  }
  removeTree() {
    this.treesCount--;
  }
  addHero(hero: string) {
    switch (hero) {
      case 'ThinkingRandom': this.heroesThinkingRandomCount += 1;
      break;
      case 'ThinkingSearchPathWithFullMap': this.heroesThinkingSearchPathWithFullMapCount += 1;
      break;
      case 'ThinkingSearchPathWithVisibility': this.heroesThinkingSearchPathWithVisibilityCount += 1;
      break;
    }
  }
  removeHero(hero: string) {
    switch (hero) {
      case 'ThinkingRandom': this.heroesThinkingRandomCount -= 1;
      break;
      case 'ThinkingSearchPathWithFullMap': this.heroesThinkingSearchPathWithFullMapCount -= 1;
      break;
      case 'ThinkingSearchPathWithVisibility': this.heroesThinkingSearchPathWithVisibilityCount -= 1;
      break;
    }
  }
}

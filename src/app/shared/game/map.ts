import * as math from './math';

import { Cell, Hero, Item } from '../models';
import { ItemFabric } from './item-fabric';
import { ActionTypes } from './action-types';

export class Map {
  cells: Cell[] = [];
  width = 10;
  height = 10;
  size = this.width * this.height;

  constructor() {
    this.createMap();
  }

  getCell(x: number, y: number) {
    return this.cells[y * this.width + x];
  }

  moveHero(positions: {x: number, y: number}, hero: Hero) {
    const newCell = this.getCell(positions.x, positions.y);
    const oldCell = this.getCell(hero.position.x, hero.position.y);
    const heroIndex = oldCell.items.findIndex((item) => item === hero);

    oldCell.items.splice(heroIndex, 1);
    newCell.putInInventory(hero);
  }

  private createMap() {
    this.cells.length = this.size;
    for (let i = 0; i < this.size; i++) {
      const y = Math.floor(i / this.width);
      const x = i - y * this.width;
      this.cells[i] = new Cell({ x, y });
    }
    for (let i = 0; i < 10; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(ItemFabric.createTree());
    }
    for (let i = 0; i < 5; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingRandom));
    }
    for (let i = 0; i < 5; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingSearchPathWithFullMap));
    }
    /* фиксированное размещение
    [2, 15, 22, 40 55, 56, 65, 66].forEach((index) => {
      this.cells[index].addObject(ItemFabric.createTree());
    });
    [[0, 1], [1, 2], [7, 8], [8, 9]].forEach((position) => {
      const index = position[0] + position[1] * this.width;
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingRandom));
    });
    [[1, 1], [2, 2], [8, 8], [9, 9]].forEach((position) => {
      const index = position[0] + position[1] * this.width;
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingSearchPathWithFullMap));
    });
    */
  }
}

import * as math from './math';

import { Cell, Hero, Item } from '../models';
import { ItemFabric } from './item-fabric';
import { ActionTypes } from './action-types';

export class Map {
  cells: Cell[] = [];
  width = 10;
  height = 10;
  size = this.width * this.height;

  get bounds() { return {
      minX: 0,
      maxX: this.width - 1,
      minY: 0,
      maxY: this.height - 1,
    };
  }

  constructor(
    treesCount: number,
    heroesThinkingRandomCount: number,
    heroesThinkingSearchPathWithFullMapCount: number,
    heroesThinkingSearchPathWithVisibilityCount: number,
  ) {
    this.createMap(
      treesCount,
      heroesThinkingRandomCount, heroesThinkingSearchPathWithFullMapCount, heroesThinkingSearchPathWithVisibilityCount,
    );
  }

  getCell(x: number, y: number) {
    return this.cells[this.getCellIndex(x, y)];
  }
  getCellsInArea(x: number, y: number, radius: number) {
    const cells: Cell[] = [];
    const left = Math.max(this.bounds.minX, x - radius);
    const right = Math.min(this.bounds.maxX, x + radius);
    const top = Math.max(this.bounds.minY, y - radius);
    const bottom = Math.min(this.bounds.maxY, y + radius);
    for (let i = left; i <= right; i++) {
      for (let j = top; j <= bottom; j++) {
        if (Math.pow(x - i, 2) + Math.pow(y - j, 2) < Math.pow(radius, 2)) {
          cells.push(this.getCell(i, j));
        }
      }
    }
    return cells;
  }

  moveHero(positions: {x: number, y: number}, hero: Hero) {
    const newCell = this.getCell(positions.x, positions.y);
    const oldCell = this.getCell(hero.position.x, hero.position.y);
    const heroIndex = oldCell.items.findIndex((item) => item === hero);

    // осмотр мира
    this.getCellsInArea(positions.x, positions.y, hero.visibilityDistance).forEach((cell) => {
      hero.memory.rememberItemsInCell(this.getCellIndex(positions.x, positions.y), cell.items);
    });

    oldCell.items.splice(heroIndex, 1);
    newCell.putInInventory(hero);
  }

  private createMap(
    treesCount: number,
    heroesThinkingRandomCount: number,
    heroesThinkingSearchPathWithFullMapCount: number,
    heroesThinkingSearchPathWithVisibilityCount: number,
  ) {
    this.cells.length = this.size;
    for (let i = 0; i < this.size; i++) {
      const y = Math.floor(i / this.width);
      const x = i - y * this.width;
      this.cells[i] = new Cell({ x, y });
    }
    for (let i = 0; i < treesCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(ItemFabric.createTree());
    }
    for (let i = 0; i < heroesThinkingRandomCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingRandom));
    }
    for (let i = 0; i < heroesThinkingSearchPathWithFullMapCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingSearchPathWithFullMap));
    }
    for (let i = 0; i < heroesThinkingSearchPathWithVisibilityCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(Hero.createHero(ActionTypes.ThinkingSearchPathWithVisibility));
    }
  }
  private getCellIndex(x: number, y: number) {
    return y * this.width + x;
  }
}

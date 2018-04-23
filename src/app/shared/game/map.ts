import * as math from './math';

import { Cell, Hero, Item, ItemTypes } from '../models';
import { HeroFabric } from './hero-fabric';
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
    // все персонажи осматриваются
    this.cells.forEach((cell) => {
      cell.items.filter((item) => item.type === ItemTypes.Hero).forEach((item) => {
        this.saveNearestObjects(cell.position, item as Hero, 0);
      });
    });
  }

  static createEmptyMap(size: number, width: number) {
    const cells: Cell[] = [];
    for (let i = 0; i < size; i++) {
      const y = Math.floor(i / width);
      const x = i - y * width;
      cells[i] = new Cell({ x, y });
    }
    return cells;
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

  moveHero(position: {x: number, y: number}, hero: Hero, round: number) {
    const newCell = this.getCell(position.x, position.y);
    const oldCell = this.getCell(hero.position.x, hero.position.y);
    const heroIndex = oldCell.items.findIndex((item) => item === hero);

    // осмотр мира
    this.saveNearestObjects(position, hero, round);

    oldCell.items.splice(heroIndex, 1);
    newCell.putInInventory(hero);
  }

  private createMap(
    treesCount: number,
    heroesThinkingRandomCount: number,
    heroesThinkingSearchPathWithFullMapCount: number,
    heroesThinkingSearchPathWithVisibilityCount: number,
  ) {
    this.cells = Map.createEmptyMap(this.size, this.width);
    for (let i = 0; i < treesCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(ItemFabric.createTree());
    }
    for (let i = 0; i < heroesThinkingRandomCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(HeroFabric.createHero(ActionTypes.ThinkingRandom));
    }
    for (let i = 0; i < heroesThinkingRandomCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(HeroFabric.createHero(ActionTypes.ThinkingPickAndRandomMove));
    }
    for (let i = 0; i < heroesThinkingSearchPathWithFullMapCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(HeroFabric.createHero(ActionTypes.ThinkingSearchPathWithFullMap));
    }
    for (let i = 0; i < heroesThinkingSearchPathWithVisibilityCount; i++) {
      const index = math.randomIntFromInterval(0, 99);
      this.cells[index].addObject(HeroFabric.createHero(ActionTypes.ThinkingSearchPathWithVisibility));
    }
  }
  private getCellIndex(x: number, y: number) {
    return y * this.width + x;
  }
  private saveNearestObjects(position: {x: number, y: number}, hero: Hero, round: number) {
    this.getCellsInArea(position.x, position.y, hero.visibilityDistance)
    .filter((cell) => cell.items.length !== 0)
    .forEach((cell) => {
      // исключаем информацию о себе
      hero.memory.rememberItemsInCell(
        this.getCellIndex(cell.position.x, cell.position.y),
        cell.items.filter((item) => item !== hero),
        round,
      );
    });
  }
}

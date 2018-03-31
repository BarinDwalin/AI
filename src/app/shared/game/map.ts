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
    this.cells[2].items.push(ItemFabric.createTree());
    this.cells[22].items.push(ItemFabric.createTree());
    this.cells[15].items.push(ItemFabric.createTree());
    this.cells[40].items.push(ItemFabric.createTree());
    this.cells[55].items.push(ItemFabric.createTree());
    this.cells[56].items.push(ItemFabric.createTree());
    this.cells[65].items.push(ItemFabric.createTree());
    this.cells[66].items.push(ItemFabric.createTree());

    [[0, 1], [1, 2], [7, 8], [8, 9]].forEach((position) => {
      const index = position[0] + position[1] * this.width;
      this.cells[index].addObject(Hero.createHero(position[0], position[1], ActionTypes.ThinkingRandom));
    });
    [[1, 1], [2, 2], [8, 8], [9, 9]].forEach((position) => {
      const index = position[0] + position[1] * this.width;
      this.cells[index].addObject(Hero.createHero(position[0], position[1], ActionTypes.ThinkingSearchPathWithFullMap));
    });
  }
}

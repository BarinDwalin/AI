import { ItemTypes } from './item-types';
import { ActionTypes } from '../game/action-types';

export class Item {
  /** все объекты на карте */
  static items: Item[] = [];

  name: string;
  type: ItemTypes;
  todoStack: { action: ActionTypes, args?: any }[] = [];

  protected parent: Item;
  private _inventory: Item[] = [];
  get inventory() { return this._inventory; }
  get position() { return this.parent.position; }

  constructor(name: string, type: ItemTypes) {
    this.name = name;
    this.type = type;

    Item.items.push(this);
  }

  get currentAction(): string {
    if (this.todoStack && this.todoStack[0]) {
      return ActionTypes[this.todoStack[0].action];
    }
    return '...';
  }

  putInInventory(item: Item) {
    item.parent = this;
    this._inventory.push(item);
  }
}

import { ActionTypes } from '@shared/game/action-types';
import { ItemTypes } from './item-types';
import { ItemInfo } from './item-info';

export class Item {
  name: string;
  type: ItemTypes;
  todoStack: { action: ActionTypes, args?: any[] }[] = [];
  /** выполнялись ли действия в данном раунде */
  activated?: boolean;

  protected parent: Item;
  private _inventory: Item[] = [];

  get currentAction(): string {
    if (this.todoStack && this.todoStack[0]) {
      return ActionTypes[this.todoStack[0].action];
    }
    return '...';
  }
  get inventory() { return this._inventory; }
  get position(): { x: number, y: number } { return this.parent.position; }

  constructor(name: string, type: ItemTypes) {
    this.name = name;
    this.type = type;
  }

  convertToInfo() {
    return new ItemInfo(this);
  }
  putInInventory(item: Item) {
    item.parent = this;
    this._inventory.push(item);
  }
}

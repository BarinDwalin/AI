import { ActionTypes } from '@shared/game/action-types';
import { ItemTypes } from './item-types';
import { Item } from './item';

/** срез общей информации по объекту (для сохранения состояния) */
export class ItemInfo {
  name: string;
  type: ItemTypes;
  inventory: ItemInfo[] = [];
  position: { x: number, y: number };

  constructor(item: Item) {
    this.name = item.name;
    this.type = item.type;
    this.inventory = [...item.inventory.map((itemInInventory) => new ItemInfo(itemInInventory))];
    this.position = Object.assign({}, item.position);
  }
  copy() {
    const itemCopy: ItemInfo = Object.assign({}, this);
    itemCopy.inventory = [...this.inventory];
    return itemCopy;
  }
}

import { ActionTypes } from '@shared/game/action-types';
import { Item, ItemTypes } from '@shared/models';

export class ItemFabric {
  /** все объекты на карте */
  static items: Item[] = [];

  static createApple(): Item {
    const apple = new Item('яблоко', ItemTypes.Food);
    this.items.push(apple);
    return apple;
  }

  static createTree(): Item {
    const item = new Item('яблоня', ItemTypes.Tree);
    const firstAction = { action: ActionTypes.Growing, args: [item] };
    item.todoStack.push(firstAction);
    this.items.push(item);
    return item;
  }

}

import { Item, ItemTypes, Hero } from '../models';
import { ActionTypes } from './action-types';

export class ItemFabric {

  static createApple(): Item {
    const apple = new Item('яблоко', ItemTypes.Food);
    return apple;
  }

  static createTree(): Item {
    const item = new Item('яблоня', ItemTypes.Tree);
    const firstAction = { action: ActionTypes.Growing, args: [item] };
    item.todoStack.push(firstAction);
    return item;
  }

}

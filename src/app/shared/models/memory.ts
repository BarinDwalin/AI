import { ActionTypes } from '../game/action-types';
import { ActionResult } from '../game/action-result';

import { Item } from './item';
import { ItemTypes } from './item-types';

export class Memory {
  /** последние действия */
  lastActions: { action: ActionTypes, args: any, result: void | ActionResult } [];
  /** краткосрочная память */
  shortTerm: { cell: number, item: Item } [];
  /** долгосрочная память, какие типы объектов и где встречались
   * свалка всего, TODO: квадродерево*/
  longTerm: { cell: number, item: ItemTypes } [];

  private memorySize = {
    lastActions: 100,
    shortTerm: 100,
    longTerm: 10000,
  };

  constructor(memorySize?: { lastActions: number, shortTerm: number, longTerm: number }) {
    this.lastActions = [];
    this.shortTerm = [];
    this.longTerm = [];
    this.memorySize = memorySize || this.memorySize;
  }

  rememberLastAction(action: ActionTypes, args: any, result: void | ActionResult) {
    if (this.lastActions.length > this.memorySize.lastActions) {
      this.lastActions.shift();
    }
    this.lastActions.push({ action, args, result });
  }
  rememberItemsInCell(cell: number, items: Item[]) {
    // удаляем старую информацию
    this.shortTerm.filter((info) => info.cell === cell).forEach((info) => {
      const index = this.shortTerm.indexOf(info);
      this.shortTerm.splice(index, 1);
    });
    this.longTerm.filter((info) => info.cell === cell).forEach((info) => {
      const index = this.longTerm.indexOf(info);
      this.longTerm.splice(index, 1);
    });

    // обновляем данные
    items.forEach((item) => {
      this.rememberItem(cell, item);
      this.rememberTypeItem(cell, item.type);
    });
  }

  private rememberItem(cell: number, item: Item) {
    if (this.shortTerm.length > this.memorySize.shortTerm) {
      this.shortTerm.shift();
    }
    const copy = Object.assign({}, item);
    this.shortTerm.push({ cell, item: copy });
  }
  private rememberTypeItem(cell: number, type: ItemTypes) {
    if (this.longTerm.some((item) => item.cell === cell && item.item === type)) {
      return;
    }
    if (this.longTerm.length > this.memorySize.longTerm) {
      this.longTerm.shift();
      console.warn('Memory overload');
    }
    this.longTerm.push({ cell, item: type });
  }
}

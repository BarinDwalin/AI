import { ActionTypes } from '../game/action-types';
import { ActionResult } from '../game/action-result';

import { Item } from './item';
import { ItemTypes } from './item-types';

export class Memory {
  /** общее состояние, TODO: хранить все изменения / все показатели состояния */
  contentment: { value: number, round: number, isIncreased: boolean }[];
  /** последние действия */
  lastActions: { action: ActionTypes, args: any, result: void | ActionResult, round: number } [];
  /** краткосрочная память */
  shortTerm: { cell: number, round: number, item: Item } [];
  /** долгосрочная память, какие типы объектов и где встречались
   * свалка всего, TODO: квадродерево*/
  longTerm: { cell: number, round: number, item: ItemTypes } [];

  private memorySize = {
    lastActions: 100,
    shortTerm: 30,
    longTerm: 10000,
  };

  constructor(memorySize?: { lastActions: number, shortTerm: number, longTerm: number }) {
    this.contentment = [];
    this.lastActions = [];
    this.shortTerm = [];
    this.longTerm = [];
    this.memorySize = memorySize || this.memorySize;
  }

  rememberContentment(value: number, round: number) {
    if (this.contentment.length === 0) {
      this.contentment.push({ value, round, isIncreased: false });
    } else {
      const lastValue = this.contentment[this.contentment.length - 1].value;
      if (value !== lastValue) {
        this.contentment.push({ value, round, isIncreased: (value > lastValue) });
      }
    }
  }
  rememberLastAction(action: ActionTypes, args: any, result: void | ActionResult, round: number) {
    if (this.lastActions.length > this.memorySize.lastActions) {
      this.lastActions.shift();
    }
    this.lastActions.push({ action, args, result, round });
  }
  rememberItemsInCell(cell: number, items: Item[], round: number) {
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
      if (this.shortTerm.length >= this.memorySize.shortTerm) {
        this.shortTerm.shift();
      }
      if (this.longTerm.length >= this.memorySize.longTerm) {
        this.longTerm.shift();
      }
      this.rememberItem(cell, item, round);
      this.rememberTypeItem(cell, item.type, round);
    });
  }

  private rememberItem(cell: number, item: Item, round: number) {
    if (this.shortTerm.length > this.memorySize.shortTerm) {
      this.shortTerm.shift();
    }
    const copy = Object.assign({}, item);
    this.shortTerm.push({ cell, item: copy, round });
  }
  private rememberTypeItem(cell: number, type: ItemTypes, round: number) {
    if (this.longTerm.some((item) => item.cell === cell && item.item === type)) {
      return;
    }
    if (this.longTerm.length > this.memorySize.longTerm) {
      this.longTerm.shift();
      console.warn('Memory overload');
    }
    this.longTerm.push({ cell, item: type, round });
  }
}

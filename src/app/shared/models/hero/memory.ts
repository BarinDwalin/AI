import { ActionTypes } from '@shared/game/action-types';
import { ActionResult } from '@shared/game/action-result';

import { Hero } from './hero';
import { HeroInfo } from './hero-info';
import { Item } from '../item/item';
import { ItemTypes } from '../item/item-types';

export class Memory {
  /** все показатели состояния */
  heroStates: { value: HeroInfo, round: number }[];
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
    this.heroStates = [];
    this.lastActions = [];
    this.shortTerm = [];
    this.longTerm = [];
    this.memorySize = memorySize || this.memorySize;
  }

  rememberHeroState(value: Hero, round: number) {
    const heroInfo = new HeroInfo(value);
    if (this.heroStates.length === 0) {
      this.heroStates.push({ value: heroInfo, round });
    } else {
      const lastValue = this.heroStates[this.heroStates.length - 1].value;
      // TODO: заменить на быструю проверку
      if (JSON.parse(JSON.stringify(heroInfo)) !== JSON.parse(JSON.stringify(lastValue))) {
        this.heroStates.push({ value: heroInfo, round });
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

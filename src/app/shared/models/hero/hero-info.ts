import { ActionTypes } from '@shared/game/action-types';
import { ActionResult } from '@shared/game/action-result';

import { Dream } from './dream';
import { HeroStates } from './hero-states';
import { Item } from '../item/item';
import { ItemInfo } from '../item/item-info';
import { ItemTypes } from '../item/item-types';
import { Memory } from './memory';
import { RenderSettings } from '../render-settings';
import { Hero } from './hero';

/** срез общей информации по персонажу (для сохранения состояния) */
export class HeroInfo extends ItemInfo {
  renderSettings: RenderSettings = {
    img: 'hero.svg',
    backgroundColor: 'white',
  };
  description: string;
  memory: Memory;
  /** дальность видимости на карте */
  visibilityDistance: number;

  /** цель персонажа */
  dream: Dream;
  /** общий уровень удовлетворенности, от -1 до 1*/
  contentment: number;
  /** набор текущих состояний, положительно/отрицательно влияющих на персонажа, от -1 до 1 */
  states: { state: HeroStates, value: number }[];

  constructor(hero: Hero) {
    super(hero);
    this.renderSettings = Object.assign({}, hero.renderSettings);
    this.description = hero.description;
    this.visibilityDistance = hero.visibilityDistance;
    this.dream = Object.assign({}, hero.dream);
    this.contentment = hero.contentment;
    this.states = hero.states.map((state) => Object.assign({}, state));
  }

  copy() {
    const heroCopy: HeroInfo = Object.assign({}, this);
    heroCopy.renderSettings = Object.assign({}, this.renderSettings);
    heroCopy.inventory = [...this.inventory];
    heroCopy.states = this.states.map((state) => Object.assign({}, state));
    return heroCopy;
  }
}

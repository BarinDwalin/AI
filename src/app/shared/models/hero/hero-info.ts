import { ActionTypes } from '../../game/action-types';
import { ActionResult } from '../../game/action-result';

import { Dream } from './dream';
import { HeroStates } from './hero-states';
import { Item } from '../item/item';
import { ItemInfo } from '../item/item-info';
import { ItemTypes } from '../item/item-types';
import { Memory } from './memory';
import { RenderSettings } from '../render-settings';

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

  actions: ActionTypes[] = [];
  /** цель персонажа */
  dream: Dream;
  /** общий уровень удовлетворенности, от -1 до 1*/
  contentment: number;
  /** набор текущих состояний, положительно/отрицательно влияющих на персонажа, от -1 до 1 */
  states: { state: HeroStates, value: number }[];
}

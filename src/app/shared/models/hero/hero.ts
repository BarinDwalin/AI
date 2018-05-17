import { ActionTypes } from '@shared/game/action-types';
import { ActionResult } from '@shared/game/action-result';

import { Dream } from './dream';
import { HeroStates } from './hero-states';
import { Item } from '../item/item';
import { ItemTypes } from '../item/item-types';
import { Memory } from './memory';
import { RenderSettings } from '../render-settings';


export class Hero extends Item {
  renderSettings: RenderSettings = {
    img: 'hero.svg',
    backgroundColor: 'white',
  };
  description: string;
  memory: Memory;
  /** дальность видимости на карте */
  visibilityDistance: number;

  private actions: ActionTypes[] = [];
  /** цель персонажа */
  dream: Dream;
  /** общий уровень удовлетворенности, от -1 до 1*/
  contentment: number;
  /** набор текущих состояний, положительно/отрицательно влияющих на персонажа, от -1 до 1 */
  states: { state: HeroStates, value: number }[];

  get currentContentment() { return this.contentment; }
  get currentStates() { return this.states; }
  get position(): { x: number, y: number } { return this.parent.position; }

  constructor(name: string, description: string, dream: Dream, settings?: RenderSettings) {
    super(name, ItemTypes.Hero);
    this.dream = dream;
    this.description = description;
    this.actions = [ActionTypes.Move, ActionTypes.PickFruits];
    this.visibilityDistance = 3;
    this.memory = new Memory();
    this.states = [{ state: HeroStates.Greed, value: 0 }];
    this.checkContentment();

    if (settings) {
      this.renderSettings.img = settings.img || this.renderSettings.img;
      this.renderSettings.backgroundColor = settings.backgroundColor || this.renderSettings.backgroundColor;
    }
  }

  refreshState(round: number) {
    this.checkStates();
    this.checkContentment();
    this.memory.rememberContentment(this.contentment, round, this.position);
    this.memory.rememberHeroState(this, round);
  }

  private checkContentment() {
    this.contentment = this.states.map((state) => state.value)
    .reduce((previous, current) => previous + current) / this.states.length;
  }
  private checkStates() {
    this.states.forEach((state) => {
      switch (state.state) {
        case HeroStates.Greed:
          const foodCount = this.inventory.filter((item) => item.type === ItemTypes.Food).length;
          state.value = foodCount >= this.dream.foodCount ? 1 : foodCount / this.dream.foodCount;
        break;
      }
    });
  }
}

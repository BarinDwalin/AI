import { ActionTypes } from '../game/action-types';
import { ActionResult } from '../game/action-result';

import { Item } from './item';
import { ItemTypes } from './item-types';
import { Memory } from './memory';
import { RenderSettings } from './render-settings';

export class Hero extends Item {
  static heroConter = 0;
  /** все герои на карте */
  static heroes: Hero[] = [];

  renderSettings: RenderSettings = {
    img: 'hero.svg',
    backgroundColor: 'white',
  };
  description: string;
  memory: Memory;
  /** дальность видимости на карте */
  visibilityDistance: number;

  private actions: ActionTypes[] = [];

  get position() { return this.parent.position; }

  constructor(name: string, description: string, settings?: RenderSettings) {
    super(name, ItemTypes.Hero);
    this.description = description;
    this.actions = [ActionTypes.Move, ActionTypes.PickFruits];
    this.visibilityDistance = 3;
    this.memory = new Memory();

    if (settings) {
      this.renderSettings.img = settings.img || this.renderSettings.img;
      this.renderSettings.backgroundColor = settings.backgroundColor || this.renderSettings.backgroundColor;
    }
  }

  static createHero(ii: ActionTypes): Hero {
    let type: string;
    let color: string;
    let description: string;
    switch (ii) {
      case ActionTypes.ThinkingRandom: type = 'random'; color = 'green';
        description = 'Случайно перемещается по соседним клеткам. Если находит дерево, берет 1 яблоко и перемещается.';
        break;
      case ActionTypes.ThinkingSearchPathWithFullMap: type = 'search'; color = 'red';
        description = 'Перемещается к ближайшему дереву с яблоками. Берет все что есть и ищет новое.';
        break;
      case ActionTypes.ThinkingSearchPathWithVisibility: type = 'searchRadius'; color = 'orange';
        description = `Перемещается к ближайшему дереву с яблоками (в радиусе видимости 3 клеток).
          Берет все что есть и ищет новое. Если не найдено, случайно перемещается по соседним клеткам.`;
        break;
    }
    const name = `${this.heroConter++} ${type}`;
    const renderSettings: RenderSettings = new RenderSettings();
    renderSettings.backgroundColor = color;
    const hero = new Hero(name, description, renderSettings);

    const firstAction = { action: ii, args: [hero] };
    hero.todoStack.push(firstAction);

    this.heroes.push(hero);
    return hero;
  }
}

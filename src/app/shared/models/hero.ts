import { ActionTypes } from '../game/action-types';
import { ActionResult } from '../game/action-result';

import { Item } from './item';
import { ItemTypes } from './item-types';
import { RenderSettings } from './render-settings';
import { StaticInjector } from '@angular/core/src/di/injector';

export class Hero extends Item {
  static heroConter = 0;
  /** все герои на карте */
  static heroes: Hero[] = [];

  renderSettings: RenderSettings = {
    img: 'hero.svg',
    backgroundColor: 'white',
  };

  private memorySize = 100;

  get position() { return this.parent.position; }

  memory: any[] = [];
  // todoStack: { action: ActionTypes, args?: any }[] = [];
  actions: ActionTypes[] = [];

  constructor(name: string, settings?: RenderSettings) {
    super(name, ItemTypes.Hero);
    this.actions = [ActionTypes.Move, ActionTypes.PickFruits];

    if (settings) {
      this.renderSettings.img = settings.img || this.renderSettings.img;
      this.renderSettings.backgroundColor = settings.backgroundColor || this.renderSettings.backgroundColor;
    }
  }

  static createHero(x: number, y: number, ii: ActionTypes): Hero {
    let type: string;
    let color: string;
    switch (ii) {
      case ActionTypes.ThinkingRandom: type = 'random'; color = 'green'; break;
      case ActionTypes.ThinkingSearchPathWithFullMap: type = 'search'; color = 'red'; break;
    }
    const name = `${this.heroConter++} ${type}`;
    const renderSettings: RenderSettings = new RenderSettings();
    renderSettings.backgroundColor = color;
    const hero = new Hero(name, renderSettings);

    const firstAction = { action: ii, args: [hero] };
    hero.todoStack.push(firstAction);

    this.heroes.push(hero);
    return hero;
  }

  remember(action: ActionTypes, args: any, result: void | ActionResult) {
    if (this.memory.length < this.memorySize) {
      this.memory.push({ action, args, result });
    }
  }
}

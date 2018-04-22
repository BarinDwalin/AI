import { Hero, RenderSettings } from '../models';
import { ActionTypes } from './action-types';

export class HeroFabric {
  static heroConter = 0;
  /** все герои на карте */
  static heroes: Hero[] = [];

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
    const dream = { foodCount: 20 };
    const renderSettings: RenderSettings = new RenderSettings();
    renderSettings.backgroundColor = color;
    const hero = new Hero(name, description, dream, renderSettings);

    const firstAction = { action: ii, args: [hero] };
    hero.todoStack.push(firstAction);

    this.heroes.push(hero);
    return hero;
  }

}

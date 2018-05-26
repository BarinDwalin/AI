import { ActionTypes } from '@shared/game/action-types';
import { Hero, RenderSettings } from '@shared/models';
import { ItemFabric } from './item-fabric';

export class HeroFabric {
  /** все герои на карте */
  static heroes: Hero[] = [];
  private static heroConter = 0;

  static createHero(ii: ActionTypes): Hero {
    let type: string;
    let color: string;
    let description: string;
    switch (ii) {
      case ActionTypes.ThinkingBestAction: type = 'best'; color = 'aquamarine';
        description = `Если помнит улучшающий свое состояние ход, идет на клетку где был и делает последние действия.
          Если не помнит или после повтора всех успешных ходов, делает случайное действие.
          Со временем совершает все больше случайных действий (для открытия возможностей).`;
        break;
      case ActionTypes.ThinkingRandom: type = 'random'; color = 'coral';
        description = 'Совершает случайные действия.';
        break;
      case ActionTypes.ThinkingPickAndRandomMove: type = 'rndMove'; color = 'green';
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
    ItemFabric.items.push(hero);
    return hero;
  }

}

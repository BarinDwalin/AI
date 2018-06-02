import * as math from '@shared/game/math';

import { Game } from '@shared/game/game';
import { ItemFabric } from '@shared/fabrics/item-fabric';
import { Hero, Item, ItemTypes } from '@shared/models';
import { Action } from '../action';
import { ActionTypes } from '../action-types';
import { ActionResult } from '../action-result';
import { Helper } from './helper';

export class ActionsAI {
  static actionList: Action[] = [
    // интеллектуальные команды
    new Action(ActionTypes.ThinkingBestAction, ActionsAI.thinkingBestAction, 0),
    new Action(ActionTypes.ThinkingRandom, ActionsAI.thinkingRandom, 0),
    new Action(ActionTypes.ThinkingPickAndRandomMove, ActionsAI.thinkingPickAndRandomMove, 0),
    new Action(ActionTypes.ThinkingSearchPathWithVisibility, ActionsAI.thinkingSearchPathWithVisibility, 0),
    new Action(ActionTypes.ThinkingSearchPathWithFullMap, ActionsAI.thinkingSearchPathWithFullMap, 0),
  ];

  //#region ИИ

  /** ИИ v0 */
  static thinkingPickAndRandomMove(hero: Hero) {
    // пропускаем 0..3 шага
    /*for (let i = 0; i < math.randomIntFromInterval(0, 3); i++) {
      hero.todoStack.push({ action: ActionTypes.Waiting });
    }*/
    const currentCell = Game.map.getCell(hero.position.x, hero.position.y);
    const indexTree = currentCell.items.findIndex((item) => item.type === ItemTypes.Tree);
    if (indexTree !== -1) {
      const tree = currentCell.items[indexTree];
      hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, tree] });
      hero.todoStack.push({ action: ActionTypes.MoveRandomDirection, args: [hero] });
      hero.todoStack.push({ action: ActionTypes.ThinkingPickAndRandomMove, args: [hero] });
    } else {
      hero.todoStack.push({ action: ActionTypes.MoveRandomDirection, args: [hero] });
      hero.todoStack.push({ action: ActionTypes.ThinkingPickAndRandomMove, args: [hero] });
    }
  }
  /** ИИ v1 */
  static thinkingSearchPathWithFullMap(hero: Hero) {
    const currentCell = Game.map.getCell(hero.position.x, hero.position.y);
    // сбор пока возможен
    const indexTree = currentCell.items.findIndex((item) => item.type === ItemTypes.Tree &&
      item.inventory.some((itemTree) => itemTree.type === ItemTypes.Food));
    if (indexTree !== -1) {
      const tree = currentCell.items[indexTree];
      hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, tree] });
      hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithFullMap, args: [hero] });
      return;
    }
    // поиск точки
    let nearestTree: Item;
    let pathLength: number;
    ItemFabric.items.forEach((item) => {
      if (item.type === ItemTypes.Tree && item.inventory.some((itemTree) => itemTree.type === ItemTypes.Food)) {
        const currentPathLength = Math.pow(hero.position.x - item.position.x, 2) +
          Math.pow(hero.position.y - item.position.y, 2);
        if (!nearestTree || currentPathLength < pathLength) {
          nearestTree = item;
          pathLength = currentPathLength;
        }
      }
    });
    if (!nearestTree) {
      hero.todoStack.push({ action: ActionTypes.Waiting });
      hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithFullMap, args: [hero] });
      return;
    }
    // прокладывание пути
    Helper.createPathToPoint(
      hero.position.x, hero.position.y, nearestTree.position.x, nearestTree.position.y
    ).forEach((step) => {
      hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: step.x, y: step.y }, hero] });
    });
    // сбор
    hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, nearestTree] });
    // повтор
    hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithFullMap, args: [hero] });
  }
  /** ИИ v2 */
  static thinkingSearchPathWithVisibility(hero: Hero) {
    const currentCell = Game.map.getCell(hero.position.x, hero.position.y);
    // сбор пока возможен
    const indexTree = currentCell.items.findIndex((item) => item.type === ItemTypes.Tree &&
      item.inventory.some((itemTree) => itemTree.type === ItemTypes.Food));
    if (indexTree !== -1) {
      const tree = currentCell.items[indexTree];
      hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, tree] });
      hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithVisibility, args: [hero] });
      return;
    }
    // проверяем область видимости
    const treeFilter = (item) => item.type === ItemTypes.Tree &&
      item.inventory.some((itemTree) => itemTree.type === ItemTypes.Food);
    const nearestTree = Helper.searchNearestObjectInArea(
      hero.position.x, hero.position.y, hero.visibilityDistance, treeFilter
    );
    if (nearestTree) {
      // идем на видимую цель
      Helper.createPathToPoint(
        hero.position.x, hero.position.y, nearestTree.position.x, nearestTree.position.y
      ).forEach((step) => {
        hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: step.x, y: step.y }, hero] });
      });
      // сбор
      hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, nearestTree] });
    } else {
      // идем рандомно несколько шагов
      for (let i = 0; i < math.randomIntFromInterval(1, 5); i++) {
        hero.todoStack.push({ action: ActionTypes.MoveRandomDirection, args: [hero] });
      }
    }
    // повтор
    hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithVisibility, args: [hero] });
  }
  /** ИИ v3 */
  static thinkingRandom(hero: Hero) {
    const availableRandomActions = [
      ActionTypes.MoveRandomDirection,
      ActionTypes.PickFruits,
      ActionTypes.Waiting,
    ];
    hero.todoStack.push(ActionsAI.getRandomAction(hero, availableRandomActions));
    hero.todoStack.push({ action: ActionTypes.ThinkingRandom, args: [hero] });
  }
  /** ИИ v4 */
  static thinkingBestAction(hero: Hero, info: {
    // прошлое улучшение состояния во время последнего прохода по памяти
    // является ограничением для постоянного прохода по всей памяти
    lastContentmentIndex: number,
    // сколько успешных проходов по памяти совершено
    countResearchAndRepeat: number,
    // сколько ходов еще ждать до нового прохода по памяти (сбрасывается на число успешных проходов).
    // используется для увеличения рандомизации с течением времени, иначе не выйдет из первого успешного состояния.
    waitingResearchTurnCount: number,
  } = {
    lastContentmentIndex: undefined,
    countResearchAndRepeat: 0,
    waitingResearchTurnCount: 0,
  }) {
    const availableRandomActions = [
      ActionTypes.MoveRandomDirection,
      ActionTypes.PickFruits,
      ActionTypes.Waiting,
    ];

    // ожидание нового прохода по памяти
    if (info && info.waitingResearchTurnCount > 0) {
      info.waitingResearchTurnCount--;
    } else {
      // поиск в памяти хода, улучшающего состояние
      const successTurn = ActionsAI.searchIncreaseContentmentTurn(hero, info.lastContentmentIndex);
      if (successTurn.success) {
        info.lastContentmentIndex = successTurn.lastContentmentIndex;
        // перемещение до нужной точки
        Helper.createPathToPoint(
          hero.position.x, hero.position.y, successTurn.position.x, successTurn.position.y
        ).forEach((step) => {
          hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: step.x, y: step.y }, hero] });
        });
        ActionsAI.repeatSuccessActions(hero, successTurn.lastSuccessActionIndex, true);
        hero.todoStack.push({ action: ActionTypes.ThinkingBestAction, args: [hero, info] });
        return;
      }
    }
    if (!!info.lastContentmentIndex) {
      info.countResearchAndRepeat += 1;
      info.waitingResearchTurnCount = info.countResearchAndRepeat;
    }
    // сбрасываем для нового прохода по памяти
    info.lastContentmentIndex = undefined;

    // подходящего хода нет, совершается случайное действие
    hero.todoStack.push(ActionsAI.getRandomAction(hero, availableRandomActions));
    hero.todoStack.push({ action: ActionTypes.ThinkingBestAction, args: [hero, info] });
  }

  //#endregion

  //#region вспомогательные функции

  static getRandomAction(hero: Hero, availableRandomActions: ActionTypes[]): { action: ActionTypes, args: any[]} {
    let random = math.randomIntFromInterval(0, availableRandomActions.length - 1);
    const randomAction = availableRandomActions[random];
    // все ближайшие объекты, включая себя
    const nearestItems: Item[] = [];
    Game.map.getCellsInArea(hero.position.x, hero.position.y, hero.visibilityDistance).forEach((cell) => {
      nearestItems.push(...cell.items);
    });
    random = math.randomIntFromInterval(0, nearestItems.length - 1);
    const randomItem = nearestItems[random];
    return { action: randomAction, args: [hero, randomItem] };
  }

  /** поиск последовательности действий до искомого состояния, остановившись на перемещении */
  static repeatSuccessActions(hero: Hero, lastSuccessActionIndex: number, excludeRepeat: boolean) {
    // TODO: попытка находить оптимальные последовательности
    const repetitiveActions: { action: ActionTypes, args?: any[] }[] = [];
    for (let index = lastSuccessActionIndex; index >= 0; index--) {
      const actionInfo = hero.memory.lastActions[index];
      if (actionInfo && !Helper.movingActionList.includes(actionInfo.action)
        && actionInfo.action !== ActionTypes.ThinkingBestAction
      ) {
        if (excludeRepeat && repetitiveActions.some((info) => info.action === actionInfo.action)) {
          // ! не учитываются аргументы действия
          break;
        }
        repetitiveActions.push({ action: actionInfo.action, args: actionInfo.args });
      }
    }
    hero.todoStack.push(...repetitiveActions);
  }

  /** поиск в памяти хода, улучшающего состояние */
  static searchIncreaseContentmentTurn(hero: Hero, lastHeroStateIndex: number): {
    success: boolean,
    lastContentmentIndex?: number,
    lastSuccessActionIndex?: number,
    position?: { x: number, y: number },
  } {
    for (let index = (lastHeroStateIndex || hero.memory.heroStates.length) - 1; index > 0; index--) {
      if (hero.memory.heroStates[index].value > hero.memory.heroStates[index - 1].value) {
        const round = hero.memory.heroStates[index].round - 1; // берем ход до обновления состояния
        for (let actionIndex = hero.memory.lastActions.length - 1; actionIndex >= 0; actionIndex--) {
          if (hero.memory.lastActions[actionIndex].round === round) {
            return {
              success: true,
              lastContentmentIndex: index,
              lastSuccessActionIndex: actionIndex,
              position: hero.memory.heroStates[index].value.position,
            };
          }
        }
      }
    }
    return { success: false };
  }
  //#endregion

}

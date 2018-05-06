import * as math from './math';

import { Hero, Item, ItemTypes } from '../models';
import { ItemFabric } from './item-fabric';
import { Action } from './action';
import { ActionTypes } from './action-types';
import { Game } from './game';
import { ActionResult } from './action-result';

export class Actions {
  static actionList: Action[] = [
    // интеллектуальные команды
    new Action(ActionTypes.ThinkingBestAction, Actions.thinkingBestAction, 0),
    new Action(ActionTypes.ThinkingRandom, Actions.thinkingRandom, 0),
    new Action(ActionTypes.ThinkingPickAndRandomMove, Actions.thinkingPickAndRandomMove, 0),
    new Action(ActionTypes.ThinkingSearchPathWithVisibility, Actions.thinkingSearchPathWithVisibility, 0),
    new Action(ActionTypes.ThinkingSearchPathWithFullMap, Actions.thinkingSearchPathWithFullMap, 0),

    // общие команды
    new Action(ActionTypes.Growing, Actions.growing),
    new Action(ActionTypes.GrowingApple, Actions.growingApple),
    new Action(ActionTypes.Move, Actions.move),
    new Action(ActionTypes.MoveRandomDirection, Actions.moveRandomDirection, 0),
    new Action(ActionTypes.PickFruits, Actions.pickFruits),
    new Action(ActionTypes.Waiting, Actions.waiting),
  ];
  // все действия связанные с перемещением
  static movingActionList = [
    ActionTypes.Move,
    ActionTypes.MoveRandomDirection,
  ];

  static get(type: ActionTypes) {
    return this.actionList.find((action) => action.type === type);
  }

  //#region общие команды
  static growing(tree: Item): ActionResult {
    // пропускаем 10..15 шагов
    for (let i = 0; i < math.randomIntFromInterval(10, 15); i++) {
      tree.todoStack.push({ action: ActionTypes.Waiting });
    }
    tree.todoStack.push({ action: ActionTypes.GrowingApple, args: [tree] });
    // бесконечное производство
    tree.todoStack.push({ action: ActionTypes.Growing, args: [tree] });
    return new ActionResult(true);
  }
  static growingApple(tree: Item): ActionResult {
    tree.putInInventory(ItemFabric.createApple());
    return new ActionResult(true);
  }

  static move(positions: {x: number, y: number}, hero: Hero) {
    if (hero instanceof Hero) {
      Game.map.moveHero(positions, hero, Game.round);
    } else {
      return new ActionResult(false);
    }
  }
  static moveRandomDirection(hero: Hero): ActionResult {
    const direction = math.randomIntFromInterval(0, 3);
    let x = hero.position.x;
    let y = hero.position.y;
    switch (direction) {
      case 0: if (x > 0) { x -= 1; }
      break;
      case 1: if (x + 1 < Game.map.width) { x += 1; }
      break;
      case 2: if (y > 0) { y -= 1; }
      break;
      case 3: if (y + 1 < Game.map.height) { y += 1; }
      break;
    }
    // защита от простоя
    if (x === hero.position.x && y === hero.position.y) {
      return Actions.moveRandomDirection(hero);
    }
    // защита от возврата
    let currentMove;
    let previousMove;
    for (let i = hero.memory.lastActions.length - 1; i >= 0; i--) {
      const element = hero.memory.lastActions[i];
      if (element.action === ActionTypes.Move) {
        if (!currentMove) {
          currentMove = element;
        } else if (!previousMove) {
          previousMove = element;
          break;
        }
      }
    }
    /*const currentMove1 = hero.memory.reverse().find((action) => action.action === ActionTypes.Move);
    const previousMove2 = hero.memory.reverse().find((action) => action.action === ActionTypes.Move && action !== currentMove);*/
    if (!!previousMove) {
      if (x === previousMove.args[0].x && y === previousMove.args[0].y) {
        return Actions.moveRandomDirection(hero);
      }
    }
    hero.todoStack.unshift({ action: ActionTypes.Move, args: [{ x, y }, hero] });
    return new ActionResult(true);
  }

  static pickFruits(hero: Hero, tree: Item): ActionResult {
    if (hero.type !== ItemTypes.Hero && tree.type !== ItemTypes.Tree) {
      return new ActionResult(false);
    }
    if (hero.position.x === tree.position.x && hero.position.y === tree.position.y && tree.inventory.length > 0) {
      const apple = tree.inventory.pop();
      hero.putInInventory(apple);
      return new ActionResult(true);
    } else {
      return new ActionResult(false);
    }
  }

  static waiting(): ActionResult { return new ActionResult(true); }
  //#endregion

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
    Item.items.forEach((item) => {
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
    Actions.createPathToPoint(
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
    const nearestTree = Actions.searchNearestObjectInArea(
      hero.position.x, hero.position.y, hero.visibilityDistance, treeFilter
    );
    if (nearestTree) {
      // идем на видимую цель
      Actions.createPathToPoint(
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
    hero.todoStack.push(Actions.getRandomAction(hero, availableRandomActions));
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
      const successTurn = Actions.searchIncreaseContentmentTurn(hero, info.lastContentmentIndex);
      if (successTurn.success) {
        info.lastContentmentIndex = successTurn.lastContentmentIndex;
        // перемещение до нужной точки
        Actions.createPathToPoint(
          hero.position.x, hero.position.y, successTurn.position.x, successTurn.position.y
        ).forEach((step) => {
          hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: step.x, y: step.y }, hero] });
        });
        Actions.repeatSuccessActions(hero, successTurn.lastSuccessActionIndex);
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
    hero.todoStack.push(Actions.getRandomAction(hero, availableRandomActions));
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
  static repeatSuccessActions(hero: Hero, lastSuccessActionIndex: number) {
    // TODO: остановиться при повторении действий или другая попытка сокращать длинные последовательности
    for (let index = lastSuccessActionIndex; index >= 0; index--) {
      const actionInfo = hero.memory.lastActions[index];
      if (actionInfo && !Actions.movingActionList.includes(actionInfo.action)
        && actionInfo.action !== ActionTypes.ThinkingBestAction
      ) {
        hero.todoStack.push({ action: actionInfo.action, args: actionInfo.args });
      }
    }
  }

  /** поиск в памяти хода, улучшающего состояние */
  static searchIncreaseContentmentTurn(hero: Hero, lastContentmentIndex: number): {
    success: boolean,
    lastContentmentIndex?: number,
    lastSuccessActionIndex?: number,
    position?: { x: number, y: number },
  } {
    for (let index = (lastContentmentIndex || hero.memory.contentment.length) - 1; index >= 0; index--) {
      if (hero.memory.contentment[index].isIncreased) {
        const round = hero.memory.contentment[index].round - 1; // берем ход до обновления состояния
        for (let actionIndex = hero.memory.lastActions.length - 1; actionIndex >= 0; actionIndex--) {
          if (hero.memory.lastActions[actionIndex].round === round) {
            return {
              success: true,
              lastContentmentIndex: index,
              lastSuccessActionIndex: actionIndex,
              position: hero.memory.contentment[index].position,
            };
          }
        }
      }
    }
    return { success: false };
  }

  /** поиск на карте ближайшего объекта в радиусе, по фильтру */
  static searchNearestObjectInArea(x: number, y: number, radius: number, filter: (item: Item) => boolean) {
    const items: Item[] = [];
    Game.map.getCellsInArea(x, y, radius).forEach((cell) => {
      items.push(...cell.items.filter(filter));
    });

    let nearestItem: Item;
    let pathLength: number;
    items.forEach((item) => {
      const currentPathLength = Math.pow(x - item.position.x, 2) + Math.pow(y - item.position.y, 2);
      if (!nearestItem || currentPathLength < pathLength) {
        nearestItem = item;
        pathLength = currentPathLength;
      }
    });
    return nearestItem;
  }

  static createPathToPoint(startX: number, startY: number, targetX: number, targetY: number) {
    const path: { x: number, y: number }[] = [];
    // прокладывание пути по x
    let xPath = startX;
    let yPath = startY;
    for (let i = Math.abs(startX - targetX); i > 0; i--) {
      xPath += (startX - targetX > 0 ? -1 : 1);
      path.push({ x: xPath, y: yPath });
    }
    // прокладывание пути по y
    for (let i = Math.abs(startY - targetY); i > 0; i--) {
      yPath += (startY - targetY > 0 ? -1 : 1);
      path.push({ x: xPath, y: yPath });
    }
    return path;
  }
  //#endregion
}

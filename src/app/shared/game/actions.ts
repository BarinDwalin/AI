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
    new Action(ActionTypes.ThinkingRandom, Actions.thinkingRandom, 0),
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

  static get(type: ActionTypes) {
    return this.actionList.find((action) => action.type === type);
  }

  //#region общие команды
  static growing(tree: Item) {
    // пропускаем 10..15 шагов
    for (let i = 0; i < math.randomIntFromInterval(10, 15); i++) {
      tree.todoStack.push({ action: ActionTypes.Waiting });
    }
    tree.todoStack.push({ action: ActionTypes.GrowingApple, args: [tree] });
    // бесконечное производство
    tree.todoStack.push({ action: ActionTypes.Growing, args: [tree] });
  }
  static growingApple(tree: Item) {
    tree.putInInventory(ItemFabric.createApple());
  }

  static move(positions: {x: number, y: number}, hero: Hero) {
    if (hero instanceof Hero) {
      Game.map.moveHero(positions, hero, Game.round);
    } else {
      return new ActionResult(false);
    }
  }
  static moveRandomDirection(hero: Hero) {
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
      Actions.moveRandomDirection(hero);
      return;
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
        Actions.moveRandomDirection(hero);
        return;
      }
    }
    hero.todoStack.unshift({ action: ActionTypes.Move, args: [{ x, y }, hero] });
  }

  static pickFruits(hero: Hero, tree: Item) {
    if (tree.inventory.length > 0) {
      const apple = tree.inventory.pop();
      hero.putInInventory(apple);
    }
  }

  static waiting() { }
  //#endregion

  //#region ИИ

  /** ИИ v0 */
  static thinkingRandom(hero: Hero) {
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
      hero.todoStack.push({ action: ActionTypes.ThinkingRandom, args: [hero] });
    } else {
      hero.todoStack.push({ action: ActionTypes.MoveRandomDirection, args: [hero] });
      hero.todoStack.push({ action: ActionTypes.ThinkingRandom, args: [hero] });
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

  //#endregion

  //#region вспомогательные функции

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

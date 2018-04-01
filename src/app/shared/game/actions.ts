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
    new Action(ActionTypes.ThinkingSearchPathWithFullMap, Actions.thinkingSearchPathWithFullMap),

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
      Game.map.moveHero(positions, hero);
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
    for (let i = hero.memory.length - 1; i >= 0; i--) {
      const element = hero.memory[i];
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
      hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithFullMap, args: [hero] });
      return;
    }
    // прокладывание пути по x
    let xPath = hero.position.x;
    let yPath = hero.position.y;
    for (let i = Math.abs(hero.position.x - nearestTree.position.x); i > 0; i--) {
      xPath += (hero.position.x - nearestTree.position.x > 0 ? -1 : 1);
      hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: xPath, y: yPath }, hero] });
    }
    // прокладывание пути по y
    for (let i = Math.abs(hero.position.y - nearestTree.position.y); i > 0; i--) {
      yPath += (hero.position.y - nearestTree.position.y > 0 ? -1 : 1);
      hero.todoStack.push({ action: ActionTypes.Move, args: [{ x: xPath, y: yPath }, hero] });
    }
    // сбор
    hero.todoStack.push({ action: ActionTypes.PickFruits, args: [hero, nearestTree] });
    // повтор
    hero.todoStack.push({ action: ActionTypes.ThinkingSearchPathWithFullMap, args: [hero] });
  }

  //#endregion
}

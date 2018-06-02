import * as math from './math';

import { ItemFabric } from '@shared/fabrics/item-fabric';
import { Hero, Item, ItemTypes } from '@shared/models';
import { Action } from './action';
import { ActionTypes } from './action-types';
import { Game } from './game';
import { ActionResult } from './action-result';
import { ActionsAI } from './actions/ai';

export class Actions {
  static actionList: Action[] = [
    // интеллектуальные команды
    ...ActionsAI.actionList,

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
  static growing(tree: Item): ActionResult {
    if (!(tree instanceof Item) || tree.type !== ItemTypes.Tree) {
      return new ActionResult(false);
    }
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
    if (!(tree instanceof Item) || tree.type !== ItemTypes.Tree) {
      return new ActionResult(false);
    }
    tree.putInInventory(ItemFabric.createApple());
    return new ActionResult(true);
  }

  static move(positions: {x: number, y: number}, hero: Hero) {
    if (!positions || !positions.x || !positions.y || !(hero instanceof Hero)) {
      return new ActionResult(false);
    } else {
      Game.map.moveHero(positions, hero, Game.round);
      return new ActionResult(true);
    }
  }
  static moveRandomDirection(hero: Hero): ActionResult {
    if (!(hero instanceof Hero)) {
      return new ActionResult(false);
    }
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
    if (!(hero instanceof Hero) || !(tree instanceof Item) || tree.type !== ItemTypes.Tree) {
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

}

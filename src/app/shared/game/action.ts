import { ActionTypes } from './action-types';
import { ActionResult } from './action-result';

export class Action {
  type: ActionTypes;
  cost: number;
  action: (...args) => ActionResult | void;

  constructor(type: ActionTypes, action: (...args) => ActionResult | void, cost: number = 1) {
    this.type = type;
    this.action = action;
    this.cost = cost;
  }
}

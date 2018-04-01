import { ActionTypes } from './action-types';

export class Action {
  type: ActionTypes;
  cost: number;
  action: (...args) => void;

  constructor(type: ActionTypes, action: (...args) => void, cost: number = 1) {
    this.type = type;
    this.action = action;
    this.cost = cost;
  }
}

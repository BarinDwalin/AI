import { ActionTypes } from './action-types';

export class Action {
  type: ActionTypes;
  action: (...args) => void;

  constructor(type: ActionTypes, action: (...args) => void) {
    this.type = type;
    this.action = action;
  }
}

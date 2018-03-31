import { Cell, Hero, ItemTypes } from '../models';
import { Actions } from './actions';
import { Map } from './map';

export class Game {
  static map: Map = new Map();

  private active = false;
  private events: Array<() => void> = [];
  private timeout = 100;

  constructor() {
    this.addEvent(() => {
      Game.map.cells.forEach((cell) => {
        cell.items.filter((item) => item.todoStack.length !== 0).forEach((item) => {
          // за 1 тик выполняем по 1 действию у каждого объекта
          const currentAction = item.todoStack.shift();
          const result = Actions.get(currentAction.action).action(...currentAction.args);
          if (item.type === ItemTypes.Hero) {
            (item as Hero).remember(currentAction.action, currentAction.args, result);
          }
        });
      });
    });

    this.loop();
  }

  run() {
    this.active = true;
  }
  stop() {
    this.active = false;
  }
  addEvent(fn: () => void) {
    this.events.push(fn);
  }

  loop() {
    let i = 0;
    setInterval(() => {
      if (this.active) {
        console.log('loop', i++);
        this.events.forEach((event) => event());
      }
    }, this.timeout);
  }

}

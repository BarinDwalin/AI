import { Cell, Hero, ItemTypes, Item } from '../models';
import { Actions } from './actions';
import { Map } from './map';
import { MapSettings } from './map-settings';

export class Game {
  static map: Map;
  static round = 0;

  active = false;
  timeout = 100;

  private events: Array<(round: number) => void> = [];
  private actionPoint = 1;

  constructor() {
    this.addEvent((round) => {
      Game.map.cells.forEach((cell) => {
        cell.items.filter((item) => !item.activated && item.todoStack.length !== 0).forEach((item) => {
          if (item.type === ItemTypes.Hero) {
            (item as Hero).refreshState(round);
            if ((item as Hero).currentContentment === 1) {
              // бездействие при достижении цели
              return;
            }
          }
          // за 1 ход выполняем у каждого объекта действия на определенную стоимость
          let currentCost = 0;
          while (currentCost < this.actionPoint) {
            const todo = item.todoStack.shift();
            const action = Actions.get(todo.action);
            currentCost += action.cost;
            const result = action.action(...todo.args);

            if (item.type === ItemTypes.Hero) {
              (item as Hero).memory.rememberLastAction(todo.action, todo.args, result, Game.round);
            }
          }
          // защита от повторного действия при перемещении по ячейкам
          item.activated = true;
        });
      });
      Item.items.forEach((item) => { item.activated = false; });
    });
  }

  createMap(settings: MapSettings) {
    Game.map = new Map(settings);
  }

  run() {
    this.active = true;
    this.loop();
  }
  stop() {
    this.active = false;
  }
  addEvent(fn: (round: number) => void) {
    this.events.push(fn);
  }

  loop() {
    const interval = setInterval(() => {
      if (this.active) {
        Game.round++;
        console.log('loop', Game.round);
        this.events.forEach((event) => event(Game.round));
      } else {
        clearInterval(interval);
      }
    }, this.timeout);
  }

}

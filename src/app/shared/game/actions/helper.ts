import { Game } from '@shared/game/game';
import { ActionTypes } from '@shared/game/action-types';
import { Item } from '@shared/models';

/** TODO: разобрать по классам */
export class Helper {

  // все действия связанные с перемещением
  static movingActionList = [
    ActionTypes.Move,
    ActionTypes.MoveRandomDirection,
  ];

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
}

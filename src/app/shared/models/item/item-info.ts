import { ItemTypes } from './item-types';
import { ActionTypes } from '../../game/action-types';

/** срез общей информации по объекту (для сохранения состояния) */
export class ItemInfo {
  name: string;
  type: ItemTypes;
  inventory: ItemInfo[] = [];
  position: { x: number, y: number };
}

import { Cell } from './cell';
import { ItemInfo, ItemTypes } from './item';
import { RenderSettings } from './render-settings';

export class CellInfo extends ItemInfo {
  renderSettings: RenderSettings = {
    img: 'grass.svg',
    backgroundColor: '',
  };

  get items() { return this.inventory; }

  constructor(cell: Cell) {
    super(cell);

    this.renderSettings = Object.assign({}, cell.renderSettings);
  }

}

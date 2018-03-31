import { Item } from './item';
import { ItemTypes } from './item-types';
import { RenderSettings } from './render-settings';

export class Cell extends Item {
  renderSettings: RenderSettings = {
    img: 'grass.svg',
    backgroundColor: '',
  };

  private _position: { readonly x: number, readonly y: number } = { x: 0, y: 0 };
  get position() { return this._position; }
  set position(value) { this._position = value; }

  get items() { return this.inventory; }

  constructor(position: { x: number, y: number }, settings?: RenderSettings) {
    super(null, ItemTypes.Cell);

    this.position = position;

    if (settings) {
      this.renderSettings.img = settings.img || this.renderSettings.img;
      this.renderSettings.backgroundColor = settings.backgroundColor || this.renderSettings.backgroundColor;
    }
  }

  addObject(item: Item) {
    this.putInInventory(item);
  }
}

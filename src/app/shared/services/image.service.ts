import { Injectable } from '@angular/core';

import { ItemTypes } from '../models';

@Injectable()
export class ImageService {
  private defaultImage = 'item-default.svg';
  private images: string[] = [];

  constructor() {
    this.images[ItemTypes.Food] = 'apple';
    this.images[ItemTypes.Tree] = 'tree';

    this.images.forEach((path) => path += '.svg');
  }

  getItemImage(type: ItemTypes): string {
    const img = this.images[type];

    if (img) {
      return img;
    } else {
      return this.defaultImage;
    }
  }
}

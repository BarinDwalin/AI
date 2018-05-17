import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Item } from '@shared/models';
import { ImageService } from '@shared/services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnChanges {
  @Input() item: Item;

  img: string;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.item) {
      this.img = this.imageService.getItemImage(this.item.type);
    }
  }

}

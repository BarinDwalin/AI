import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Item } from '../../shared/models';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnChanges {
  @Input() item: Item;

  img = 'item-default.svg';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.item) {
      // TODO: получение изображения по типу объекта
      this.img = 'item-default.svg';
    }
  }

}

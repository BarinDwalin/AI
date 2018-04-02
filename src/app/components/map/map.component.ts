import { Component, Input, OnInit } from '@angular/core';

import { Game, Actions } from '../../shared/game';
import { Cell, Item, ItemTypes, Hero } from '../../shared/models';
import { ActionTypes } from '../../shared/game/action-types';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() game: Game;

  itemTypesEnum = ItemTypes;  // т.к. enum не поддерживается в шаблонах

  get map() { return Game.map; }

  constructor() {
  }

  ngOnInit() {
  }

  getUpItem(cell: Cell) {
    return cell.items[cell.items.length - 1];
  }

  getUpItemType(cell: Cell) {
    if (cell.items.length === 0) {
      return undefined;
    } else {
      return this.getUpItem(cell).type;
    }
  }
}

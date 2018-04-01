import { Component, OnInit } from '@angular/core';

import { Game, Actions } from '../../shared/game';
import { Cell, Item, ItemTypes, Hero } from '../../shared/models';
import { ActionTypes } from '../../shared/game/action-types';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  itemTypesEnum = ItemTypes;  // т.к. enum не поддерживается в шаблонах

  private game: Game;

  get map() { return Game.map; }

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
    this.game.run();
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

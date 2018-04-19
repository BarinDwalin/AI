import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Game, Map } from '../../shared/game';
import { Cell, Item, ItemTypes, Hero } from '../../shared/models';
import { MapService } from '../../shared/services';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() game: Game;
  @Input() memoryType: 'shortTerm' | 'longTerm';

  itemTypesEnum = ItemTypes; // т.к. enum не поддерживается в шаблонах
  selectedHero: Hero;

  private subscriptions: Subscription[] = [];

  get map() { return Game.map; }

  get shortTermMemoryMap() {
    // подготовка карты
    const cells: Cell[] = Map.createEmptyMap(this.map.size, this.map.width);
    this.selectedHero.memory.shortTerm.forEach((info) => {
      cells[info.cell].items.push(info.item);
    });
    return cells;
  }
  get longTermMemoryMap() {
    // подготовка карты
    const cells: string[] = [];
    cells.length = this.map.size;
    cells.fill('grass.svg');
    this.selectedHero.memory.longTerm.forEach((info) => {
      let img: string;
      switch (info.item) {
        case ItemTypes.Hero: img = 'hero.svg'; break;
        case ItemTypes.Tree: img = 'tree.svg'; break;
      }
      cells[info.cell] = img;
    });
    return cells;
  }

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.mapService.selectedHero$.subscribe((hero) => {
      this.selectedHero = hero;
    }));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

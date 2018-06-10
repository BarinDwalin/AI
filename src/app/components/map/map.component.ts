import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Game, Map } from '@shared/game';
import { Cell, CellInfo, Item, ItemTypes, Hero, HeroInfo } from '@shared/models';
import { MapService } from '@shared/services';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() game: Game;

  itemTypesEnum = ItemTypes; // т.к. enum не поддерживается в шаблонах
  memoryType: 'shortTerm' | 'longTerm';
  selectedHero: Hero;

  private subscriptions: Subscription[] = [];

  get map() { return Game.map; }

  get shortTermMemoryMap() {
    // подготовка карты
    const cells: CellInfo[] = Map.createEmptyMap(this.map.size, this.map.width)
      .map((cell) => new CellInfo(cell));
    this.selectedHero.memory.shortTerm.forEach((info) => {
      cells[info.cell].items.push(info.item);
    });
    // текущее положение
    const cellIndex = this.map.getCellIndex(this.selectedHero.position.x, this.selectedHero.position.y);
    cells[cellIndex].items.push(new HeroInfo(this.selectedHero));
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
    this.subscriptions.push(this.mapService.memoryType$.subscribe((memoryType) => {
      this.memoryType = memoryType;
    }));
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

  select(hero: Hero) {
    this.mapService.setSelectedHero(hero);
  }
  cancelSelected(heroName: string) {
    if (heroName === this.selectedHero.name) {
      this.mapService.setSelectedHero(null);
    }
  }
}

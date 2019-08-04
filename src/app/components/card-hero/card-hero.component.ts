import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { roughSizeOfObject } from '@shared/game';
import { Hero, getHeroStateName } from '@shared/models';

@Component({
  selector: 'app-card-hero',
  templateUrl: './card-hero.component.html',
  styleUrls: ['./card-hero.component.css']
})
export class CardHeroComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hero: Hero;

  memory: string;
  stateName = getHeroStateName;

  private timer;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.memory = null;
  }

  calcMemory() {
    this.memory = this.checkMemory(this.hero);
  }

  private checkMemory(hero: Hero) {
    const memorySize = roughSizeOfObject(this.hero);
      if (memorySize < 1024) {
        return memorySize + ' кб';
      } else {
        return (memorySize / 1024).toFixed(1) + ' мб';
      }
  }
}

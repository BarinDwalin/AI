import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { roughSizeOfObject } from '../../shared/game';
import { Hero, getHeroStateName } from '../../shared/models';

@Component({
  selector: 'app-card-hero',
  templateUrl: './card-hero.component.html',
  styleUrls: ['./card-hero.component.css']
})
export class CardHeroComponent implements OnInit, OnDestroy {
  @Input() hero: Hero;

  memory: string;
  stateName = getHeroStateName;

  private timer;

  constructor() { }

  ngOnInit() {
    // пересчитываем реже, для снижения нагрузки
    this.timer = setInterval(() => {
      this.memory = this.checkMemory(this.hero);
    }, 5000);
  }
  ngOnDestroy() {
    clearInterval(this.timer);
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

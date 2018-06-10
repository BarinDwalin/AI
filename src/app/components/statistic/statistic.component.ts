import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { HeroFabric } from '@shared/fabrics/hero-fabric';
import { Hero } from '@shared/models';
import { MapService } from '@shared/services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit, OnDestroy {
  heroes: Hero[];
  selectedHero: Hero;

  private subscriptions: Subscription[] = [];

  constructor(
    private mapService: MapService,
  ) {
    this.heroes = HeroFabric.heroes;
  }

  ngOnInit() {
    this.subscriptions.push(this.mapService.selectedHero$.subscribe((hero) => {
      this.selectedHero = hero;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  select(hero: Hero) {
    if (this.selectedHero === hero) {
      this.selectedHero = null;
    } else {
      this.selectedHero = hero;
    }
    this.mapService.setSelectedHero(this.selectedHero);
  }
}

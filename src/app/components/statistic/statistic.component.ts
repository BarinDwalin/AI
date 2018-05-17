import { Component, OnInit } from '@angular/core';

import { HeroFabric } from '@shared/game/hero-fabric';
import { Hero } from '@shared/models';
import { MapService } from '@shared/services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(
    private mapService: MapService,
  ) {
    this.heroes = HeroFabric.heroes;
  }

  ngOnInit() {
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

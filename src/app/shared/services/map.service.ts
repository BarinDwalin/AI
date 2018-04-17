import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Hero } from '../models';

@Injectable()
export class MapService {
  selectedHero$: Observable<Hero>;
  private selectedHeroSource: Subject<Hero> = new Subject();

  constructor() {
    this.selectedHero$ = this.selectedHeroSource.asObservable();
   }

  public setSelectedHero(hero: Hero) {
    this.selectedHeroSource.next(hero);
  }
}

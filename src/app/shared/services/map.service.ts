import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

import { Hero } from '../models';

@Injectable()
export class MapService {
  memoryType$: Observable<'shortTerm' | 'longTerm'>;
  selectedHero$: Observable<Hero>;
  private memoryTypeSource: ReplaySubject<'shortTerm' | 'longTerm'> = new ReplaySubject(1);
  private selectedHeroSource: Subject<Hero> = new Subject();

  constructor() {
    this.memoryType$ = this.memoryTypeSource.asObservable();
    this.selectedHero$ = this.selectedHeroSource.asObservable();
   }
  public setMemoryType(memoryType) {
    this.memoryTypeSource.next(memoryType);
  }
  public setSelectedHero(hero: Hero) {
    this.selectedHeroSource.next(hero);
  }
}

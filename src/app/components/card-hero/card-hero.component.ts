import { Component, Input, OnInit } from '@angular/core';

import { Hero, getHeroStateName } from '../../shared/models';

@Component({
  selector: 'app-card-hero',
  templateUrl: './card-hero.component.html',
  styleUrls: ['./card-hero.component.css']
})
export class CardHeroComponent implements OnInit {
  @Input() hero: Hero;

  stateName = getHeroStateName;

  constructor() { }

  ngOnInit() {
  }

}

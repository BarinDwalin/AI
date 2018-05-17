import { Component, Input, OnInit } from '@angular/core';

import { Hero } from '@shared/models';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  @Input() hero: Hero;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit() {
  }

}

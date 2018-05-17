import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Item } from '@shared/models';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges {
  @Input() tree: Item;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }
}

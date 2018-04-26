import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  @Input() game;
  memoryType: 'shortTerm' | 'longTerm' = 'shortTerm';

  constructor() { }

  ngOnInit() {
  }

  changeMemoryType(memoryType) {
    if (this.memoryType !== memoryType) {
      this.memoryType = memoryType;
    }
  }

  changeTimeout(timeout) {
    this.game.timeout = timeout;
  }

  run() {
    this.game.run();
  }

  stop() {
    this.game.stop();
  }
}

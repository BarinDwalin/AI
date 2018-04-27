import { Component, Input, OnInit } from '@angular/core';

import { MapService } from '../../shared/services';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  @Input() game;
  memoryType: 'shortTerm' | 'longTerm' = 'shortTerm';

  constructor(
    private mapService: MapService,
  ) {
    this.mapService.setMemoryType(this.memoryType);
  }

  ngOnInit() {
  }

  changeMemoryType(memoryType) {
    if (this.memoryType !== memoryType) {
      this.memoryType = memoryType;
      this.mapService.setMemoryType(memoryType);
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

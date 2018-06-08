import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent implements OnInit {
  @ViewChild(NgModel) model: NgModel;

  value: number;

  constructor() { }

  ngOnInit() {
  }

  increase() {

  }

  decrease() {

  }

}

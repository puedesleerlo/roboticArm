import { Component, OnInit, Input, OnChanges, SimpleChange  } from '@angular/core';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  @Input() efectorX: number;
  @Input() efectorY: number;
  @Input() poleX: number;
  @Input() poleY: number;
  @Input() centro: number;
  constructor() { }

  ngOnInit() {
  }
  // ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  //   this.efectorx = this.a1*Math.cos(this.theta1) + this.a2*Math.cos(this.theta1 + this.theta2)
  //   this.efectory = this.a1*Math.sin(this.theta1) + this.a2*Math.sin(this.theta1 + this.theta2)
  //   this.joint2x = this.a1*Math.cos(this.theta1)
  //   this.joint2y = this.a1*Math.sin(this.theta1)
  // }


}

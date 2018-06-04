import { Component, OnInit, SimpleChange, Input } from '@angular/core';
declare interface LinkPosition {
  [index: number]: { x: number; y: number;};
}

@Component({
  selector: '[app-traditional]',
  templateUrl: './traditional.component.html',
  styleUrls: ['./traditional.component.css']
})

export class TraditionalComponent implements OnInit {
  @Input() a1: number;
  @Input() a2: number;
  @Input() a3: number;
  r1 = 40;
  linkposition: LinkPosition = []; 
  constructor() {
   }

  ngOnInit() {
      

  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.linkposition[0] = {
      x: 0, 
      y: 0
    }
    this.linkposition[1] = {
      x: this.r1*Math.cos(this.a1), 
      y:  this.r1*Math.sin(this.a1)
    }
    this.linkposition[2] = {
      x: this.linkposition[1].x + this.r1*Math.cos(this.a1+ this.a2), 
      y: this.linkposition[1].y + this.r1*Math.sin(this.a1 + this.a2)
    }
    this.linkposition[3] = {
      x: this.linkposition[2].x + this.r1*Math.cos(this.a1+ this.a2 + this.a3), 
      y:  this.linkposition[2].y + this.r1*Math.sin(this.a1+ this.a2 + this.a3)
    }
    console.log(this.linkposition[3])
  }

}

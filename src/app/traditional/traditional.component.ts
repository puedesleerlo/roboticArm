import { Component, OnInit, SimpleChange, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
declare interface LinkPosition {
  [index: number]: { r: number;  z: number;};
}
declare interface AnglePosition {
  [index: number]: { x: number; y:number; };
}

@Component({
  selector: '[app-traditional]',
  templateUrl: './traditional.component.html',
  styleUrls: ['./traditional.component.css']
})

export class TraditionalComponent implements OnInit {
  @Input() a1: number;
  @Input() a2: number;
  @Input() gyro: number;
  @Input() r2: number;
  @Input() r1: number;
  @Input() positions: Observable<any>;
  linkposition: LinkPosition = []; 
  anglePosition: AnglePosition = [];
  points: any[];
  constructor() {
   }

  ngOnInit() {
      this.positions.subscribe(data => {
        
        this.points = data.map(d => {
          d.r = Math.sqrt(d.xPoint.q*d.xPoint.q + d.yPoint.q^2*d.xPoint.q)
          d.x = d.xPoint.q
          d.y = d.yPoint.q
          d.z = d.zPoint.q
          delete d.xPoint, d.yPoint, d.zPoint
          return d
        })
      })

  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.linkposition[0] = {
      r: 0, 
      z: 0,
    }
    this.linkposition[1] = {
      r: this.r1*Math.cos(this.a1),
      z:  this.r1*Math.sin(this.a1)
    }
    this.linkposition[2] = {
      r: this.linkposition[1].r + this.r1*Math.cos(this.a1+ this.a2), 
      z: this.linkposition[1].z + this.r1*Math.sin(this.a1 + this.a2)
    }
    this.anglePosition[0] = {
      x: 0,
      y: 0
    }
    this.anglePosition[1] = {
      x: this.linkposition[2].r*Math.cos(this.gyro),
      y: this.linkposition[2].r*Math.sin(this.gyro)
    }
    console.log(this.linkposition[2])
  }

  updateAngles(a1, a2, gyro) {
    
  }

}

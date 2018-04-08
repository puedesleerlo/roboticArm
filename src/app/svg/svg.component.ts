import { Component, OnInit, Input, OnChanges, SimpleChange  } from '@angular/core';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  @Input() efectorX: number;
  @Input() efectorY: number;
  // @Input() poleX: number;
  // @Input() poleY: number;
  @Input() centro: number;
  poleX:number;
  poleY:number;
  segmentlength= 83;
  constructor() { }

  ngOnInit() {
    this.drawArm(160, 160, -1)
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.drawArm(this.efectorX, this.efectorY, -1)
  }

  drawArm(endEffectorX, endEffectorY, preferredRotation){
    var dirx = endEffectorX - this.centro;
    var diry = endEffectorY - this.centro;
    var len = Math.sqrt(dirx * dirx + diry * diry);
    dirx = dirx / len;
    diry = diry / len;
    
    var poleX, poleY;
    var disc = this.segmentlength * this.segmentlength - len * len / 4;
    if(disc < 0){
        poleX = this.centro + dirx * this.segmentlength;
        poleY = this.centro + diry * this.segmentlength;
        endEffectorX = this.centro + dirx * this.segmentlength * 2;
        endEffectorY = this.centro + diry * this.segmentlength * 2;
    } else {
        poleX = this.centro + dirx * len / 2;
        poleY = this.centro + diry * len / 2;
        disc = Math.sqrt(disc);
        if(preferredRotation < 0){
            disc =- disc; // Make it a negative number
        }
        poleX -= diry * disc;
        poleY += dirx * disc;
    }
    this.poleX = poleX;
    this.poleY = poleY;

  };
}

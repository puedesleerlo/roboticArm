import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  poleVectorX: any;
  poleVectorY:any;
  theta1:number;
  theta2:number;
  positionX:number = 160;
  positionY:number = 160;
  a1 = 8;
  a2 = 9;
  centro = 250;
  segmentlength = 83;
  ngOnInit() {
    this.drawArm(this.positionX, this.positionY, -1);
  }
  thetaChange() {
    this.positionX = this.a1*Math.cos(this.theta1) + this.a2*Math.cos(this.theta1 + this.theta2);
    this.positionY = this.a1*Math.sin(this.theta1) + this.a2*Math.sin(this.theta1 + this.theta2);
    this.drawArm(this.positionX, this.positionY, -1);
  }
  positionChange() {
    this.theta2 = Math.pow(this.positionX,2) + Math.pow(this.positionY,2) - Math.pow(this.a1,2) - Math.pow(this.a2,2)
    this.theta2 = this.theta2/(2*this.a1*this.a2)
    this.theta2 = Math.acos(this.theta2)
    this.theta1 = Math.atan(this.positionY/this.positionX) - Math.atan((this.a2*Math.sin(this.theta2))/(this.a1 + this.a2*Math.cos(this.theta2)))
    this.drawArm(this.positionX, this.positionY, -1);
  }
  drawArm(endEffectorX, endEffectorY, preferredRotation){
    var dirx = endEffectorX - this.centro;
    var diry = endEffectorY - this.centro;
    var len = Math.sqrt(dirx * dirx + diry * diry);
    dirx = dirx / len;
    diry = diry / len;
    
    var poleVectorX, poleVectorY;
    var disc = this.segmentlength * this.segmentlength - len * len / 4;
    if(disc < 0){
        poleVectorX = this.centro + dirx * this.segmentlength;
        poleVectorY = this.centro + diry * this.segmentlength;
        endEffectorX = this.centro + dirx * this.segmentlength * 2;
        endEffectorY = this.centro + diry * this.segmentlength * 2;
    } else {
        poleVectorX = this.centro + dirx * len / 2;
        poleVectorY = this.centro + diry * len / 2;
        disc = Math.sqrt(disc);
        if(preferredRotation < 0){
            disc =- disc; // Make it a negative number
        }
        poleVectorX -= diry * disc;
        poleVectorY += dirx * disc;
    }
    this.poleVectorX = poleVectorX;
    this.poleVectorY = poleVectorY;

};
}

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
  theta1:number = 0;
  theta2:number = 0;
  positionX:number = 160;
  positionY:number = 160;
  a1 = 8;
  a2 = 9;
  centro = 100;
  segmentlength = 45;
  ws:WebSocket
  ngOnInit() {
    this.drawArm(this.positionX, this.positionY, -1);
    this.ws = new WebSocket("ws://localhost:8765/");
    this.webSocket(this.ws)
  }
  webSocket(ws) {
    // Set event handlers.
    ws.onopen = function() {
      console.log("onopen");
    };
    
    ws.onmessage = function(e) {
      // e.data contains received string.
      console.log("onmessage: " + e.data);
    };
    
    ws.onclose = function() {
      console.log("onclose");
    };

    ws.onerror = function(e) {
      console.log("onerror");
      console.log(e)
    };
  }
  thetaChange() {
    
    this.positionX = this.segmentlength*Math.cos(this.toRadians(this.theta1)) + this.segmentlength*Math.cos(this.toRadians(this.theta1 + this.theta2)) + this.centro;
    this.positionY = this.segmentlength*Math.sin(this.toRadians(this.theta1)) + this.segmentlength*Math.sin(this.toRadians(this.theta1 + this.theta2)) + this.centro;
    console.log(this.positionX)

    this.drawArm(this.positionX, this.positionY, -1);
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }
  onSubmit() {
    let send = '{"theta1": "' + this.theta1  + '", "theta2" : "' + this.theta2 + '"}'
    this.ws.send(send);
    console.log(send)
  }
  positionChange() {
    let positionX = this.positionX- this.centro;
    let positionY = this.positionY- this.centro;
    let theta2 = Math.pow(positionX,2) + Math.pow(positionY,2) - Math.pow(this.segmentlength,2) - Math.pow(this.a2,2)
    theta2 = theta2/(2*this.segmentlength*this.segmentlength)
    theta2 = Math.acos(theta2)
    let theta1 = Math.atan(positionY/positionX) - Math.atan((this.segmentlength*Math.sin(theta2))/(this.segmentlength + this.segmentlength*Math.cos(theta2)))
    this.theta1 = this.toDegrees(theta1)
    this.theta2 = this.toDegrees(theta2)
    this.drawArm(positionX, positionY, -1);
  }
  max() {
    return Math.sqrt(83^2 - this.positionX*this.positionX)
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

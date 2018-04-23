import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  baseAngle:number = 0;
  efectorAngle:number = 0;
  a1 = 8;
  a2 = 9;
  centroX = 20;
  centroY = 5;
  client: WebSocket
  messages: string[] = []
  ngOnInit() {
    this.client  = new WebSocket('wss://legoev3.mybluemix.net/ws/robot')
    this.ws(this.client);

  }
  ws(client) {
    // Set event handlers.
          // Set event handlers.
          client.onopen = function() {
            console.log("Se abrió la conexión")
          };
          
          client.onmessage = function(e) {
            // e.data contains received string.
            console.log("Vino un mensaje")
            console.log(e)
          };
          
          client.onclose = function() {
            console.log("Se cerró la conexión")
          };
    
          client.onerror = function(e) {
            
            console.log(e)
          };
  }
  directKinematics() {

    
    // var message = "{baseAngle: " + this.baseAngle + ", efectorAngle:" + this.efectorAngle + " }"
    // this.client.send(message)
    // this.messages.push(message)
  }
  get x() {
    return this.a1*Math.cos(this.toRadians(this.baseAngle)) 
    + this.a2*Math.cos(this.toRadians(this.baseAngle + this.efectorAngle)) + this.centroX;
  }
  get poleX() {
    var angle = this.toRadians(this.baseAngle)
    return this.a1*Math.cos(angle) + this.centroX
  }
  get poleY() {
    var angle = this.toRadians(this.baseAngle)
    return this.a1*Math.sin(angle) + this.centroY
  }
  get y() {
   return this.a1*Math.sin(this.toRadians(this.baseAngle)) 
   + this.a2*Math.sin(this.toRadians(this.baseAngle + this.efectorAngle)) + this.centroY;
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }
  // inverseKinematics() {
  //   let positionX = this.positionX- this.centro;
  //   let positionY = this.positionY- this.centro;
  //   let theta2 = Math.pow(positionX,2) + Math.pow(positionY,2) - Math.pow(this.segmentlength,2) - Math.pow(this.a2,2)
  //   theta2 = theta2/(2*this.segmentlength*this.segmentlength)
  //   theta2 = Math.acos(theta2)
  //   let theta1 = Math.atan(positionY/positionX) - Math.atan((this.segmentlength*Math.sin(theta2))/(this.segmentlength + this.segmentlength*Math.cos(theta2)))
  //   this.baseAngle = this.toDegrees(theta1)
  //   this.efectorAngle = this.toDegrees(theta2)
  // }
}

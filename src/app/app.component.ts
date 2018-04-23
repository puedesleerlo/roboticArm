import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  a1 = 8;
  a2 = 9;
  centroX = 0;
  centroY = 0;
  client: WebSocket
  messages: string[] = []
  _baseAngle = 0
  _efectorAngle = 0
  _x: number = 17
  _y: number = 0
  efeX: number
  efeY: number
  togle = true
  ngOnInit() {
    this.client  = new WebSocket('wss://legoev3.mybluemix.net/ws/robot')
    this.ws(this.client);
    this._baseAngle = 0
    this._efectorAngle = 0
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
  get status() {
    return this.togle ? "Codo arriba" : "Codo abajo"
  }
  get togleNumber() {
    let n = this.togle ? 1 : -1
    // this._baseAngle = n*this._baseAngle
    // this._efectorAngle = n*this._efectorAngle
    return n
  }
  get x() {
    let x = this.a1*Math.cos(this.toRadians(this._baseAngle)) 
    + this.a2*Math.cos(this.toRadians(this._baseAngle + this._efectorAngle)) + this.centroX;
    
    return x
  }
  get y() {
    let y = this.a1*Math.sin(this.toRadians(this._baseAngle)) 
    + this.a2*Math.sin(this.toRadians(this._baseAngle + this._efectorAngle)) + this.centroY;
    return y
   }
  get poleX() {
    var angle = this.toRadians(this._baseAngle)
    return this.a1*Math.cos(angle) + this.centroX
  }
  get poleY() {
    var angle = this.toRadians(this._baseAngle)
    
    return this.a1*Math.sin(angle) + this.centroY
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  set x(val) {
    this._x = val
    this._baseAngle = this.baseAngle
    this._efectorAngle = this.efectorAngle
  }
  set y(val) {
    this._y = val
    this._baseAngle = this.baseAngle
    this._efectorAngle = this.efectorAngle

  }
  get efectorAngle() {
    let theta2 = Math.pow(this._x,2) + Math.pow(this._y,2) - Math.pow(this.a1,2) - Math.pow(this.a2,2)
    theta2 = theta2/(2*this.a1*this.a2)
    theta2 =  Math.acos(theta2)
    if(!theta2) theta2 = 0
    let angle = this.toDegrees(this.togleNumber*theta2)

    return angle
  }
  get baseAngle() {
    let distance = Math.pow(this._x,2) + Math.pow(this._y,2)
    let alpha = distance + Math.pow(this.a1,2) - Math.pow(this.a2,2)
    let atan = Math.atan(this._y/this._x)
    let acos = Math.acos(alpha/(2*this.a1*Math.sqrt(distance)))
    if(!acos) acos = 0
    let theta1 = atan - this.togleNumber*acos
    let angle = this.toDegrees(theta1)
    return angle
  }
  set efectorAngle(val) {
    this._efectorAngle = val
    // this._x = this.x
    // this._y = this.y
  }
  set baseAngle(val) {
    this._baseAngle = val
    // this._x = this.x
    // this._y = this.y
  }
  xRect(time) {
    var xrec = setInterval(() => {

      this.x = this.x - 1
      var message = this.returnMessage()
      this.client.send(message)
      if(this.x < 4) clearInterval(xrec)   
    }, time)
  }
  yRect(time) {
    var yrec = setInterval(() => {
 
      this.y = this.y - 1
      var message = this.returnMessage()
      this.client.send(message)
      if(this.y < -10) clearInterval(yrec)   
    }, time)
  }
  yequalx(time) {
    var yx = setInterval(() => {

      this.x = this.x - 1
      this.y = this.x
      var message = this.returnMessage()
      this.client.send(message)
      if(this.x < 4) clearInterval(yx)   
    }, time)
  }
  angleTrajectory(time) {
    var yx = setInterval(() => {

      this.efectorAngle = this.efectorAngle + 1
      this.baseAngle = this.baseAngle + 1
      var message = this.returnMessage()
      this.client.send(message)
      if(this.efectorAngle > 120) clearInterval(yx) 
      if(this.baseAngle > 120) clearInterval(yx)  
    }, time)
  }

  returnMessage() {
    return '{"move": {"baseAngle": ' + this.baseAngle + ', "efectorAngle":' + this.efectorAngle + ' }}'
  }
  
  reset() {
    this.x = this.a1 + this.a2
    this.y = 0
  }

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

}

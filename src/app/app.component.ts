import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  a1 = 6.5;
  a2 = 12.7;
  centroX = 0;
  centroY = 0;
  client: WebSocket
  messages: string[] = []
  _baseAngle = 0
  _efectorAngle = 0
  _x: number = 19.2
  _y: number = 0
  efeX: number
  efeY: number
  togle = true
  q1f: number
  q2f: number
  x2f: number
  y2f: number
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
    var velocidad = 0
    var coeficientes = this.coeficientesAngulo(this._x, this.x2f, 0, 0, time)
    var coeficientesBase = this.coeficientesAngulo(this._y, this.y2f, 0, 0, time)
    var yx = setInterval(() => {
      this.x = this.polinomiosAngulo(velocidad, coeficientes)
      this.y = this.polinomiosAngulo(velocidad, coeficientesBase)
      velocidad++
      console.log(this._x)
      this.sendMessage(this.baseAngle, this.efectorAngle)
      if(velocidad == time) clearInterval(yx)
    }, 100) 
  }
  yRect(time) {
    this.x = this.x2f
    this.y = this.y2f
    this.sendMessage(this.baseAngle, this.efectorAngle)
  }
  angleTrajectory(time) {
    var velocidad = 0
    var coeficientes = this.coeficientesAngulo(this._baseAngle, this.q2f, 0, 0, time)
    var coeficientesBase = this.coeficientesAngulo(this._efectorAngle, this.q1f, 0, 0, time)
    var yx = setInterval(() => {
      this.efectorAngle = this.polinomiosAngulo(velocidad, coeficientes)
      this.baseAngle = this.polinomiosAngulo(velocidad, coeficientesBase)
      velocidad++;

      this.sendMessage(this._baseAngle, this._efectorAngle)
      if(velocidad == time) clearInterval(yx)
    }, 100)      

  }
  coeficientesAngulo(qi, qf, qdi, qdf, tf){//qdi= ad de qi
   //con ti = 0
    var a0 = qi
    var a1 = qdi
    var a2 = (-3*(qi-qf) - (2*qdi+qdf)*tf)/(tf*tf)
    var a3 = (2*(qi-qf)+(qdi+qdf)*tf)/(tf*tf*tf)
    return {a0, a1, a2, a3}

  }

  polinomiosAngulo(t, coeficientes){
    var n = coeficientes
    console.log(coeficientes)
    var q = n.a0 + n.a1*t + n.a2*t*t + n.a3*t*t*t
    var qvel = n.a1 + 2*n.a2*t + 3*n.a3*t*t
    return q
  }
  // valoresTetha(){

  sendMessage(a, b) {
    var message = this.returnMessage(a, b)
    this.client.send(message)
  }
  // }
  returnMessage(a, b) {
    return '{"move": {"baseAngle": ' + a + ', "efectorAngle":' + b + ' }}'
  }
  
  reset() {
    this.x = this.a1 + this.a2
    this.y = 0
    this.sendMessage(this.baseAngle, this.efectorAngle)
  }

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

}

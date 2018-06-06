import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TORAD, TODEG } from '../core/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  angleForm:FormGroup
  positionForm:FormGroup
  r1 = 40;
  r2 = 40;
  r3 = 40;
  x = 127;
  y = 0;
  angle = 0;
  a1 = 0;
  a2 = 0;
  a3 = 0;
  gyro = 0;
  constructor() {
    this.angleForm = new FormGroup ({
      a1: new FormControl(this.a1),
      a2: new FormControl(this.a2),
      a3: new FormControl(this.a3),
      gyro: new FormControl(this.gyro)
    });
    this.positionForm = new FormGroup ({
      x: new FormControl(this.x),
      y: new FormControl(this.y),
      angle: new FormControl(this.angle),
      sigma: new FormControl()
    });
  }
  ngOnInit() {
    this.angleForm.valueChanges.subscribe(data => {
      var ob = this.directKinematics(data.a1*TORAD, data.a2*TORAD, data.a3*TORAD);
      // this.x = ob.x
      // this.y = ob.y
      this.a1 = data.a1*TORAD
      this.a2 = data.a2*TORAD
      this.a3 = data.a3*TORAD
    });
    this.positionForm.valueChanges.subscribe(data => {
      var ob = this.inverseKinematics(data.x, data.y, data.angle*TORAD, data.sigma);
      // console.log(data)
      // console.log(this.directKinematics(ob.a1, ob.a2, ob.a3))
      this.x = data.x
      this.y = data.y
      // this.angle = data.angle*TORAD
      // this.a1 = ob.a1
      // this.a2 = ob.a2
      // this.a3 = ob.a3
    });

  }

  directKinematics(a1, a2, a3) {
    var x = this.r1*this.c(a1) + this.r2*this.c(a1 + a2) + this.r3*this.c(a1 + a2 + a3)
    var y = this.r1*this.s(a1) + this.r2*this.s(a1 + a2) + this.r3*this.s(a1 + a2 + a3)
    return {x, y}
  }
  inverseKinematics(x, y, angle, sigma = 1) {
    var xalt = x - this.r3*this.c(angle)
    var yalt = y - this.r3*this.s(angle)
    var d = Math.sqrt(xalt^2 + yalt^2)
    var gm = Math.atan2(-yalt/d, xalt/d)
    var sum = -1*(xalt^2 + yalt^2 + this.r1^2 - this.r2^2 )
    var a1 = gm + sigma*Math.acos(sum/(2*this.r1*d))
    var a2 = Math.atan2((yalt - this.r1*this.s(a1))/this.r2, (xalt - this.r1*this.c(a1))/this.r2) - a1;
    var a3 = angle - a2 - a1;
    return {a1, a2, a3}
  }

  c(angle) {
    return Math.cos(angle)
  }
  s(angle) {
    return Math.sin(angle)
  }

  toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

}

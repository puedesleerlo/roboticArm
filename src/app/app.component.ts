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
  r = 127;
  phi = 0;
  z = 0;
  a1 = 0;
  a2 = 0;
  gyro = 0;
  constructor() {
    this.angleForm = new FormGroup ({
      a1: new FormControl(this.a1),
      a2: new FormControl(this.a2),
      gyro: new FormControl(this.gyro)
    });
    this.positionForm = new FormGroup ({
      r: new FormControl(this.r),
      z: new FormControl(this.phi),
      phi: new FormControl()
    });
  }
  ngOnInit() {
    this.angleForm.valueChanges.subscribe(data => {
      var ob = this.directKinematics(data.a1*TORAD, data.a2*TORAD, data.gyro*TORAD);
      // this.x = ob.x
      // this.y = ob.y
      this.a1 = data.a1*TORAD
      this.a2 = data.a2*TORAD
      this.gyro = data.gyro*TORAD
    });
    this.positionForm.valueChanges.subscribe(data => {
      var ob = this.inverseKinematics(data.x, data.y, data.angle*TORAD, data.sigma);
      // console.log(data)
      // console.log(this.directKinematics(ob.a1, ob.a2, ob.a3))
      this.r = data.x
      this.phi = data.y
      // this.angle = data.angle*TORAD
      // this.a1 = ob.a1
      // this.a2 = ob.a2
      // this.a3 = ob.a3
    });

  }

  directKinematics(a1, a2, gyro) { //polar coordinates
    var r = this.r1*this.c(a1) + this.r2*this.c(a1 + a2)
    var z = this.r1*this.s(a1) + this.r2*this.s(a1 + a2)
    var phi = gyro
    return {r, z}
  }
  inverseKinematics(x, y, sigma = 1) {
    
    return {a1, a2, gyro}
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

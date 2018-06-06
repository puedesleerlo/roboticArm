import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TORAD, TODEG } from '../core/constants';
import { Target } from '../core/tarjet.class';

declare interface CartesianCoordinates {
  x: number;
  y: number;
  z: number;
}
declare interface AngleCoordinates {
  a1: number;
  a2: number;
  a3: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  angleForm:FormGroup
  positionForm:FormGroup
  cartesianForm:FormGroup
  targets = []
  r1 = 40;
  r2 = 40;
  r = 80;
  phi = 0;
  x = 80;
  y = 0;
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
      z: new FormControl(this.z),
      phi: new FormControl(this.phi)
    });
    this.cartesianForm = new FormGroup ({
      x: new FormControl(this.x),
      y: new FormControl(this.y),
      z: new FormControl(this.z)
    });
  }
  ngOnInit() {
    this.angleForm.valueChanges.subscribe(data => {
      var ob = this.directPolarKinematics(data.a1*TORAD, data.a2*TORAD, data.gyro*TORAD);
      var car = this.toCartesian(ob.r, ob.z, ob.phi)
      this.assignValues(car.x, car.y, ob.r, ob.z, ob.phi, data.a1*TORAD, data.a2*TORAD, data.gyro*TORAD)
    });
    this.positionForm.valueChanges.subscribe(data => {
      var ob = this.inversePolarKinematics(data.r, data.phi*TORAD, data.z, data.sigma, this.r1, this.r2);
      var car = this.toCartesian(data.r, data.z, data.phi)
      this.assignValues(car.x, car.y, data.r, data.z, data.phi, ob.a1, ob.a2, ob.gyro)
    });
    this.cartesianForm.valueChanges.subscribe(data => {
      var ob = this.toCilindrical(data.x, data.y, data.z)
      var obj = this.inversePolarKinematics(ob.r, ob.phi*TORAD, ob.z, 1, this.r1, this.r2);
      this.assignValues(data.x, data.y, ob.r, data.z, ob.phi, obj.a1, obj.a2, obj.gyro)
    });

  }
  assignValues(x, y, r, z, phi, a1, a2, gyro) {
    this.r = r
    this.phi = phi
    this.z = z
    this.a1 = a1
    this.a2 = a2
    this.gyro = gyro
    this.x = x
    this.y = y
  }

  directPolarKinematics(a1, a2, gyro) { //polar coordinates
    var r = this.r1*this.c(a1) + this.r2*this.c(a1 + a2)
    var z = this.r1*this.s(a1) + this.r2*this.s(a1 + a2)
    var phi = gyro
    return {r, z, phi}
  }
  inversePolarKinematics(r, phi, z, sigma = 1, r1, r2) {
      let numerador = (Math.pow(r,2) + Math.pow(z,2) - Math.pow(r1,2) - Math.pow(r2,2))
      let denominador = 2*r1*r2
      let a2 = Math.acos(numerador/denominador)
      if(!a2) a2 = 0
      let gamma = Math.atan2(r2*Math.sin(a2), r1 + r2*Math.cos(a2))
      let a1 = Math.atan2(z, r) - gamma
      let gyro = phi
    return {a1, a2, gyro}
  }
  toCartesian(_r, _z, _phi ) {
    
    let x = _r*Math.cos(_phi*TORAD)
    let y = _r*Math.sin(_phi*TORAD)
    let z = _z
    return {x, y, z}
  }
  toCilindrical(x, y, _z) {
    let r = Math.sqrt(x*x + y*y)
    let phi = Math.atan2(y, x)*TODEG
    let z = _z
    return {r, phi, z}
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
  addTargect(velocity) {
    var target = new Target(
    this.x,
    this.y,
    this.r,    
    this.z,
    this.phi,    
    this.a1,
    this.a2,
    this.gyro
    )
    target.setFeedrate(velocity);
    this.targets.push(target)
    console.log(this.targets)
  }
  interpolation(targets, points) {
    
  }

}

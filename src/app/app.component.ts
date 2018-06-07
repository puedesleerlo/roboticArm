import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { TORAD, TODEG } from '../core/constants';
import { Target } from '../core/tarjet.class';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as FileSaver from 'file-saver'
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
  trajectoryForm: FormGroup
  velocityForm: FormGroup
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
  sigma = 1;
  time = 7;
  points = 3;
  xVel = 0;
  yVel = 0;
  zVel = 0;
  currentTrajectory: any
  positions = new BehaviorSubject<any>([]);
  gcode: string;
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
    this.trajectoryForm = new FormGroup ({
      time: new FormControl(this.time),
      points: new FormControl(this.points),
      initTarget: new FormControl(),
      finalTarget: new FormControl()
    });
    this.velocityForm = new FormGroup ({
      xVel: new FormControl(this.xVel),
      yVel: new FormControl(this.yVel),
      zVel: new FormControl(this.zVel)
    });
  }
  ngOnInit() {
    this.angleForm.valueChanges.subscribe(data => {
      var ob = this.directPolarKinematics(data.a1*TORAD, data.a2*TORAD, data.gyro*TORAD);
      var car = this.toCartesian(ob.r, ob.z, ob.phi)
      this.assignValues(car.x, car.y, ob.r, ob.z, ob.phi, data.a1*TORAD, data.a2*TORAD, data.gyro*TORAD)
    });
    this.positionForm.valueChanges.subscribe(data => {
      var ob = this.inversePolarKinematics(data.r, data.z, data.phi*TORAD, data.sigma, this.r1, this.r2);
      var car = this.toCartesian(data.r, data.z, data.phi)
      this.assignValues(car.x, car.y, data.r, data.z, data.phi, ob.a1, ob.a2, ob.gyro)
    });
    this.cartesianForm.valueChanges.subscribe(data => {
      var ob = this.toCilindrical(data.x, data.y, data.z)
      var obj = this.inversePolarKinematics(ob.r, ob.phi*TORAD, ob.z, 1, this.r1, this.r2);
      this.assignValues(data.x, data.y, ob.r, data.z, ob.phi, obj.a1, obj.a2, obj.gyro)
    });
    this.velocityForm.valueChanges.subscribe(data => {
      this.xVel = data.xVel
      this.yVel = data.yVel
      this.zVel = data.zVel
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
    var r = this.r1*Math.cos(a1) + this.r2*Math.cos(a1 + a2)
    var z = this.r1*Math.sin(a1) + this.r2*Math.sin(a1 + a2)
    var phi = gyro
    return {r, z, phi}
  }
  inversePolarKinematics(r, z, phi, sigma = 1, r1, r2) {
      let numerador = (Math.pow(r,2) + Math.pow(z,2) - Math.pow(r1,2) - Math.pow(r2,2))
      let denominador = 2*r1*r2
      let a2 = Math.acos(numerador/denominador)
      if(!a2) a2 = 0
      let gamma = Math.atan2(r2*Math.sin(a2), r1 + r2*Math.cos(a2))
      let a1 = Math.atan2(z, r) - gamma;
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


  toRadians (angle) {
    return angle * (Math.PI / 180);
  }



  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }
  // generateTrajectory(targets, time, points) {
  //   var chunks = this.arrayChunks(targets)
  //   let trajectory = []
  //   for(let i; i<chunks.length; i++) {
  //     trajectory = trajectory.concat(this.interpolation(chunks[i][0], chunks[i][1], time, points))
  //   }
  //   console.log(trajectory)
  //   return trajectory
  // }
  // addTargect(velocity) {
  //   var target = new Target(
  //   this.x,
  //   this.y,
  //   this.r,    
  //   this.z,
  //   this.phi,    
  //   this.a1,
  //   this.a2,
  //   this.gyro
  //   )
  //   target.setFeedrate(velocity);
  //   this.targets.push(target)
  //   this.trajectoryForm.get('targets').push(target)
  //   console.log(this.targets)
  // }
  setHere() {
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
      target.setFeedrate(this.xVel, this.yVel, this.zVel)
      return target
  }
  setInitHere() {
      var initTarget = this.setHere()
      this.trajectoryForm.controls["initTarget"].setValue(initTarget)
  }
  setFinalHere() {
    var finalTarget = this.setHere()
      this.trajectoryForm.controls["finalTarget"].setValue(finalTarget)
  }

  interpolation(time, points, iTarget: Target, fTarget: Target) {
    
    var coeficientesX = this.coeficientes(
      iTarget.x, 
      fTarget.x, 
      iTarget.xVel, 
      fTarget.xVel, 
      time
    )
    var coeficientesY = this.coeficientes(
      iTarget.y, 
      fTarget.y, 
      iTarget.yVel, 
      fTarget.yVel, 
      time
    )
    var coeficientesZ = this.coeficientes(
      iTarget.z, 
      fTarget.z, 
      iTarget.zVel, 
      fTarget.zVel, 
      time
    )
    var angles = []
    var positions = []
    var velocities = []
    var interval = time/points;
    for (let i = 0; i <= points; i++) {
      let lapsus = i*interval    
      let xPoint = this.polinomio(lapsus, coeficientesX);
      let yPoint = this.polinomio(lapsus, coeficientesY);
      let zPoint = this.polinomio(lapsus, coeficientesZ); 
      let k = this.toCilindrical(xPoint.q, yPoint.q, zPoint.q);
      let kVel = this.toCilindricalVelocity(xPoint.q, yPoint.q, zPoint.q, xPoint.qvel, yPoint.qvel, zPoint.qvel)
      let obj = this.inversePolarKinematics(k.r, k.z, k.phi, this.sigma, this.r1, this.r2);
      console.log("interpolation", obj.a1, obj.a2)
      let objVel = this.inverseVelocityKinematics(
        k.r, 
        k.z, 
        k.phi, 
        kVel.rVel, 
        kVel.zVel, 
        kVel.phiVel,  
        obj.a1, 
        obj.a2, 
        obj.gyro,
        this.r1, 
        this.r2)
      velocities.push(objVel)
      angles.push(obj);
      positions.push({xPoint, yPoint, zPoint})
    }
    
    return {angles, velocities, positions}
  }
  coeficientes(qi, qf, qdi, qdf, tf){//qdi= ad de qi
   //con ti = 0
    var a0 = qi
    var a1 = qdi
    var a2 = (-3*(qi-qf) - (2*qdi+qdf)*tf)/(tf*tf)
    var a3 = (2*(qi-qf)+(qdi+qdf)*tf)/(tf*tf*tf)

    return {a0, a1, a2, a3}

  }
  polinomio(t, coeficientes){
    var n = coeficientes
    var q = n.a0 + n.a1*t + n.a2*t*t + n.a3*t*t*t
    var qvel = n.a1 + 2*n.a2*t + 3*n.a3*t*t
    return {q, qvel}
  }
  inverseVelocityKinematics(r, z, phi, rVel, zVel, phiVel, a1, a2, gyro, r1, r2) { //radPerSecond
    let numerador = (Math.pow(r,2) + Math.pow(z,2) - Math.pow(r1,2) - Math.pow(r2,2))
    let denominador = 2*r1*r2
    
    let gamma = 1/(Math.sqrt(1- numerador/denominador)*denominador)
    if(!gamma || gamma == Infinity) gamma = 0;
    var a2Vel = (r*rVel + z*zVel)*gamma;
    var twoR = r^2 + z^2
    var sigma = -r1*(r2 + r1*Math.cos(a2))/(r2^2 + 2*r1*r2*Math.cos(a2))
    var atanV = -z*rVel/twoR + r*zVel/twoR;
    var a1Vel = atanV + sigma*a2Vel
    var gyroVel = phiVel
    return {a1Vel, a2Vel, gyroVel}
  }
  toCilindricalVelocity(x, y, z, xVel, yVel, zVel) {
    var twoR = x^2 + y^2
    var phiVel = -y*xVel/twoR + x*yVel/twoR;
    var sqrTwoR = Math.sqrt(twoR)
    var rVel = x*xVel/sqrTwoR + y*yVel/sqrTwoR
    return {rVel, zVel, phiVel}
  }
  submitTrajectory() {
    var val = this.trajectoryForm.value
    var a = this.interpolation(val.time, val.points, val.initTarget, val.finalTarget);
    this.positions.next(a.positions);
    return a
  }
  makeGcode(trajectory) {
    var rad18 = 0.0314159
    var gcodeString = "G90 \n"
    var angles = trajectory.angles
    var velocities = trajectory.velocities
    angles.forEach((elem, index) => {
      console.log("makeCode", elem.a2*TODEG, elem.a2)
      var a1 = (elem.a1/rad18).toFixed(2)
      var a2 = (elem.a2/rad18).toFixed(2)
      var gyro = (elem.gyro/rad18).toFixed(2)
      var feedRate = Math.pow(velocities[index].a1Vel, 2)
        Math.pow(velocities[index].a2Vel,2) +
        Math.pow(velocities[index].gyroVel,2);
      if(feedRate == 0) feedRate = 5
      gcodeString = gcodeString 
      + "G1 X" + a1 + 
      " Y" + a2 +
      " Z" + gyro + " F" + feedRate.toFixed(0) + " \n";  
    });
    return gcodeString
  }
  buttonGcode() {
    var a = this.submitTrajectory()
    this.gcode = this.makeGcode(a)
  }
  downloadGcode() {
    var blob = new Blob([this.gcode], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "trajectory.gcode");
  }
}

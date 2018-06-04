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

  ngOnInit() {
    
  }

  directKinematics(a1, a2, a3) {
    return {x: 2, y:3}
  }

  get x() {
    return 3
  }
  get y() {
    return 4
   }

  toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

}

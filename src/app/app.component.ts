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
  a3 = 4;
  x = 10;
  y = 10;
  ngOnInit() {
    
  }
  changes(a1, a2, a3) {

  }

  directKinematics(a1, a2, a3) {
    
  }

  toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

}

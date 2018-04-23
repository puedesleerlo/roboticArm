import { Component, OnInit, Input, OnChanges, SimpleChange  } from '@angular/core';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  @Input() efectorX: number;
  @Input() efectorY: number;
  @Input() poleX: number;
  @Input() poleY: number;
  // @Input() segmentlength: number;
  @Input() centroX: number;
  @Input() centroY: number;
  // poleX:number;
  // poleY:number;
  disc=0;
  constructor() { }

  ngOnInit() {
    // this.drawArm(160, 160, -1)
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    
  }
}

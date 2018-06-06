import { Component, OnInit, Input, OnChanges, SimpleChange  } from '@angular/core';
import { Bone, Chain2D, V2 } from '../../core';
import { TORAD } from '../../core/constants';
const GLOBAL_ABSOLUTE = 6;
@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  @Input() r: number;
  @Input() z: number;
  @Input() phi: number;
  chain: Chain2D
  // @Input() segmentlength: number;
  // poleX:number;
  // poleY:number;
  disc=0;
  constructor() {
    this.chain = new Chain2D();
    var boneLength = 40;

    var basebone = new Bone( new V2(0, 0), new V2(0, boneLength) );
    // basebone.setClockwiseConstraintDegs(-90);
    // basebone.setAnticlockwiseConstraintDegs(90);     
    this.chain.addBone( basebone );

    // Fix the base bone to its current location, and constrain it to the positive Y-axis
    this.chain.setFixedBaseMode( true );       
    // this.chain.setBaseboneConstraintType( GLOBAL_ABSOLUTE );
    // this.chain.setBaseboneConstraintUV( new V2(0, 1) );

    // Create and add the second bone - 50 clockwise, 90 anti-clockwise
    this.chain.addConsecutiveBone(new Bone(new V2(0, 1), undefined, new V2(0, 1), boneLength, -180, 180));

    // Create and add the third bone - 75 clockwise, 90 anti-clockwise
    this.chain.addConsecutiveBone(new Bone(new V2(0, 1), undefined, new V2(0, 1), boneLength, -180, 180));
   }

  ngOnInit() {
    
    // this.drawArm(160, 160, -1)
    

  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    var x = this.r*Math.cos(this.phi*TORAD)
    var y = this.r*Math.sin(this.phi*TORAD)
    this.chain.solveForTarget(new V2(x, y))
    var numBones = this.chain.numBones
    var b, pos, pos2
    for ( var j = 0; j < numBones; j++ ) {
      b = this.chain.bones[j];
      pos = b.getStartLocation();
      pos2 = b.getEndLocation();
      console.log(pos2)
      
    }
  }
}

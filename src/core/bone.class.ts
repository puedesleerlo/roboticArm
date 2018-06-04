import {V2} from "./V2"
import { Joint2D } from "./joint.class";
export class Bone {
    length: number;
    stlpath: string;
    start: V2;
    end: V2;
    joint: Joint2D;
    globalConstraintUV: V2;
    boneConnectionPoint: V2

    constructor(Start, End?, directionUV?, length = 0, clockwiseDegs?, anticlockwiseDegs?, stlpath?) {
        this.start = new V2();
        this.end = new V2();
        this.length = length || 0;

        this.joint = new Joint2D( clockwiseDegs, anticlockwiseDegs );
        this.globalConstraintUV = new V2(1, 0);
        this.boneConnectionPoint = this.end;

        this.setStartLocation( Start );

    if( End ){ 

        this.setEndLocation( End );
        if( this.length === 0 ) this.length = this.getLength();

    } else if ( directionUV ) {

        this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( this.length ) ) );
        
    }

    }

    clone() {

        var b = new Bone( this.start, this.end );
        b.length = this.length;
        b.globalConstraintUV = this.globalConstraintUV;
        b.boneConnectionPoint = this.boneConnectionPoint;
        b.joint = this.joint.clone();
        return b;

    }
    

    // SET



    setStartLocation( v ) {

        this.start.copy( v );

    }

    setEndLocation( v ) {

        this.end.copy( v );

    }

    setLength( length ) {

        if ( length > 0 ) this.length = length;

    }

    // SET JOINT

    setJoint( joint ) {

        this.joint = joint;

    }

    setClockwiseConstraintDegs( angleDegs ) {

        this.joint.setClockwiseConstraintDegs( angleDegs );

    }

    setAnticlockwiseConstraintDegs( angleDegs ) {

        this.joint.setAnticlockwiseConstraintDegs( angleDegs );

    }

    setJointConstraintCoordinateSystem( coordSystem ) {

        this.joint.setConstraintCoordinateSystem( coordSystem );

    }


    // GET

    getDirectionUV() {

        return this.end.minus( this.start ).normalize();

    }

    getLength() {

        return this.start.distanceTo( this.end );

    }


}
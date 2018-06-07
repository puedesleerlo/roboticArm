export class Target {
    x: number;
    y: number;
    z: number;
    r: number;
    phi: number;
    a1: number;
    a2: number;
    gyro: number;
    xVel: number;
    yVel: number;
    zVel: number;
    constructor(x, y, r, z, phi, a1, a2, gyro) {
        this.x = x;
        this.y = y
        this.z = z
        this.r = r
        this.phi = phi
        this.a1 = a1
        this.a2 = a2
        this.gyro = gyro
    }
    gCodeCartesian() {
        //Interpretar cartesianas a angulos
    }
    gCodeAngles() {
        //generar gcode de ángulos
    }
    setFeedrate(x, y, z) {
        this.xVel = x
        this.yVel = y
        this.zVel = z
    }
}
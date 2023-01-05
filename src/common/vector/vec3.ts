export class Vec3 {
  constructor(public x: number = -1, public y: number = -1, public z: number = -1) {}

  toArray(): [x: number, y: number, z: number] {
    return [this.x, this.y, this.z];
  }
}

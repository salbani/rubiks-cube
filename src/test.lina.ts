import { Matrix } from "./class.matrix";
import { Vector } from "./class.vector";
import { RubiksCube } from "./class.rubiks-cube";

let m1 = Matrix.FromArrays([1,4,7], [0,7,5], [9,7,3]);
console.log(...m1.Entries);
console.log(m1.Determinant)

let m2 = Matrix.FromArrays([1,4,7,2], [0,7,5,0], [9,7,3,2], [4,5,1,0]);
console.log(...m2.Entries);
console.log(m2  .Determinant)

let m3 = Matrix.FromArrays([1,4,7,2,0], [0,7,5,0,2], [9,7,3,2,4], [4,5,1,0,1], [1,4,5,3,0]);
console.log(...m3.Entries);
console.log(m3  .Determinant)

let v1 = new Vector(1,0,3);
let v2 = new Vector(1,3,2);
console.log(v1.Entries,v2.Entries,v1.Cross(v2).Entries);

let cube = new RubiksCube();
console.log(cube.Cube);

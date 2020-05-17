import { Vector } from "./class.vector";
import { CubePiece } from "./class.cube-piece";
import { Shader } from "./class.webglshader";
import { Matrix4D } from "./class.matrix";

export class RubiksCube {

    Cube: CubePiece[][][];

    constructor() {
        this.Cube = []
        this.Create();
    }

    Create() {
        for (let z = -1; z <= 1; z++) {
            this.Cube[z + 1] = []
            for (let y = -1; y <= 1; y++) {
                this.Cube[z + 1][y + 1] = []
                for (let x = -1; x <= 1; x++) {
                    this.Cube[z + 1][y + 1][x + 1] = new CubePiece(new Vector(x, y, z));
                }
            }
        }
    }

    Draw(context: WebGLRenderingContext) {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = context.canvas.clientWidth / context.canvas.clientHeight;
        const zNear = 0.01;
        const zFar = 100.0;

        const projectionMatrix = Matrix4D.Perspective(fieldOfView, aspect, zNear, zFar);
        // const projectionMatrix = new Matrix4D();
        
        for (let i = 0; i < this.Cube.length; i++) {
            for (let j = 0; j < this.Cube.length; j++) {
                for (let k = 0; k < this.Cube.length; k++) {
                    this.Cube[i][j][k].Model.Rotation[0] += 0.01;
                    this.Cube[i][j][k].Model.Rotation[1] += 0.01;
                    this.Cube[i][j][k].Model.Rotation[2] += 0.01;
                    // this.Cube[i][j][k].Model.DrawModel(context, projectionMatrix);
                }
            }
        }
        // this.Cube[0][0][0].Model.Rotation[0] += 0.01;
        // this.Cube[0][0][0].Model.DrawModel(context);
    }

    InitModels(context: WebGLRenderingContext, shader: Shader) {
        for (let i = 0; i < this.Cube.length; i++) {
            for (let j = 0; j < this.Cube.length; j++) {
                for (let k = 0; k < this.Cube.length; k++) {
                    this.Cube[i][j][k].InitModel(context, shader);
                }
            }
        }
    }
}
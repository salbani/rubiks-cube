import { Vector } from "./class.vector";
import { Face } from "./class.face";
import { Color, Colors } from "./enum.color";
import { Model } from "./class.model";
import { Shader } from "./class.webglshader";

export class CubePiece {
    Position: Vector;
    Faces: Face[];
    Model: Model;

    constructor(position: Vector) {
        this.Position = position;
        this.Faces = [];
        this.GenerateFaces();
    }

    GenerateFaces() {
        for (let i = 0; i < 6; i++) {
            let unitVector = Vector.Unit(3, i % 3 + 1).Multiply(i < 3 ? 1 : -1);
            let angle = unitVector.Angle(this.Position);
            if (angle < Math.PI / 2)
                this.Faces.push(new Face(unitVector, i))
        }
    }

    InitModel(context: WebGLRenderingContext, shader: Shader) {
        let model = new Model(this.Position);
        for (const face of this.Faces) {
            let fragment = model.NewFragment(shader, Colors[face.Color]);
            let quad = face.GenerateQuad();
            fragment.AddRectangle(quad[0],quad[1],quad[2],quad[3])
            fragment.BuildBuffer(context);
        }
        this.Model = model;
    }
}   
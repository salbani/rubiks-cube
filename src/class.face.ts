import { Vector } from "./class.vector";
import { Color } from "./enum.color";

export class Face {
    Position: Vector;
    Color: Color;

    constructor(position: Vector, color: Color) {
        this.Position = position;
        this.Color = color;
    }

    GenerateQuad() {
        let vectors: Vector[] = [];
        for (let i = 0; i < 4; i++) {
            vectors[i] = new Vector(3);
        }
        let k = 0;
        for (let i = 0; i < 3; i++) {
            if (Math.abs(this.Position.Entries[i]) == 1) {
                for (let j = 0; j < vectors.length; j++) {
                    vectors[j][i] = this.Position.Entries[i];
                }
            } else {
                vectors[0][i] = 1; vectors[1][i] = 1 - k * 2; vectors[2][i] = -1; vectors[3][i] = -1 + k * 2;
                k++;
            }
        }
        return vectors;
    }
}
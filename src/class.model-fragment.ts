import { Vector } from "./class.vector";
import { Shader } from "./class.webglshader";

export class ModelFragment {
    Vertecies: Vector[];
    Indices: number[];
    Shader: Shader;
    Color: number[];
    VertecieBuffer: number[];
    ColorBuffer: number[];
    Buffers:{
        vertecieBuffer: WebGLBuffer | null,
        colorBuffer: WebGLBuffer | null,
        indiceBuffer: WebGLBuffer | null
    };

    constructor(shader: Shader, color: number[]) {
        this.Shader = shader;
        this.Color = color;
        this.Vertecies = [];
        this.Indices = [];
    }

    AddTriangle(x1: Vector, x2: Vector, x3: Vector);
    AddTriangle(...position: Vector[]) {
        for (let i = 0; i < position.length; i++) {
            this.AddVertecie(position[i]);
        }
    }

    private AddVertecie(vertecie: Vector) {
        for (let i = 0; i < this.Vertecies.length; i++) {
            if (vertecie.IsSameAs(this.Vertecies[i])) {
                this.Indices.push(i);
                this.PrepareBuffers();
                return;
            }
        }
        this.Vertecies.push(vertecie);
        this.Indices.push(this.Vertecies.length - 1);
        this.PrepareBuffers();
    }

    AddRectangle(x1: Vector, x2: Vector, x3: Vector, x4: Vector) {
        this.AddTriangle(x1, x2, x3);
        this.AddTriangle(x3, x4, x1);
    }

    PrepareBuffers() {
        this.VertecieBuffer = [];
        for (const vertex of this.Vertecies) {
            for (const entrie of vertex.Entries) {
                this.VertecieBuffer.push(entrie);
            }
        }
        this.ColorBuffer = [];
        for (let i = 0; i < this.Vertecies.length; i++) {
            this.ColorBuffer.push(...this.Color);
        }
    }

    BuildBuffer(context: WebGLRenderingContext) {
        const vertecieBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, vertecieBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.VertecieBuffer), context.STATIC_DRAW);

        const colorBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.ColorBuffer), context.STATIC_DRAW);

        const indiceBuffer = context.createBuffer();
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indiceBuffer);
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.Indices), context.STATIC_DRAW);
        
        return this.Buffers = {
            vertecieBuffer: vertecieBuffer,
            colorBuffer: colorBuffer,
            indiceBuffer: indiceBuffer
        };
    }
}
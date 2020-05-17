import { ModelFragment } from "./class.model-fragment";
import { Matrix4D } from "./class.matrix";
import { Vector } from "./class.vector";
import { Shader } from "./class.webglshader";
import { Colors } from "./enum.color";

export class Model {
    Fragments: ModelFragment[] = [];
    Position: Vector;
    Rotation: Vector;

    constructor(position = new Vector(3), rotation = new Vector(3)) {
        this.Position = position;
        this.Rotation = rotation;
    }

    NewFragment(shader: Shader, color: number[]) {
        let fragment = new ModelFragment(shader, color);
        this.Fragments.push(fragment);
        return fragment;
    }

    static Cube(shader: Shader) {
        let model = new Model();
        for (let g = 0; g < 6; g++) {
            let fragment = model.NewFragment(shader, Colors[g]);
            const a = g < 3 ? 1 : -1;
            const index = g % 3;
            let k = 0;
            let x1 = new Vector(3), x2 = new Vector(3), x3 = new Vector(3), x4 = new Vector(3);
            for (let i = 0; i < 3; i++) {
                if (i == index) {
                    x1[i] = x2[i] = x3[i] = x4[i] = a;
                } else {
                    x1[i] = 1; x2[i] = 1 - k * 2; x3[i] = -1; x4[i] = -1 + k * 2;
                    k++;
                }
            }
            fragment.AddRectangle(x1, x2, x3, x4);
        }
        return model;
    }

    BuildBuffers(context: WebGLRenderingContext) {
        for (const fragment of this.Fragments) {
            fragment.BuildBuffer(context);
        }
    }

    DrawModel(context: WebGLRenderingContext, projectionMatrix: Matrix4D, cameraMatrix: Matrix4D) {

        const modelViewMatrix = projectionMatrix.Multiply4D(cameraMatrix.Inverse());
        modelViewMatrix.Translate(this.Position);
        modelViewMatrix.ScaleV3(2);
        modelViewMatrix.Roatate(this.Rotation.Copy());
        for (const fragment of this.Fragments) {
            let buffers = fragment.Buffers;

            context.useProgram(fragment.Shader.ShaderProgramm);

            {
                const numComponents = 3;
                const type = context.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                context.bindBuffer(context.ARRAY_BUFFER, buffers.vertecieBuffer);
                context.vertexAttribPointer(
                    fragment.Shader.AttribLocations.position,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            }

            {
                const numComponents = 4;
                const type = context.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                context.bindBuffer(context.ARRAY_BUFFER, buffers.colorBuffer);
                context.vertexAttribPointer(
                    fragment.Shader.AttribLocations.color,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            }
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.indiceBuffer);

            // Tell WebGL to use our program when drawing

            // Set the shader uniforms
            context.uniformMatrix4fv(
                fragment.Shader.UniformLoactions.modelViewMatrix,
                false,
                modelViewMatrix.ToFloat32Array());
            {
                const vertexCount = fragment.Indices.length;
                const type = context.UNSIGNED_SHORT;
                const offset = 0;
                context.drawElements(context.TRIANGLES, vertexCount, type, offset);
            }
        }
    }
}
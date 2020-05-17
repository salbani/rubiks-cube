import { Vector } from "./class.vector";

export class Matrix {
    [key: number]: number;
    Entries: number[][] = [];

    get M() {
        return this.Entries.length;
    }

    get N() {
        return this.Entries[0].length;
    }

    get Determinant() {
        if (this.M === 2 && this.N === 2) {
            return this.Entrie(0, 0) * this.Entrie(1, 1) - this.Entrie(0, 1) * this.Entrie(1, 0);
        } else {
            let det = 0;
            for (let k = 0; k < this.M; k++) {
                if (this.Entrie(0, k) != 0) {
                    let matrix = this.Eleminate(0, k);
                    det += (-1) ** k * this.Entrie(0, k) * matrix.Determinant;
                }
            }
            return det;
        }
    }

    constructor(m: number, n: number) {
        for (let i = 0; i < m; i++) {
            this.Entries[i] = [];
            for (let j = 0; j < n; j++) {
                this.Entries[i][j] = i == j ? 1 : 0;
                Object.defineProperty(this, j + i * m, {
                    get: () => {
                        return this.Entries[i][j]
                    },
                    set: (val) => {
                        this.Entries[i][j] = val;
                    }
                })
            }
        }
    }

    Entrie(m: number, n: number) {
        return this.Entries[n][m];
    }

    Eleminate(x: number, y: number) {
        let arrays: number[][] = [];
        for (let n = 0; n < this.N; n++) {
            if (n != x) {
                let array: number[] = [];
                for (let m = 0; m < this.M; m++) {
                    if (m != y) {
                        array.push(this.Entrie(n, m));
                    }
                }
                arrays.push(array);
            }
        }
        return Matrix.FromArrays(...arrays);
    }

    Multiply(matrix: Matrix) {
        let result = new Matrix(this.M, matrix.N);
        if (matrix.N !== this.M) {
            console.error("cant multiply these matrices", matrix, this);
            return result;
        }
        for (let n = 0; n < this.N; n++) {
            for (let m = 0; m < matrix.M; m++) {
                for (let i = 0; i < this.N; i++) {
                    result.Entries[m][n] += matrix.Entrie(m, i) * this.Entrie(m, n);
                }
            }
        }
        return result;
    }

    ToFloat32Array() {
        let buf: number[] = [];
        for (let i = 0; i < this.M * this.N; i++) {
            buf[i] = this[i];
        }
        return new Float32Array(buf);
    }

    static Rotation3DMatrix(dimension: number, rad: number, axis: Vector) {
        axis.Normalize();
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let t = 1 - c;
        let matrix = new Matrix(dimension, dimension);
        let x = axis.X;
        let y = axis.Y;
        let z = axis.Z;
        matrix[0] = x * x * t + c; matrix[1] = y * x * t + z * s; matrix[2] = z * x * t - y * s;
        matrix[1 * dimension] = x * y * t - z * s; matrix[1 + 1 * dimension] = y * y * t + c; matrix[2 + 1 * dimension] = z * y * t + x * s;
        matrix[2 * dimension] = x * z * t + y * s; matrix[1 + 2 * dimension] = y * z * t - x * s; matrix[2 + 2 * dimension] = z * z * t + c;
        return matrix;
    }

    static FromVectors(...vectors: Vector[]) {
        let arrays: number[][] = []
        for (let i = 0; i < vectors.length; i++) {
            arrays[i] = vectors[i].Entries;
        }
        return this.FromArrays(...arrays);
    }

    static FromArrays(...arrays: number[][]) {
        let matrix = new Matrix(arrays[0].length, arrays.length)
        for (let n = 0; n < arrays.length; n++) {
            for (let m = 0; m < arrays[n].length; m++) {
                matrix.Entries[m][n] = arrays[n][m];
            }
        }
        return matrix;
    }
}

export class Matrix4D extends Matrix {
    constructor() {
        super(4, 4);
    }

    Translate(v: Vector) {
        for (let i = 0; i < 4; i++) {
            this.Entries[3][i] += this.Entrie(0, i) * v.X + this.Entrie(1, i) * v.Y + this.Entrie(2, i) * v.Z;
        }
    }

    Roatate(axis: Vector, rad?: number) {
        rad = rad || axis.Length;
        axis.Normalize();
        let x = axis.Entries[0],
            y = axis.Entries[1],
            z = axis.Entries[2];

        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let t = 1 - c;

        let a00 = this[0]; let a01 = this[1]; let a02 = this[2]; let a03 = this[3];
        let a10 = this[4]; let a11 = this[5]; let a12 = this[6]; let a13 = this[7];
        let a20 = this[8]; let a21 = this[9]; let a22 = this[10]; let a23 = this[11];

        // Construct the elements of the rotation matrix
        let b00 = x * x * t + c; let b01 = y * x * t + z * s; let b02 = z * x * t - y * s;
        let b10 = x * y * t - z * s; let b11 = y * y * t + c; let b12 = z * y * t + x * s;
        let b20 = x * z * t + y * s; let b21 = y * z * t - x * s; let b22 = z * z * t + c;

        let out = new Matrix4D();
        // Perform rotation-specific matrix multiplication
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        this.Entries = out.Entries;
        return this;
    }

    ScaleV3(scale: Vector)
    ScaleV3(scale: number)
    ScaleV3(scale: Vector | number) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                this.Entries[i][j] *= typeof scale === "number" ? scale : scale.Entries[i];
            }
        }
    }

    Multiply4D(matrix: Matrix4D) {
        let result = new Matrix4D();
        for (let n = 0; n < this.N; n++) {
            for (let m = 0; m < matrix.M; m++) {
                for (let i = 0; i < this.N; i++) {
                    result.Entries[m][n] += matrix.Entrie(m, i) * this.Entrie(m, n);
                }
            }
        }
        return result;
    }

    static Perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        let dst = new Matrix4D();
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);

        dst[0] = f / aspect;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = f;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = (near + far) * rangeInv;
        dst[11] = -1;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = near * far * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }

    Inverse() {
        let dst = new Matrix4D();
        let m00 = this[0 * 4 + 0];
        let m01 = this[0 * 4 + 1];
        let m02 = this[0 * 4 + 2];
        let m03 = this[0 * 4 + 3];
        let m10 = this[1 * 4 + 0];
        let m11 = this[1 * 4 + 1];
        let m12 = this[1 * 4 + 2];
        let m13 = this[1 * 4 + 3];
        let m20 = this[2 * 4 + 0];
        let m21 = this[2 * 4 + 1];
        let m22 = this[2 * 4 + 2];
        let m23 = this[2 * 4 + 3];
        let m30 = this[3 * 4 + 0];
        let m31 = this[3 * 4 + 1];
        let m32 = this[3 * 4 + 2];
        let m33 = this[3 * 4 + 3];
        let tmp_0 = m22 * m33;
        let tmp_1 = m32 * m23;
        let tmp_2 = m12 * m33;
        let tmp_3 = m32 * m13;
        let tmp_4 = m12 * m23;
        let tmp_5 = m22 * m13;
        let tmp_6 = m02 * m33;
        let tmp_7 = m32 * m03;
        let tmp_8 = m02 * m23;
        let tmp_9 = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        dst[0] = d * t0;
        dst[1] = d * t1;
        dst[2] = d * t2;
        dst[3] = d * t3;
        dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

        return dst;
    }

    static LookAt(cameraPosition: Vector, target: Vector, up: Vector) {
        let dst = new Matrix4D();
        let zAxis = cameraPosition.Subtract(target).Normalize();
        let xAxis = up.Cross(zAxis).Normalize();
        let yAxis = zAxis.Cross(xAxis).Normalize();

        dst[0] = xAxis[0];
        dst[1] = xAxis[1];
        dst[2] = xAxis[2];
        dst[3] = 0;
        dst[4] = yAxis[0];
        dst[5] = yAxis[1];
        dst[6] = yAxis[2];
        dst[7] = 0;
        dst[8] = zAxis[0];
        dst[9] = zAxis[1];
        dst[10] = zAxis[2];
        dst[11] = 0;
        dst[12] = cameraPosition[0];
        dst[13] = cameraPosition[1];
        dst[14] = cameraPosition[2];
        dst[15] = 1;

        return dst;
    }
}
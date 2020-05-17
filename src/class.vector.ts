import { Matrix } from "./class.matrix";

export class Vector {
    [key: number]: number;
    Entries: number[] = [];

    get X() {
        return this.Entries[0];
    }

    get Y() {
        return this.Entries[1];
    }

    get Z() {
        return this.Entries[2];
    }

    get Dimension() {
        return this.Entries.length;
    }

    get Length() {
        let sum = 0;
        for (const entrie of this.Entries) {
            sum += entrie ** 2;
        }
        return Math.sqrt(sum);
    }

    constructor(dimension: number);
    constructor(x: number, y: number, z: number);
    constructor(...entries: number[]);
    constructor(...entries: number[]) {
        if(entries[0] === undefined) {
            console.error('a vector need at least a dimension');
        }
        if (entries.length == 1) {
            for (let i = 0; i < entries[0]; i++) {
                this.Entries[i] = 0;
            }
        } else {
            for (let i = 0; i < entries.length; i++) {
                this.Entries[i] = entries[i];
            }
        }
        for (let i = 0; i < this.Dimension; i++) {
            Object.defineProperty(this, i, {
                get: () => {
                    return this.Entries[i]
                },
                set: (val) => {
                    this.Entries[i] = val;
                }
            })
        }
    }

    Normalize() {
        if (this.Length == 1)
            return this;
        let length = this.Length;
        for (let i = 0; i < this.Entries.length; i++) {
            this.Entries[i] = this.Entries[i] / length;
        }
        return this;
    }

    MultiplyMatrix(matrix: Matrix) {
        let vector = new Vector(matrix.M);
        for (let i = 0; i < matrix.M; i++) {
            vector.Entries[i] = 0;
            for (let j = 0; j < this.Dimension; j++) {
                vector.Entries[i] += this.Entries[j] * matrix.Entrie(i, j);
            }
        }
        return vector;
    }

    Multiply(value: number) {
        let newVector = new Vector(this.Dimension);
        for (let i = 0; i < this.Dimension; i++) {
            newVector.Entries[i] = this.Entries[i] * value;
        }
        return newVector;
    }

    Add(vector: Vector) {
        let newVector = new Vector(this.Dimension);
        for (let i = 0; i < this.Dimension; i++) {
            newVector.Entries[i] = this.Entries[i] + vector.Entries[i];
        }
        return newVector;
    }

    Subtract(vector: Vector) {
        let newVector = new Vector(this.Dimension);
        for (let i = 0; i < this.Dimension; i++) {
            newVector.Entries[i] = this.Entries[i] - vector.Entries[i];
        }
        return newVector;
    }

    Cross(...vectors: Vector[]) {
        vectors.unshift(this);
        let product = Vector.Empty(vectors[0].Dimension);
        for (let k = 0; k < vectors[0].Dimension; k++) {
            let matrix = Matrix.FromVectors(...vectors).Eleminate(-1, k);
            product = product.Add(Vector.Unit(vectors[0].Dimension, k + 1).Multiply((-1) ** k * matrix.Determinant));
        }
        return product;
    }

    Skalar(vector: Vector) {
        let skalar = 0;
        for (let i = 0; i < this.Dimension; i++) {
            skalar += this.Entries[i] * vector.Entries[i];
        }
        return skalar;
    }

    IsEqualTo(vector: Vector) {
        let x = vector.Entries[0] / this.Entries[0];
        for (let i = 0; i < this.Dimension; i++) {
            if (this.Entries[i] * x !== vector.Entries[i])
                return false;
        }
        return true;
    }

    IsSameAs(vector: Vector) {
        if (vector.Dimension != this.Dimension)
            return false;
        for (let i = 0; i < vector.Entries.length; i++) {
            if (vector.Entries[i] != this.Entries[i])
                return false;
        }
        return true;
    }

    Angle(vector: Vector) {
        return Math.acos(this.Skalar(vector) / (this.Length * vector.Length));
    }

    Copy(){
        let vec = new Vector(...this.Entries);
        return vec;
    }

    static get UnitX() {
        return this.Unit(3, 1);
    }

    static get UnitY() {
        return this.Unit(3, 2);
    }

    static get UnitZ() {
        return this.Unit(3, 3);
    }

    static Empty(dim: number) {
        let vector = new Vector(dim);
        for (let i = 0; i < dim; i++) {
            vector.Entries[i] = 0;
        }
        return vector;
    }

    static Unit(dim: number, unitDim: number) {
        let unitVector = Vector.Empty(dim)
        unitVector.Entries[unitDim - 1] = 1;
        return unitVector;
    }
}
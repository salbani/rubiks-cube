export class Shader {
    Context: WebGLRenderingContext;
    ShaderProgramm: any;
    AttribLocations: {
        position: number,
        color: number
    };
    UniformLoactions: {
        modelViewMatrix: WebGLUniformLocation
    };

    constructor(context: WebGLRenderingContext) {
        this.Context = context;
    }

    InitShaderProgramm(vsSource: string, fsSource: string) {
        const vertexShader = this.LoadShader(this.Context.VERTEX_SHADER, vsSource);
        const fragmentShader = this.LoadShader(this.Context.FRAGMENT_SHADER, fsSource);

        const shaderProgram = this.Context.createProgram();
        if (!shaderProgram || !vertexShader || !fragmentShader) {
            alert("Something went wrong setting up the shader program.");
            return;
        }
        this.Context.attachShader(shaderProgram, vertexShader);
        this.Context.attachShader(shaderProgram, fragmentShader);
        this.Context.linkProgram(shaderProgram);

        if (!this.Context.getProgramParameter(shaderProgram, this.Context.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.Context.getProgramInfoLog(shaderProgram));
            return null;
        }
        this.ShaderProgramm = shaderProgram;
        return shaderProgram;
    }

    InitLocations(context: WebGLRenderingContext) { 
        this.AttribLocations = {
            position: this.Context.getAttribLocation(this.ShaderProgramm, 'aVertexPosition'),
            color: this.Context.getAttribLocation(this.ShaderProgramm, 'aVertexColor')
        }
        
        context.enableVertexAttribArray(this.AttribLocations.position);

        context.enableVertexAttribArray(this.AttribLocations.color);

        let modelViewMatrix = this.Context.getUniformLocation(this.ShaderProgramm, 'uModelViewProjectionMatrix');

        if (!modelViewMatrix) {
            alert('Unable to initialize uniform locations: ' + this.Context.getProgramInfoLog(this.ShaderProgramm));
            return null;
        }
        this.UniformLoactions = {
            modelViewMatrix: modelViewMatrix
        }
    }

    LoadShader(type: number, source: string) {
        const shader = this.Context.createShader(type);
        if (!shader) {
            alert("Sorry webGL is not supported.");
            return;
        }
        this.Context.shaderSource(shader, source);
        this.Context.compileShader(shader);

        if (!this.Context.getShaderParameter(shader, this.Context.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.Context.getShaderInfoLog(shader));
            this.Context.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static CreateStandard(context: WebGLRenderingContext) {
        const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;

            uniform mat4 uModelViewProjectionMatrix;

            varying lowp vec4 vColor;

            void main(void) {
            gl_Position = uModelViewProjectionMatrix * aVertexPosition;
            vColor = aVertexColor;
            }
        `;

        const fsSource = `
            varying lowp vec4 vColor;

            void main(void) {
            gl_FragColor = vColor;
            }
        `;

        let shader = new Shader(context);
        shader.InitShaderProgramm(vsSource, fsSource);
        shader.InitLocations(context);
        return shader;
    }
}
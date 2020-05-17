import { Vector } from "./class.vector";
import { Shader } from "./class.webglshader";
import { RubiksCube } from "./class.rubiks-cube";
import { Model } from "./class.model";
import { Matrix4D } from "./class.matrix";

const main = () => {
  const canvas = document.createElement('canvas');
  canvas.height = 500;
  canvas.width = 500;
  document.body.appendChild(canvas);

  let context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!context || !(context instanceof WebGLRenderingContext)) {
    alert("Sorry webGL is not supported.");
    return;
  }
  let shader = Shader.CreateStandard(context);

  let model = Model.Cube(shader);
  model.BuildBuffers(context);
  model.Rotation.Entries[0] = 1;
  // model.Rotation.Entries[0] = 0.5;

  let model2 = Model.Cube(shader);
  model2.BuildBuffers(context);
  // model2.Rotation.Entries[1] = 0.5;
  // model2.Rotation.Entries[0] = 0.5;

  model2.Position[0] = 0.2;
  model2.Position[2] = 4;

  model.Position[0] = 0
  model.Position[1] = 0;
  model.Position[2] = 0.05;

  const fieldOfView = 60 * Math.PI / 180;   // in radians
  const aspect = context.canvas.clientWidth / context.canvas.clientHeight;
  const zNear = 1;
  const zFar = 1000;

  const projectionMatrix = Matrix4D.Perspective(fieldOfView, aspect, zNear, zFar);
  const cameraMatrix = Matrix4D.LookAt(new Vector(0, 0, 200), new Vector(0, 0, 0), new Vector(0, 1, 0));
  const modelViewMatrix = projectionMatrix.Multiply4D(cameraMatrix.Inverse());
  console.log(cameraMatrix.Entries);
  console.log(cameraMatrix.Inverse().Entries);
  console.log(modelViewMatrix.Entries)
  // const projectionMatrix = new Matrix4D();

  let render = () => {
    if (!context || !(context instanceof WebGLRenderingContext)) return alert("Sorry webGL is not supported.");
    context.clearColor(0.5, 0.5, 0.5, 1.0);  // Clear to black, fully opaque
    context.clearDepth(1.0);  // Clear everything
    context.enable(context.DEPTH_TEST);           // Enable depth testing
    context.depthFunc(context.LEQUAL);                   // Near things obscure far things

    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    model.Rotation.Entries[1] += 0.05;
    // model2.Rotation.Entries[0] -= 0.05;

    // model2.DrawModel(context, projectionMatrix, cameraMatrix)
    model.DrawModel(context, projectionMatrix, cameraMatrix);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  //--------------------------------------------------------

  // let cube = new RubiksCube();
  // cube.Create();
  // cube.InitModels(context, shader);
  // context.enable(context.DEPTH_TEST);           // Enable depth testing
  // context.depthFunc(context.LEQUAL);            // Near things obscure far things
  // const render = () => {
  //   if (context === null || !(context instanceof WebGLRenderingContext)) return;
  //   context.clearColor(0.2, 0.2, 0.2, 1.0);  // Clear to black, fully opaque
  //   context.clearDepth(1.0);       // Clear everything

  //   // Clear the contextnvas before we start drawing on it.

  //   context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
  //   cube.Draw(context as WebGLRenderingContext);
  //   requestAnimationFrame(render);
  // }
  // requestAnimationFrame(render);
}

main();

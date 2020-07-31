import { Injectable } from "@angular/core";

import * as BABYLON from "babylonjs";
import { CameraType } from "../enums/camera/camera-type";
import { BbScriptAxis } from "../enums/axis";
import { LightType } from "../enums/light/light-type";
import Mesh = BABYLON.Mesh;
import Camera = BABYLON.Camera;
import Light = BABYLON.Light;
import PointLight = BABYLON.PointLight;
import SpotLight = BABYLON.SpotLight;
import Color3 = BABYLON.Color3;
import StandardMaterial = BABYLON.StandardMaterial;
import { CodeBlock } from "../interfaces/code/block";
import { BbScriptLight } from "../classes/in-game/3d/light";
import { BbScriptEntity } from "../classes/in-game/3d/entity";

@Injectable({
  providedIn: "root",
})
export class BabylonJSService {
  private screenWidth: number;
  private screenHeight: number;

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;

  //TODO remove camera and light later
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  private wireFrame: boolean;
  private antiAlias: boolean;

  constructor() {
    this.screenWidth = 0;
    this.screenHeight = 0;

    this.wireFrame = false;
    this.antiAlias = true;
  }

  defaultMaterial(): StandardMaterial {
    let material: StandardMaterial = new BABYLON.StandardMaterial(
      "1",
      this._scene
    );
    let white = new BABYLON.Color3(1, 1, 1);
    material.diffuseColor = BABYLON.Color3.Red();
    material.specularColor = white;
    material.emissiveColor = white;
    material.ambientColor = white;
    /*if(BBScript.game.wireFrame) {
          material.wireframe = true;
        }*/
    return material;
  }

  async initEngine(canvas: HTMLElement) {
    // Create canvas3d and engine.
    this._canvas = canvas as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  async createScene(): Promise<void> {
    // Create a basic BJS Scene object.
    this._scene = new BABYLON.Scene(this._engine);

    // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
    //this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this._scene);

    // Target the camera to scene origin.
    //this._camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas3d.
    //this._camera.attachControl(this._canvas, false);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    //this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

    // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
    /*let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
          {segments: 16, diameter: 2}, this._scene);*/

    // Move the sphere upward 1/2 of its height.
    //sphere.position.z = 10;
    //sphere.position.y = 1;

    // Create a built-in "ground" shape.
    /*let ground = BABYLON.MeshBuilder.CreateGround('ground1',
          {width: 6, height: 6, subdivisions: 2}, this._scene);*/
  }

  async mainLoop(statements: CodeBlock[]): Promise<void> {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();

      // TODO: execute all code blocks sequentially
    });
  }

  async initGraphics(width: number, height: number): Promise<void> {
    this.screenWidth = width;
    this.screenHeight = height;

    this._canvas.style.width = width + "px";
    this._canvas.style.height = height + "px";

    this._engine = new BABYLON.Engine(this._canvas, true);

    //this._canvas.style.width = '100%';
    //this._canvas.style.height = '100%';
  }

  async setClearColor(red: number, green: number, blue: number): Promise<void> {
    this._scene.clearColor = new BABYLON.Color4(red, green, blue, 1);
  }

  async setFogColor(red: number, green: number, blue: number): Promise<void> {
    this._scene.fogColor = new BABYLON.Color3(red, green, blue);
  }

  /* CAMERA */
  async createCamera(type: CameraType): Promise<BABYLON.Camera> {
    let camera: BABYLON.Camera;

    switch (type) {
      //TODO anaglyph needs another type in combination
      case CameraType.ANAGLYPH:
        break;
      case CameraType.ARC_ROTATE:
        //TODO add many more parameters
        //return new BABYLON.ArcRotateCamera(id('cam'), );
        break;
      case CameraType.FOLLOW:
        break;
      case CameraType.FREE:
        camera = new BABYLON.FreeCamera(
          "1",
          new BABYLON.Vector3(0, 0, 0),
          this._scene,
          true
        );
        break;
      case CameraType.UNIVERSAL:
        break;
      case CameraType.WEB_VR:
        break;
      default:
        console.error("Error at CreateCamera: invalid camera type", type);
        break;
    }

    return camera;
  }

  /* MESHES */
  async addMesh(source: any, target: any): Promise<void> {}

  async copyMesh() {}

  async createCone(
    segments?: number,
    hasFloor?: boolean
  ): Promise<BbScriptEntity> {
    //TODO implement segments and hasFloor
    let cone: Mesh = BABYLON.MeshBuilder.CreateCylinder(
      "1",
      { diameterTop: 0, tessellation: 32 },
      this._scene
    );
    cone.material = this.defaultMaterial();

    return null;
    // return cone;
  }

  async createSphere(segments: number): Promise<Mesh> {
    let sphere: Mesh = BABYLON.MeshBuilder.CreateSphere("1", {}, this._scene);
    sphere.material = this.defaultMaterial();
    return sphere;
  }

  async createCube(): Promise<Mesh> {
    let cube: Mesh = BABYLON.MeshBuilder.CreateBox("1", {}, this._scene);
    cube.material = this.defaultMaterial();
    return cube;
  }

  async createCylinder(segments, hasFloor): Promise<Mesh> {
    let cylinder: Mesh = BABYLON.MeshBuilder.CreateCylinder(
      "1",
      { diameterTop: 4, diameterBottom: 4, tessellation: 32 },
      this._scene
    );
    cylinder.material = this.defaultMaterial();
    return cylinder;
  }

  async createPyramid(baseVertexNumber: number): Promise<Mesh> {
    let meshType;

    switch (baseVertexNumber) {
      case 3:
        meshType = 0;
        break;
      case 4:
        meshType = 8;
        break;
      case 5:
        meshType = 9;
        break;
      default:
        console.error(
          "The number of base vertices for a pyramid is not allowed:",
          baseVertexNumber
        );
        return;
    }

    let pyramid: Mesh = BABYLON.MeshBuilder.CreatePolyhedron(
      "1",
      { type: 1, size: 1 },
      this._scene
    );
    pyramid.material = this.defaultMaterial();
    return pyramid;
  }

  //TODO add parameter(s) how smooth the torus should be
  async createTorus(): Promise<Mesh> {
    let torus: Mesh = BABYLON.MeshBuilder.CreateTorus("1", {}, this._scene);
    torus.material = this.defaultMaterial();
    return torus;
  }

  async createTorusKnot(): Promise<Mesh> {
    let torusKnot: Mesh = BABYLON.MeshBuilder.CreateTorusKnot(
      "tk",
      {},
      this._scene
    );
    torusKnot.material = this.defaultMaterial();
    return torusKnot;
  }

  async fitMesh() {}

  async flipMesh(mesh) {
    console.info("flip mesh", mesh);
    //TODO negative scaling does not work, try to invert all normals / vertices
  }

  async loadAnimMesh() {}

  async loadMesh(filePath, parent) {
    //TODO find out if this method is still up to date and if so, how to use it exactly
    //BABYLON.SceneLoader.ImportMesh();
    let mesh;

    if (parent) {
      mesh.parent = parent;
    }
  }

  async meshCullBox() {}

  async meshDepth() {}

  async meshHeight() {}

  async meshWidth() {}

  async positionMesh(
    entity: Mesh | Camera,
    x: number,
    y: number,
    z: number,
    parentCoordinates?: boolean
  ): Promise<void> {
    console.info("Entity:", entity);

    //TODO regard parent coordinates
    entity.position = new BABYLON.Vector3(x, y, z);
    console.info("New position of entity:", x, y, z);
  }

  async scaleMesh(
    entity: any,
    x: number,
    y: number,
    z: number,
    parentScale?: boolean
  ): Promise<void> {
    entity.scaling = new BABYLON.Vector3(x, y, z);
  }

  /* ENTITIES */
  async moveEntity(
    entity: any,
    x: number,
    y: number,
    z: number
  ): Promise<void> {
    entity.movePOV(-x, -y, -z);
  }

  async rotateEntity(
    entity: Mesh | Camera,
    pitch: number,
    yaw: number,
    roll: number,
    parentCoordinates?: boolean
  ): Promise<void> {
    //Pi = 180°
    //TODO regard parent coordinates
    if (entity instanceof Mesh) {
      entity.rotation = new BABYLON.Vector3(
        Math.PI * (pitch / 180),
        Math.PI * (yaw / 180),
        Math.PI * (roll / 180)
      );
    } else {
      //TODO
    }
  }

  async translateEntity(
    entity: any,
    x: number,
    y: number,
    z: number,
    parentAngle?: boolean
  ): Promise<void> {
    entity.translate(BABYLON.Axis.X, x, BABYLON.Space.LOCAL);
    entity.translate(BABYLON.Axis.Y, y, BABYLON.Space.LOCAL);
    entity.translate(BABYLON.Axis.Z, z, BABYLON.Space.LOCAL);
  }

  async turnEntity(
    entity: any,
    pitch: number,
    yaw: number,
    roll: number,
    parentAngle?: boolean
  ): Promise<void> {
    //TODO implement global
    entity.addRotation(pitch, yaw, roll);
  }

  async alignToVector(
    entity: any,
    x: number,
    y: number,
    z: number,
    axis: BbScriptAxis,
    tween: number
  ): Promise<void> {
    //TODO test if this is the correct behaviour
    //TODO in this implementation, tween would be deprecated
    let upDirection;
    switch (axis) {
      case 1: //x
        upDirection = new BABYLON.Vector3(1, 0, 0);
        break;
      case 2: //y
        upDirection = new BABYLON.Vector3(0, 1, 0);
        break;
      case 3: //z
        upDirection = new BABYLON.Vector3(0, 0, 1);
        break;
    }
    entity.alignWithNormal(new BABYLON.Vector3(x, y, z), upDirection);
  }

  async pointEntity(
    sourceEntity: any,
    targetEntity: any,
    roll: number
  ): Promise<void> {
    //TODO implementation
  }

  async colorMesh(
    mesh: Mesh,
    red: number,
    green: number,
    blue: number
  ): Promise<void> {
    //mesh.material.ambientColor = new BABYLON.Color3(Math.trunc(red) / 255, Math.trunc(green) / 255, Math.trunc(blue) / 255);
  }

  /** LIGHT **/
  async ambientLight(red: number, green: number, blue: number): Promise<void> {
    //TODO implementation not working
    this._scene.ambientColor = new BABYLON.Color3(
      Math.trunc(red) / 255,
      Math.trunc(green) / 255,
      Math.trunc(blue) / 255
    );
  }

  async createLight(type: LightType): Promise<BbScriptLight> {
    let light: Light;

    if (!type) {
      type = LightType.DIRECTIONAL;
    }

    switch (type) {
      case LightType.DIRECTIONAL:
        light = new BABYLON.DirectionalLight(
          "1",
          new BABYLON.Vector3(0, 0, 0),
          this._scene
        );
        break;
      case LightType.POINT:
        light = new BABYLON.PointLight(
          "1",
          new BABYLON.Vector3(0, 0, 0),
          this._scene
        );
        break;
      case LightType.SPOT:
        light = new BABYLON.SpotLight(
          "1",
          new BABYLON.Vector3(0, 0, 0),
          new BABYLON.Vector3(0, 0, 0),
          Math.PI / 3,
          2,
          this._scene
        );
        break;
      case LightType.HEMISPHERIC:
        light = new BABYLON.HemisphericLight(
          "1",
          new BABYLON.Vector3(0, 0, 0),
          this._scene
        );
        break;
      default:
        console.error("Error in CreateLight: Invalid light type!");
        light = null;
    }

    return null;
    // return light;
  }

  async lightColor(
    light: Light,
    red: number,
    green: number,
    blue: number
  ): Promise<void> {
    light.diffuse = new Color3(
      Math.trunc(red) / 255,
      Math.trunc(green) / 255,
      Math.trunc(blue) / 255
    );
  }

  async lightRange(light: Light, range: number): Promise<void> {
    if (light instanceof PointLight || light instanceof SpotLight) {
      light.range = range;
    } else {
      console.warn("Light range can only be applied to point or spot lights");
    }
  }
}

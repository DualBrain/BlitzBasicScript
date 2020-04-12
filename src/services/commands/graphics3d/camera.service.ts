import { BabylonJSService } from '../../babylon-js.service';
import { Subscriber, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameEntity } from '../../../interfaces/game/entity';
import { CameraType } from '../../../enums/camera/camera-type';
import { Camera } from 'babylonjs';

@Injectable()
export class CommandsGraphics3dCameraService {
  constructor(private babylonjs: BabylonJSService) {}

  /** PRIVATE **/
  private normalize(value: number): number {
    return value / Math.trunc(255);
  }

  /** PUBLIC **/
  async cameraClsColor(camera: any, red: number, green: number, blue: number): Promise<void> {
    return this.babylonjs.setClearColor(this.normalize(red), this.normalize(green), this.normalize(blue));
  }

  async cameraClsMode(camera: any, deleteColorBuffer?: boolean, deleteZBuffer?: boolean) {
    // TODO
  }

  async fogColor(red: number, green: number, blue: number): Promise<void> {
    return this.babylonjs.setFogColor(this.normalize(red), this.normalize(green), this.normalize(blue));
  }

  async fogMode(mode): Promise<void> {
    // TODO
    /*switch (mode) {
      case BBScript.FOG.NONE:
        BBScript.game.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        break;
      case BBScript.FOG.LINEAR:
        BBScript.game.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        break;
      case BBScript.FOG.EXPONENTIAL:
        BBScript.game.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        break;
      case BBScript.FOG.EXPONENTIAL_ENHANCED:
        BBScript.game.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        break;
    }*/
  }

  async fogRange(near: number, far: number): Promise<void> {
    /*if (BBScript.game.scene.fogMode === BABYLON.Scene.FOGMODE_LINEAR) {
      BBScript.game.scene.fogStart = near;
      BBScript.game.scene.fogEnd = far;
    } else {
      console.warn('[FogRange]: Invalid fog mode (must be linear)');
    }*/
  }

  async fogDensity(value: number): Promise<void> {
    /*if (BBScript.game.scene.fogMode === BABYLON.Scene.FOGMODE_EXP || BBScript.game.scene.fogMode === BABYLON.Scene.FOGMODE_EXP2) {
      BBScript.game.scene.fogDensity = value;
    } else {
      console.warn('[FogDensity]: Invalid fog mode (must be exponential)');
    }*/
  }

  async cameraProject(camera: any, x: number, y: number, z: number): Promise<void> {}

  async cameraProjMode(camera: any, mode: number): Promise<void> {
    /*switch (mode) {
      case BBScript.CAMERA_PROJECTION.NONE:
        camera.setEnabled(false);
        break;
      case BBScript.CAMERA_PROJECTION.PERSPECTIVE:
        camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        break;
      case BBScript.CAMERA_PROJECTION.ORTHOGRAPHIC:
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        break;
    }*/
  }

  async cameraRange(camera: any, near: number, far: number): Promise<void> {
    camera.minZ = near;
    camera.maxZ = far;
  }

  async cameraViewport(camera: any, x: number, y: number, width: number, height: number): Promise<void> {}

  async cameraZoom(camera: any, value: number): Promise<void> {
    // TODO fix (code below does not seem to work)
    // camera.zoomOnFactor = value;
  }

  async createCamera(type: CameraType, parent?: GameEntity): Promise<GameEntity> {
    return this.babylonjs.createCamera(type).then((camera: Camera) => {
      const cameraEntity: GameEntity = {
        name: 'TODO',
        class: 'Camera',
        parent: parent ? parent : null,
        camera: camera
      };

      return cameraEntity;
    });
  }

  async projectedX(): Promise<number> {
    return 0;
  }

  async projectedY(): Promise<number> {
    return 0;
  }

  async projectedZ(): Promise<boolean> {
    return false;
  }
}

import {Injectable} from '@angular/core';
import {BabylonJSService} from '../../babylon-js/babylon-js.service';
import {concat, Observable, of} from 'rxjs';
import {Graphics2dService} from '../../2d/graphics2d.service';
import {GameStateService} from '../../game-state/game-state.service';

@Injectable()
export class CommandsGraphics2dDisplay {
  constructor(private babylonjs: BabylonJSService,
              private graphics2d: Graphics2dService,
              private gameState: GameStateService
  ) {

  }

  endGraphics() {

  }

  gfxDriverName() {

  }

  gfxModeDepth(): Observable<number> {
    return of(32);
  }

  gfxModeExists(): Observable<boolean> {
    return of(true);
  }

  graphics(width: number, height: number): Observable<void> {
    this.gameState.setScreenWidth(width);
    this.gameState.setScreenHeight(height);
    this.gameState.setScreenViewport({
      beginX: 0,
      beginY: 0,
      width: width,
      height: height
    });

    return concat(
      this.babylonjs.initGraphics(width, height),
      this.graphics2d.initGraphics(width, height)
    );
  }

  graphicsDepth(): Observable<number> {
    return of(32);
  }

  graphicsHeight(): Observable<number> {
    return of(this.gameState.getScreenProperties().height);
  }

  graphicsWidth(): Observable<number> {
    return of(this.gameState.getScreenProperties().width);
  }
}

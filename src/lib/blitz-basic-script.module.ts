import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BlitzBasicScriptComponent} from './blitz-basic-script.component';
import {CommandsBasicsDiverseService} from '../services/commands/basics/diverse.service';
import {CommandsBasicsMathsService} from '../services/commands/basics/maths.service';
import {CommandsBasicsStringsService} from '../services/commands/basics/strings.service';
import {CommandsBasicsTimeRandomService} from '../services/commands/basics/time-random.service';
import {GeneralService} from '../services/general.service';
import {GameStateService} from '../services/game-state.service';
import {BabylonJSService} from '../services/babylon-js.service';
import {CommandsGraphics2dDisplayService} from '../services/commands/graphics2d/display.service';
import {CommandsGraphics2dGraphicsService} from '../services/commands/graphics2d/graphics.service';
import {CommandsGraphics3dCameraService} from '../services/commands/graphics3d/camera.service';
import {CommandsGraphics3dMeshesService} from '../services/commands/graphics3d/meshes.service';
import {CommandsGraphics3dCoordinatesService} from '../services/commands/graphics3d/coordinates.service';
import {GuiService} from '../services/gui.service';
import {CommonModule} from '@angular/common';
import {CommandsGraphics2dPixelService} from '../services/commands/graphics2d/pixel.service';
import {CommandsGraphics2dImagesService} from '../services/commands/graphics2d/images.service';
import {DebugEnvironment} from '../environment/debug.environment';
import {CommandsGraphics3dLightShadowService} from '../services/commands/graphics3d/light-shadow.service';
import {CommandsSoundMusicSamplesService} from '../services/commands/sound/music-samples.service';
import {CommandsGraphics2dTextService} from '../services/commands/graphics2d/text.service';
import {BlitzBasicScriptButtonModule} from '../components/button/button.module';
import {BlitzBasicScriptCanvasModule} from '../components/canvas/canvas.module';
import {BlitzBasicScriptComboBoxModule} from '../components/combo-box/combo-box.module';
import {BlitzBasicScriptHtmlModule} from '../components/html/html.module';
import {BlitzBasicScriptListBoxModule} from '../components/list-box/list-box.module';
import {BlitzBasicScriptMenuModule} from '../components/menu/menu.module';
import {BlitzBasicScriptPanelModule} from '../components/panel/panel.module';
import {BlitzBasicScriptProgressBarModule} from '../components/progress-bar/progress-bar.module';
import {LanguageService} from '../services/language.service';
import {LexerService} from '../services/lexer.service';
import {ParserService} from '../services/parser.service';
import {CommandsGraphics3dControlsService} from '../services/commands/graphics3d/controls.service';
import {CommandsDataBankService} from '../services/commands/data/bank.service';
import {CommandsGraphics2dMoviesService} from '../services/commands/graphics2d/movies.service';
import {CommandsGraphics3dAnimationsService} from '../services/commands/graphics3d/animations.service';
import {CommandsGraphics3dBrushesService} from '../services/commands/graphics3d/brushes.service';
import {CommandsGraphics3dCollisionsService} from '../services/commands/graphics3d/collisions.service';
import {CommandsGraphics3dDiverseService} from '../services/commands/graphics3d/diverse.service';
import {CommandsGraphics3dPickingService} from '../services/commands/graphics3d/picking.service';
import {CommandsGraphics3dSceneService} from '../services/commands/graphics3d/scene.service';
import {CommandsGraphics3dSceneryService} from '../services/commands/graphics3d/scenery.service';
import {CommandsGraphics3dScreenService} from '../services/commands/graphics3d/screen.service';
import {CommandsGraphics3dSpritesService} from '../services/commands/graphics3d/sprites.service';
import {CommandsGraphics3dStatusService} from '../services/commands/graphics3d/status.service';
import {CommandsGuiProgressBarService} from '../services/commands/gui/progress-bar.service';
import {CommandsGuiRequestService} from '../services/commands/gui/request.service';
import {CommandsGuiSliderService} from '../services/commands/gui/slider.service';
import {CommandsGuiTextAreaService} from '../services/commands/gui/text-area.service';
import {CommandsGuiTextFieldService} from '../services/commands/gui/text-field.service';
import {CommandsGuiToolbarService} from '../services/commands/gui/toolbar.service';
import {CommandsGuiTreeViewService} from '../services/commands/gui/tree-view.service';
import {CommandsGuiWindowService} from '../services/commands/gui/window.service';
import {CommandsIOGamepadService} from '../services/commands/io/gamepad.service';
import {CommandsIOKeyboardService} from '../services/commands/io/keyboard.service';
import {CommandsIOMouseService} from '../services/commands/io/mouse.service';
import {CommandsSound3DService} from '../services/commands/sound/3d.service';
import {CommandsSoundChannelsService} from '../services/commands/sound/channels.service';
import { CommandsDataFileSystemService } from '../services/commands/data/file-system.service';
import { CommandsGraphics3dSurfacesService } from '../services/commands/graphics3d/surfaces.service';
import { CommandsGraphics3dTerrainService } from '../services/commands/graphics3d/terrain.service';
import { CommandsGraphics3dTexturesService } from '../services/commands/graphics3d/textures.service';
import { CommandsGuiButtonService } from '../services/commands/gui/button.service';
import { CommandsGuiCanvasService } from '../services/commands/gui/canvas.service';
import { CommandsGuiDesktopService } from '../services/commands/gui/desktop.service';
import { CommandsGuiDiverseService } from '../services/commands/gui/diverse.service';
import { CommandsGuiEventService } from '../services/commands/gui/event.service';
import { CommandsGuiGadgetService } from '../services/commands/gui/gadget.service';
import { CommandsGuiHtmlService } from '../services/commands/gui/html.service';
import { CommandsGuiIconStripService } from '../services/commands/gui/icon-strip.service';
import { CommandsGuiListTabberService } from '../services/commands/gui/list-tabber.service';
import { CommandsGuiMenuService } from '../services/commands/gui/menu.service';
import { CommandsGuiPanelService } from '../services/commands/gui/panel.service';
import { Render2dService } from '../services/render2d.service';

@NgModule({
    declarations: [
        BlitzBasicScriptComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,

        BlitzBasicScriptButtonModule,
        BlitzBasicScriptCanvasModule,
        BlitzBasicScriptComboBoxModule,
        BlitzBasicScriptHtmlModule,
        BlitzBasicScriptListBoxModule,
        BlitzBasicScriptMenuModule,
        BlitzBasicScriptPanelModule,
        BlitzBasicScriptProgressBarModule

    ],
    exports: [
        BlitzBasicScriptComponent
    ],
    providers: [
        DebugEnvironment,

        GeneralService,
        LanguageService,
        LexerService,
        ParserService,

        GameStateService,
        BabylonJSService,
        Render2dService,
        GuiService,

        // BASICS
        CommandsBasicsDiverseService,
        CommandsBasicsMathsService,
        CommandsBasicsStringsService,
        CommandsBasicsTimeRandomService,

        // DATA
        CommandsDataBankService,
        CommandsDataFileSystemService,

        // GRAPHICS 2D
        CommandsGraphics2dDisplayService,
        CommandsGraphics2dGraphicsService,
        CommandsGraphics2dImagesService,
        CommandsGraphics2dMoviesService,
        CommandsGraphics2dPixelService,
        CommandsGraphics2dTextService,

        // GRAPHICS 3D
        CommandsGraphics3dAnimationsService,
        CommandsGraphics3dBrushesService,
        CommandsGraphics3dCameraService,
        CommandsGraphics3dCollisionsService,
        CommandsGraphics3dControlsService,
        CommandsGraphics3dCoordinatesService,
        CommandsGraphics3dDiverseService,
        CommandsGraphics3dLightShadowService,
        CommandsGraphics3dMeshesService,
        CommandsGraphics3dPickingService,
        CommandsGraphics3dSceneService,
        CommandsGraphics3dSceneryService,
        CommandsGraphics3dScreenService,
        CommandsGraphics3dSpritesService,
        CommandsGraphics3dStatusService,
        CommandsGraphics3dSurfacesService,
        CommandsGraphics3dTerrainService,
        CommandsGraphics3dTexturesService,

        // GUI
        CommandsGuiButtonService,
        CommandsGuiCanvasService,
        CommandsGuiDesktopService,
        CommandsGuiDiverseService,
        CommandsGuiEventService,
        CommandsGuiGadgetService,
        CommandsGuiHtmlService,
        CommandsGuiIconStripService,
        CommandsGuiListTabberService,
        CommandsGuiMenuService,
        CommandsGuiPanelService,
        CommandsGuiProgressBarService,
        CommandsGuiRequestService,
        CommandsGuiSliderService,
        CommandsGuiTextAreaService,
        CommandsGuiTextFieldService,
        CommandsGuiToolbarService,
        CommandsGuiTreeViewService,
        CommandsGuiWindowService,

        // IO
        CommandsIOGamepadService,
        CommandsIOKeyboardService,
        CommandsIOMouseService,

        // SOUND
        CommandsSound3DService,
        CommandsSoundChannelsService,
        CommandsSoundMusicSamplesService
    ]
})

export class BlitzBasicScriptModule {
}

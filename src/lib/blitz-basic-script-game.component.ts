import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { LexerService } from '../services/lexer.service';
import { ParserService } from '../services/parser.service';
import { AbstractSyntax } from '../interfaces/abstract-syntax';
import { GameStateService, ScreenProperties } from '../services/game-state.service';
import { BabylonJSService } from '../services/babylon-js.service';
import { GuiService } from '../services/gui.service';
import { LanguageService } from '../services/language.service';
import { Render2dService } from '../services/render2d.service';
import { LexerToken } from '../interfaces/lexer-token';
import { CommandStatement } from '../classes/command-statement';
import { CodeBlock } from '../interfaces/code/block';
import { InterpreterService } from '../services/interpreter.service';
import { StringExpression } from '../classes/expressions/string-expression';
import { Assignment } from '../classes/assignment';
import { NumericExpression } from '../classes/expressions/numerical-expression';
import { VariableExpression } from '../classes/expressions/variable-expression';
import { ArithmeticExpression } from '../classes/expressions/arithmetic-expression';
import { KeyCode } from '../enums/events/key-codes';
import { MouseCode } from '../enums/events/mouse-codes';
import { GeneralService } from '../services/general.service';
import { WhileLoop } from '../classes/loops/while-loop';
import { LogicalExpression } from '../classes/expressions/logical-expression';

@Component({
  selector: 'blitz-basic-script-game',
  templateUrl: 'blitz-basic-script-game.html',
  styleUrls: ['blitz-basic-script-game.scss']
})
export class BlitzBasicScriptComponent implements OnInit, AfterViewInit {
  @Input('icon') iconPath?: string;
  @Input() code: string[];
  @Input() debugMode?: boolean;
  @Input() title?: string;

  @ViewChild('canvas2d') canvas2d: ElementRef;
  @ViewChild('canvas3d') canvas3d: ElementRef;
  public canvasFocused: boolean;
  public screen: ScreenProperties;

  public playing: boolean;

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    // console.info('[KEY DOWN]', event);
    this.gameState.setKeyDown(KeyCode[this.general.formatUpper(event.code)], true);
    this.gameState.setKeyAsciiCode(event.key.charCodeAt(0));
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    this.gameState.incrementKeyHit(KeyCode[event.code]);
  }

  @HostListener('window:mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    // console.info('[MOUSE DOWN]', event);
    switch (event.which) {
      case 1:
        this.gameState.setMouseDown(MouseCode.LEFT, true);
        break;
      case 2:
        this.gameState.setMouseDown(MouseCode.MIDDLE, true);
        break;
      case 3:
        this.gameState.setMouseDown(MouseCode.RIGHT, true);
        break;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseUpEvent(event: MouseEvent) {
    // this.gameState.incrementMouseHit(MouseCode[event.button]);
  }

  constructor(
    private language: LanguageService,
    private lexer: LexerService,
    private parser: ParserService,
    private gameState: GameStateService,
    private babylonjs: BabylonJSService,
    private render2d: Render2dService,
    private gui: GuiService,
    private interpreter: InterpreterService,
    private general: GeneralService
  ) {
    this.canvasFocused = false;
    this.playing = false;

    this.screen = this.gameState.getScreenProperties(); // TODO: event mechanism to reflect changes
  }

  ngOnInit(): void {
    if (this.title === undefined) {
      this.title = 'BlitzBasicScript Game';
    }
  }

  ngAfterViewInit(): void {
    this.play();
  }

  testInterpreter(): void {
    this.playing = true;

    // initialize BabylonJS Engine
    this.babylonjs.initEngine(this.canvas3d.nativeElement);

    // create the scene
    this.babylonjs.createScene();

    // initialize 2D Service
    this.render2d.initCanvas(this.canvas2d.nativeElement);

    const codeBlocks: CodeBlock[] = [
      new WhileLoop(new LogicalExpression([], []), [])

      // new Assignment('global', 'cone', new CommandStatement('CreateCone', []))
      // new Assignment(
      //   'global',
      //   'result',
      //   new ArithmeticExpression(
      //     [
      //       new NumericExpression(13),
      //       new NumericExpression(15),
      //       new NumericExpression(Math.PI),
      //       new NumericExpression(8)
      //     ],
      //     ['+', '-', '/']
      //   )
      // ),
      // new Assignment('global', 'answerOnEverything', new NumericExpression(42)),
      // new CommandStatement('DebugLog', [new VariableExpression('global', 'answerOnEverything')]),
      // new Assignment(
      //   'global',
      //   'image',
      //   new CommandStatement('LoadImage', [new StringExpression('/assets/gfx/blitz.png')])
      // ),
      // new CommandStatement('DrawImage', [
      //   new VariableExpression('global', 'image'),
      //   new NumericExpression(50),
      //   new NumericExpression(50)
      // ]),
      // new CommandStatement('Color', [
      //   new NumericExpression(255),
      //   new NumericExpression(255),
      //   new NumericExpression(255)
      // ]),
      // new CommandStatement('Rect', [
      //   new NumericExpression(75),
      //   new NumericExpression(75),
      //   new NumericExpression(150),
      //   new NumericExpression(150)
      // ])
    ];

    this.interpreter.initializeAbstractSyntax({
      globals: {},
      codeBlocks: codeBlocks,
      mainLoop: [],
      functions: [],
      types: {}
    });
    this.interpreter.run();
  }

  play(): void {
    this.playing = true;

    // initialize BabylonJS Engine
    this.babylonjs.initEngine(this.canvas3d.nativeElement);

    // create the scene
    this.babylonjs.createScene();

    // initialize 2D Service
    this.render2d.initCanvas(this.canvas2d.nativeElement);
    // console.info('initCanvas executed');

    // TODO: only if this would be necessary
    // initialize GUI Service
    // this.gui.initCanvas(this.canvas3d.nativeElement);

    // lex, parse and initialize abstract syntax
    const tokens: LexerToken[][] = this.lexer.lexCode(this.code);
    const abstractSyntax: AbstractSyntax = this.parser.createAbstractSyntax(tokens);
    this.interpreter.initializeAbstractSyntax(abstractSyntax);
    this.interpreter.run();
  }

  debug(): void {
    console.warn('Debug mode has not been implemented yet.');
  }

  stop(): void {
    this.playing = false;
  }
}

import { LexerToken } from '../../interfaces/lexer-token';
import { LexerTokenCategory } from '../../enums/lexer/lexer-token-category';
import { Injectable } from '@angular/core';
import { BBScriptCode } from '../../interfaces/bbscript-code';
import { GeneralService } from '../general/general.service';
import { GameStateService } from '../game-state/game-state.service';
import { ParserState } from '../../enums/parser/parser-state';
import { LanguageService } from '../language/language.service';
import { ApiCommand } from '../../interfaces/api/api-command';
import { Observable, of } from 'rxjs';
import { CameraType } from '../../enums/camera/camera-type';
import { GameEntity } from '../../interfaces/game/entity';
import { GameImage2D } from '../../interfaces/game/image-2d';
import { GameFont } from '../../interfaces/game/font';
import { Camera, Light } from 'babylonjs';
import { CommandsBasicsService } from '../commands/basics.service';
import { CommandsDataService } from '../commands/data.service';
import { CommandsGraphics2DService } from '../commands/graphics2d.service';
import { CommandsGraphics3DService } from '../commands/graphics3d.service';
import { CommandsGUIService } from '../commands/gui.service';
import { CommandsIOService } from '../commands/io.service';
import { CommandsSoundService } from '../commands/sound.service';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  static MESSAGE = {
    'ERROR': {
      'DEPRECATED_KEYWORD': {
        EN: 'Deprecated key word',
        DE: 'Veraltetes Schlüsselwort'
      },
      'DEPRECATED_COMMAND': {
        EN: 'Deprecated command',
        DE: 'Veralteter Befehl'
      },
      'INVALID_TOKEN': {
        EN: 'Invalid token',
        DE: 'Ungültiges Token'
      },
      'INVALID_START_TOKEN': {
        EN: 'Invalid start token',
        DE: 'Ungültiges Anfangstoken'
      },
      'ILLEGAL_CONTEXT': {
        EN: 'Illegal token context',
        DE: 'Ungültiger Kontext für dieses Token'
      },
      'VAR_NAME_EXPECTED': {
        EN: 'Expecting a variable name',
        DE: 'Variablenname erwartet'
      },
      'TOO_MANY_PARAMETERS': {
        EN: 'Too many parameters',
        DE: 'Zu viele Parameter angegeben'
      },
      'NOT_ENOUGH_PARAMETERS': {
        EN: 'Not enough parameters',
        DE: 'Zu wenige Parameter angegeben'
      },
      'COMMA_MUST_BE_FOLLOWED_BY_EXPRESSION': {
        EN: 'Comma must be followed by another expression',
        DE: 'Nach dem Komma muss eine weitere Anweisung folgen'
      },
      'MISSING_OPENING_BRACKET': {
        EN: 'Missing opening bracket',
        DE: 'Öffnende Klammer fehlt'
      },
      'NO_MORE_TOKENS_ALLOWED': {
        EN: 'No more tokens allowed after last key word',
        DE: 'Keine weiteren Tokens nach dem letzten Schlüsselwort erlaubt'
      },
      'NO_CONDITION_BLOCK_OPENED': {
        EN: 'No condition block opened',
        DE: 'Kein Bedingungsblock definiert'
      },
      'DUPLICATE_DECLARATION': {
        EN: 'Duplicate Declaration (prohibited)',
        DE: 'Mehrfache Deklaration (verboten)'
      },
      TODO: {
        EN: 'This error message is not implemented yet.',
        DE: 'Diese Fehlermeldung wurde noch nicht implementiert.'
      }
    },
    'INFO': {},
    'WARNING': {}
  };

  individuals: object;
  stack: any[];
  state;
  gameCode: BBScriptCode;

  constructor(
    private generalService: GeneralService,
    private gameState: GameStateService,
    private language: LanguageService,
    private basics: CommandsBasicsService,
    private data: CommandsDataService,
    private graphics2d: CommandsGraphics2DService,
    private graphics3d: CommandsGraphics3DService,
    private gui: CommandsGUIService,
    private io: CommandsIOService,
    private sound: CommandsSoundService
  ) {
    this.resetParser();
    this.gameCode = {
      globals: [],
      statements: [],
      mainLoop: [],
      functions: [],
      types: []
    };
  }

  /**
   * Resets (or initializes) the parser object, as well as helper variables.
   */
  resetParser(): void {
    //stores individual values
    this.individuals = {};
    //stores code sections (e. g. conditions, selections, loops)
    this.stack = [];
    this.state = '?';
  }

  /**
   * Retrieves all global variables, constants, dim-arrays, function and type names
   * from a given lexer code.
   * @param lexerCode An array of lexer token arrays, preprocessed by the lexer
   */
  getIndividuals(lexerCode: Array<LexerToken[]>): any {
    let result = {
      global: [],
      const: [],
      dim: [],
      fn: [],
      type: []
    };

    lexerCode.forEach((lexerTokens: LexerToken[]) => {
      for (let i = 0; i < lexerTokens.length; i++) {
        if (lexerTokens[i].which === LexerTokenCategory.INDIVIDUAL) {
          if (i > 0 && lexerTokens[i - 1].which === LexerTokenCategory.KEYWORD) {
            //console.info('Previous token is a key word:', lexerTokens[i-1]);
            let keywordValue = lexerTokens[i - 1].value.toLowerCase();
            switch (keywordValue) {
              case 'global':
                if (result.global.indexOf(keywordValue) === -1) {
                  result.global.push(lexerTokens[i].value);
                }
                break;
              case 'const':
                if (result.const.indexOf(keywordValue) === -1) {
                  result.const.push(lexerTokens[i].value);
                }
                break;
              case 'dim':
                if (result.dim.indexOf(keywordValue) === -1) {
                  result.dim.push(lexerTokens[i].value);
                }
                break;
              case 'function':
                if (result.fn.indexOf(keywordValue) === -1) {
                  result.fn.push(lexerTokens[i].value);
                }
                break;
              case 'type':
                if (result.type.indexOf(keywordValue) === -1) {
                  result.type.push(lexerTokens[i].value);
                }
                break;
            }
          }
        }
      }
    });

    return result;
  }

  /**
   * Retrieves all local variables from a given lexer code.
   * If a function name is passed, only local variables of this function will be retrieved.
   * Otherwise, all local variables of all code functions will be retrieved.
   * @param lexerCode
   * @param fn
   */
  getLocals(lexerCode: Array<LexerToken[]>, fn?: string): any {
    if (fn) {

    }
  }

  /** RULES **/
  // [Num]: int | float | Pi
  // [Str]: string
  // [Bool]: True | False
  // [Expr]: [NumExpr] | [StrExpr] | [BoolExpr] | [Bool] | [Num] | [Str]
  // [NumExpr]: [Num] + [Num] | [Num] - [Num] | [Num] * [Num] | [Num] / [Num] | [Num] ^ [Num]
  // [StrExpr]: [Str] | [Str] + [Str] | [Str] + [Num] | [Str] + [Bool]
  // [BoolExpr]: [Bool] | [And] | [Or] | [Xor] | [Not]
  // [Ind]: $individual
  // [Ind+]: [Ind] | [Ind], [Ind+]
  // [Assign]: [Ind] = [Expr]
  // [Param]: [Ind] | [Assign]
  // [Cond]: [BoolExpr] | [Expr] = [Expr] | [Expr] < [Expr] | [Expr] > [Expr] | [Expr] <= [Expr] | [Expr] >= [Expr] | [Expr] <> [Expr]
  // Global [Ind]+
  // Local [Ind]+
  // Case [Ind]+ | Case [Expr]+
  // Default
  // Else | Else If [Cond] | Else If [Cond] Then
  // ElseIf [Cond] | ElseIf [Cond] Then
  // EndIf
  // If [Cond] | If [Cond] Then
  // Select [Ind]
  // [After]: After [ObjIndex]? [Ind]
  // [Before]: Before [ObjIndex]? [Ind]
  // Delete [Ind]
  // [First]: First [Ind]
  // [Last]: Last [Ind]
  // Insert [Ind] [Before | After]? [Ind]
  // [New]: New [Ind]
  // Null
  // TODO Object.[Type]
  // Type [Ind]
  // Field [Ind]
  // End | End Type | End Function | End If | End Select
  // Include [StrExpr]
  // Stop
  // Data [Expr]+
  // Dim [Ind]+
  // For [Assign] To [NumExpr] [Step [NumExpr]]? | For [Ind] = Each [Ind]
  // Const [Ind]+
  // MainLoop
  // Return [Expr]?
  // Exit
  // Forever
  // Next
  // Repeat
  // Until [Cond]
  // Wend
  // While [Cond]
  // [Mod]: [NumExpr] Mod [NumExpr]
  // [Not]: Not [BoolExpr]
  // [And]: [BoolExpr] And [BoolExpr]
  // [Or]: [BoolExpr] Or [BoolExpr]
  // [Xor]: [BoolExpr] Xor [BoolExpr]
  // Function [Ind] ([Param]*)
  // [Label]: .[Ind]
  // Restore [Label]
  // Read [Ind]+
  // [Ind] = Handle [Ind]
  // [Sar]: [NumExpr] Sar [NumExpr]
  // [Sar]: [NumExpr] Shl [NumExpr]
  // [Sar]: [NumExpr] Shr [NumExpr]
  createGameCode(lexerCode: Array<LexerToken[]>): BBScriptCode {
    // parse code line by line
    lexerCode.forEach((lexerTokens: LexerToken[]) => {
      // perform token cleanup: remove comments
      let initialTokens: LexerToken[] = [];
      lexerTokens.forEach((token: LexerToken) => {
        if (token.which !== LexerTokenCategory.COMMENT_MARKER && token.which !== LexerTokenCategory.COMMENT) {
          initialTokens.push(token);
        }
      });

      console.info('INITIAL TOKENS:', initialTokens);

      /*
       * Entry points:
       * // -declaration: Global | Local | Const | Dim
       *    -> can be combined with assignment
       * // -assignment: foo = 42
       * // -label: .label
       * // -command call: Graphics 640,480
       * // -function call: PrintText("Hello World")
       * // -loop begin: For | While | Repeat
       * // -loop break: Exit
       * // -loop end: Next | Wend | Until | Forever
       * // -condition: If x=y [Then] | ElseIf | Else If
       * // -condition end: EndIf | End If
       * // -selection head: Select variable
       * // -selection body: Case | Default
       * // -selection end: End Selection
       * // -function definition: Function foo(a, b, c)
       * // -function return: Return [...]
       * // -function end: End Function
       * // -type definition: Type Alien
       * // -type body: Field x, y, z
       * // -type end: End Type
       * // -object deletion: Delete alien
       * // -object insertion: Insert ...
       * // -script inclusion: Include script.bbs
       * // -debug stop: Stop
       * // -data definition: Data ...
       * // -restore data: Restore
       * // -read data: Read
       * // -main loop: MainLoop
       * // -main loop end: End MainLoop
       * // -quit program: end
       */
      // this.parseState(ParserState.INITIAL, initialTokens);

      //TODO: this is only a very basic parsing function
      // remove double quote and comma tokens
      initialTokens.forEach((token: LexerToken, index: number) => {
        if (token.which === LexerTokenCategory.DOUBLE_QUOTE || token.which === LexerTokenCategory.COMMA) {
          initialTokens.splice(index, 1);
        }
      });

      const cmdFromLexer = initialTokens[0];

      if (cmdFromLexer.which !== LexerTokenCategory.COMMAND) {
        console.error('First token MUST BE a command!');
      } else {
        // get all params
        const cmdFromJson = this.language.commands[cmdFromLexer.value.toLowerCase()];
        let params: { name: string, optional: boolean }[] = cmdFromJson.params;
        let minParams: number = 0;
        const maxParams: number = params.length;
        params.forEach((param) => {
          if(!param.optional) {
            minParams++;
          }
        });

        // check if amount of params fits
        let commandParams: number = initialTokens.length - 1;
        if (commandParams >= minParams && commandParams <= maxParams) {
          initialTokens.shift();
          const finalParams = [];
          initialTokens.forEach(t => {
            if([LexerTokenCategory.INTEGER, LexerTokenCategory.FLOAT].indexOf(t.which) > -1) {
              // convert numbers to correct numbers
              finalParams.push(Number(t.value));
            } else {
              finalParams.push(t.value);
            }
          })

          // push new statement to game code
          this.gameCode.statements.push(
            this[cmdFromJson.category][cmdFromLexer.value.toLowerCase()](...finalParams)
          );
        } else {
          console.error(`Invalid number of command parameters (must be in range ${minParams} - ${maxParams}, but given ${commandParams}`);
        }
      }
    });

    return this.gameCode;
  }

  parseState(state: ParserState, tokens: LexerToken[]) {
    //investigate first token, which is relevant for the current state
    let currentToken: LexerToken = tokens.shift();
    console.info('Parsing Token', currentToken);

    let validTokenCategories: LexerTokenCategory[];

    switch (state) {
      case ParserState.INITIAL:
        validTokenCategories = [
          LexerTokenCategory.KEYWORD,
          LexerTokenCategory.COMMAND,
          LexerTokenCategory.LABEL_DOT,
          LexerTokenCategory.INDIVIDUAL
        ];
        if (validTokenCategories.indexOf(currentToken.which) === -1) {
          console.error('Invalid token category:', currentToken);
          return;
        }

        switch (currentToken.which) {
          case LexerTokenCategory.KEYWORD:
            switch (currentToken.value.toLowerCase()) {
              case 'global':
              case 'local':
              case 'const':
              case 'dim':
                this.parseState(ParserState.DECLARATION, tokens);
                break;
              case 'for':
              case 'while':
              case 'repeat':
                this.parseState(ParserState.LOOP_HEAD, tokens);
                break;
              case 'exit':
                this.parseState(ParserState.LOOP_BREAK, tokens);
                break;
              case 'next':
              case 'wend':
              case 'until':
              case 'forever':
                this.parseState(ParserState.LOOP_END, tokens);
                break;
              case 'if':
              case 'elseif':
              case 'else':
                this.parseState(ParserState.CONDITION_HEAD, tokens);
                break;
              case 'endif':
                this.parseState(ParserState.CONDITION_END, tokens);
                break;
              case 'select':
                this.parseState(ParserState.SELECTION_HEAD, tokens);
                break;
              case 'case':
              case 'default':
                this.parseState(ParserState.SELECTION_BODY, tokens);
                break;
              case 'function':
                this.parseState(ParserState.FUNCTION_HEAD, tokens);
                break;
              case 'return':
                this.parseState(ParserState.FUNCTION_RETURN, tokens);
                break;
              case 'type':
                this.parseState(ParserState.TYPE_HEAD, tokens);
                break;
              case 'field':
                this.parseState(ParserState.TYPE_BODY, tokens);
                break;
              case 'delete':
                this.parseState(ParserState.OBJECT_DELETION, tokens);
                break;
              case 'insert':
                this.parseState(ParserState.OBJECT_INSERTION, tokens);
                break;
              case 'include':
                this.parseState(ParserState.INCLUDE, tokens);
                break;
              case 'stop':
                this.parseState(ParserState.DEBUG_STOP, tokens);
                break;
              case 'data':
                this.parseState(ParserState.DATA_DEFINITION, tokens);
                break;
              case 'restore':
                this.parseState(ParserState.RESTORE_DATA, tokens);
                break;
              case 'read':
                this.parseState(ParserState.READ_DATA, tokens);
                break;
              case 'mainloop':
                this.parseState(ParserState.MAIN_LOOP_HEAD, tokens);
                break;
              case 'end':
                if (tokens.length > 1) {
                  switch (tokens[1].which) {
                    case LexerTokenCategory.KEYWORD:
                      switch (tokens[1].value.toLowerCase()) {
                        case 'function':
                          this.parseState(ParserState.FUNCTION_END, tokens);
                          break;
                        case 'type':
                          this.parseState(ParserState.TYPE_END, tokens);
                          break;
                        case 'if':
                          this.parseState(ParserState.CONDITION_END, tokens);
                          break;
                        case 'select':
                          this.parseState(ParserState.SELECTION_END, tokens);
                          break;
                        case 'mainloop':
                          this.parseState(ParserState.MAIN_LOOP_END, tokens);
                      }
                      break;
                    default:
                    //TODO error: end must be followed by another keyword
                  }
                } else {
                  this.parseState(ParserState.QUIT_PROGRAM, tokens);
                }
                break;
              default:
                console.error('Invalid key word:', currentToken);
            }
            break;
          case LexerTokenCategory.COMMAND:
            this.stack.push(currentToken);
            this.parseState(ParserState.COMMAND_CALL, tokens);
            break;
          case LexerTokenCategory.LABEL_DOT:
            this.parseState(ParserState.LABEL, tokens);
            break;
          case LexerTokenCategory.INDIVIDUAL:
            let hasAssignment = false;
            tokens.forEach((token) => {
              if (token.which === LexerTokenCategory.ASSIGNMENT) {
                hasAssignment = true;
              }
            });

            if (hasAssignment) {
              this.parseState(ParserState.ASSIGNMENT, tokens);
            } else {
              this.parseState(ParserState.FUNCTION_CALL, tokens);
            }
        }
        break;
      case ParserState.DECLARATION:
        // these are not the key words but the actual variables!
        validTokenCategories = [
          LexerTokenCategory.GLOBAL,
          LexerTokenCategory.LOCAL,
          LexerTokenCategory.DIM,
          LexerTokenCategory.CONST
        ];
        if (validTokenCategories.indexOf(currentToken.which) === -1) {
          console.error('Invalid token category');
        }

        if (tokens.length === 0) {
          //No following tokens: Insert declaration statement
          this.gameCode.globals[currentToken.value] = 0;
        } else {
          //Valid following tokens: , =
          switch (tokens[0].which) {
            case LexerTokenCategory.COMMA:
              this.gameCode.globals[currentToken.value] = 0;
              this.parseState(ParserState.DECLARATION, tokens);
              break;
            case LexerTokenCategory.ASSIGNMENT:
              this.parseState(ParserState.ASSIGNMENT, tokens);
              break;
            default:
              console.error('Invalid token following a declaration');
          }
        }

        break;
      case ParserState.ASSIGNMENT:

        //Valid following tokens: ( [Number] [String] True False Pi First Last [Individual] [Command]
        break;
      case ParserState.COMMAND_CALL:
        let command: ApiCommand = this.language.commands[this.stack.pop().value.toLowerCase()];
        console.info('Command:', command);

        let service: string = `commands${command.category.charAt(0).toUpperCase()}${command.category.slice(1)}${command.subCategory.charAt(0).toUpperCase()}${command.subCategory.slice(1)}`;
        console.info('Service:', service);

        //TODO code must be executed later, for the services are not initialized yet
        this.gameCode.statements.push(
          this.graphics2d.graphics(800, 600),
          //this.graphics2d.cameraClsColor(255,0,0),  //TODO wrong implementation, fix
          this.generalService.assign({
            variable: 'i',
            type: 'global',
            expression: {
              value: of(42)
            }
          }),

          //CAMERA
          this.generalService.assign({
            variable: 'camera',
            type: 'global',
            expression: {
              value: this.graphics3d.createCamera(CameraType.FREE)
            }
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('camera').subscribe((camera: GameEntity) => {
              this.graphics3d.positionEntity(camera, 0, 2, -5).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('camera').subscribe((camera: Camera) => {
              this.graphics3d.cameraClsColor(camera, 50, 200, 240).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),

          //LIGHT
          this.generalService.assign({
            variable: 'light',
            type: 'global',
            expression: {
              value: this.graphics3d.createLight(1)
            }
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('light').subscribe((light: Light) => {
              this.graphics3d.lightColor(light, 255, 255, 0).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),

          //PRIMITIVE MESH
          this.generalService.assign({
            variable: 'cube',
            type: 'global',
            expression: {
              value: this.graphics3d.createCube()
            }
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('cube').subscribe((cube: GameEntity) => {
              this.graphics3d.positionEntity(cube, 0, 1, 0).subscribe((done) => {
                observer.next();
                observer.complete();
              });
            });
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('cube').subscribe((cube: GameEntity) => {
              this.graphics3d.entityColor(cube, 0, 255, 0).subscribe((done) => {
                observer.next();
                observer.complete();
              });
            });
          }),

          this.graphics3d.ambientLight(128, 200, 50),


          //2D GRAPHICS
          this.graphics2d.color(0, 128, 0),

          //this.commandsBasicsTimeRandom.delay(2000),

          this.graphics2d.oval(50, 200, 20, 40, false),
          this.graphics2d.line(300, 40, 350, 120),

          //this.graphics2d.color(255, 255, 0),
          this.graphics2d.plot(200, 200),

          //IMAGE
          this.graphics2d.autoMidHandle(true),
          this.generalService.assign({
            variable: 'image',
            type: 'global',
            expression: {
              value: this.graphics2d.loadImage('/assets/gfx/face.png')
            }
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('image').subscribe((image: GameImage2D) => {
              this.graphics2d.resizeImage(image, 128, 128).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('image').subscribe((image: GameImage2D) => {
              this.graphics2d.rotateImage(image, 30).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('image').subscribe((image: GameImage2D) => {
              this.graphics2d.drawBlock(image, 200, 250).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),
          this.graphics2d.rect(195, 245, 10, 10, true),
          this.graphics2d.rect(195 - 64, 245 - 64, 10, 10, true),

          //TEXT
          this.generalService.assign({
            variable: 'font',
            type: 'global',
            expression: {
              value: this.graphics2d.loadFont('Arial', 32, true, true, true)
            }
          }),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('font').subscribe((font: GameFont) => {
              this.graphics2d.setFont(font).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          }),

          this.graphics2d.text(50, 50, 'HELLO WORLD!'),
          this.graphics2d.stringWidth('HELLO WORLD!'),
          this.graphics2d.stringHeight('HELLO WORLD!'),
          this.generalService.assign({
            variable: 'rndValue',
            type: 'global',
            expression: {
              value: of('Hello World')
            }
          }),
          this.basics.seedRnd('Hello World'),
          new Observable((observer) => {
            this.gameState.getGlobalAsync('image').subscribe((image: GameImage2D) => {
              this.graphics2d.maskImage(image, 255, 0, 255).subscribe(() => {
                observer.next();
                observer.complete();
              });
            });
          })
        );
    }
  }

  parseCondition(tokens: LexerToken[]) {
    let linkValues: string[] = ['And', 'Or', 'Xor'];

    //find all expressions
    let expressions: Array<LexerToken[]> = [];
    let currentExpression: LexerToken[] = [];
    let links: LexerToken[] = [];
    tokens.forEach((token: LexerToken) => {
      if (token.which === LexerTokenCategory.KEYWORD && linkValues.indexOf(token.value) > -1) {
        links.push(token);

        if (currentExpression.length > 0) {
          expressions.push(currentExpression);
          currentExpression = [];
        }
      } else {
        currentExpression.push(token);
      }
    });
    if (currentExpression.length > 0) {
      expressions.push(currentExpression);
    }

    console.info('Expressions:', expressions);
    console.info('Links:', links);

    expressions.forEach((expression: LexerToken[]) => {
      this.parseExpression(expression);
    });
  }

  /**
   * Parses a comparison based on the comparison operator's index.
   * @param tokens A lexer token array
   * @param compIndex The position of the comparison operator
   */
  parseComparison(tokens: LexerToken[], compIndex: number) {
    //[Expr] = [Expr] | [Expr] < [Expr] | [Expr] > [Expr] | [Expr] <= [Expr] | [Expr] >= [Expr] | [Expr] <> [Expr]

    //TODO
  }

  parseLogicalLink(tokens: LexerToken[], linkIndex: number) {
    // [And]: [BoolExpr] And [BoolExpr]
    // [Or]: [BoolExpr] Or [BoolExpr]
    // [Xor]: [BoolExpr] Xor [BoolExpr]

    let expectedTokens = [
      LexerTokenCategory.INTEGER,
      LexerTokenCategory.FLOAT,
      LexerTokenCategory.STRING
    ];
    let validLeftExpression;

    //parse left hand boolean expression
    for (let leftIndex = linkIndex - 1; leftIndex >= 0; leftIndex--) {
      let currentToken = tokens[leftIndex];
      if (expectedTokens.indexOf(currentToken.which) > -1) {

      }
    }
  }

  parseExpression(tokens: LexerToken[]) {
    let validTokenCategories: any = {
      value: [
        LexerTokenCategory.KEYWORD,
        LexerTokenCategory.INTEGER,
        LexerTokenCategory.STRING,
        LexerTokenCategory.FLOAT,
        LexerTokenCategory.INDIVIDUAL
      ],
      algebraicComparison: [
        LexerTokenCategory.ALGEBRAIC,
        LexerTokenCategory.COMPARISON
      ]
    };
    let validKeywords: any = {
      value: ['Not', 'Pi']
    };

    let state = 'value';

    tokens.forEach((token: LexerToken) => {
      //check if current token is valid
      let validToken = validTokenCategories[state].indexOf(token.which) > -1;
      if (token.which === LexerTokenCategory.KEYWORD) {
        validToken = validKeywords[state].indexOf(token.value) > -1;
      }

      if (validToken) {
        switch (token.which) {
          case LexerTokenCategory.INTEGER:
          case LexerTokenCategory.FLOAT:
            state = 'algebraicComparison';
        }
      } else {
        console.error('Invalid token:', token);
      }
    });
  }
}

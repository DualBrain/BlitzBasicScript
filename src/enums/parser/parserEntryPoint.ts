export enum ParserEntryPoint {
  DECLARATION,
  ASSIGNMENT,
  COMMAND_CALL,
  LABEL,
  LOOP_HEAD,
  LOOP_BREAK,
  LOOP_END,
  CONDITION_HEAD,
  CONDITION_END,
  SELECTION_HEAD,
  SELECTION_BODY,
  SELECTION_END,
  FUNCTION_HEAD,
  FUNCTION_RETURN,
  FUNCTION_END,
  FUNCTION_CALL,
  TYPE_HEAD,
  TYPE_BODY,
  TYPE_END,
  OBJECT_DELETION,
  OBJECT_INSERTION,
  INCLUDE,
  DEBUG_STOP,
  DATA_DEFINITION,
  RESTORE_DATA,
  READ_DATA,
  MAIN_LOOP_HEAD,
  MAIN_LOOP_END,
  QUIT_PROGRAM
}
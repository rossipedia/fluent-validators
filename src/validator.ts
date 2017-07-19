import { IComposable, Composable } from './interfaces';

export default class Validator implements IComposable {
  fn: Composable;
  invalidMessage: string;
  args: any[];

  constructor(fn: Composable, invalidMessage: string, args: any[] = []) {
    this.fn = fn;
    this.invalidMessage = invalidMessage;
    this.args = args;
  }
}
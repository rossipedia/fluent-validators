import { IComposable } from './interfaces';
import apply from './apply-validator';

export default class Composite implements IComposable {
  args = [];
  invalidMessage: string;
  constructor(private first: IComposable, private second: IComposable) {}

  fn(value: any): boolean {
    if (!apply(this.first, value)) {
      this.invalidMessage = this.first.invalidMessage;
      return false;
    }

    if (!apply(this.second, value)) {
      this.invalidMessage = this.second.invalidMessage;
      return false;
    }

    return true;
  }
}
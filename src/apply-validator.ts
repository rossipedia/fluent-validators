import { IComposable } from './interfaces';

export default function apply(v: IComposable, value: any): boolean {
  return v.fn(value, ...v.args);
}
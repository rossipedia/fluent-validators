import { IComposable, IValidatorBuilder, Composable } from './interfaces';
import Validator from './validator';
import Composite from './composite-validator';
import apply from './apply-validator';

export type MessageGeneratorFn = (...args: any[]) => string;
export type ValidatorMap<T> = { [name in keyof T]: ValidatorMethod<T> };

export interface ValidatorMethod<T> {
  (this: T, ...args: any[]): WithBuilder<T> & IValidatorBuilder;
}

export interface DefineMethodFn<T> {
  (
    fn: Composable,
    invalidMessage: string | MessageGeneratorFn
  ): ValidatorMethod<T>;
}

export interface DefineMapFn<T> {
  (define: DefineMethodFn<T>): ValidatorMap<T>;
}

export type WithBuilder<T> = {
  [k in keyof T]: ValidatorMethod<T>
};

export function defineValidators<TBuilderInterface>(
  validatorMap: DefineMapFn<TBuilderInterface>
): () => WithBuilder<TBuilderInterface> & IValidatorBuilder {

  class ValidatorBuilder implements IValidatorBuilder {
    constructor(private v?: IComposable) {}

    add(fn: Composable, invalidMessage: string, args: any[]) {
      const validator = new Validator(fn, invalidMessage, args);
      if (this.v) {
        return new ValidatorBuilder(new Composite(this.v, validator));
      }
      this.v = validator;
      return this;
    }

    validate(value: any, label: string): string | undefined {
      if (!this.v) {
        throw new Error('No validation rules defined');
      }

      const result = apply(this.v, value);
      if (!result) {
        return `${label} ${this.v.invalidMessage}`;
      }
    }
  }

  const map = validatorMap((fn, invalidMessage) => {
    if (!fn) throw new Error('No validation function supplied for validator');
    if (!invalidMessage)
      throw new Error('No invalid message supplied for validator');
    return function(this: TBuilderInterface, ...args: any[]) {
      const b: ValidatorBuilder = this as any;
      const msg =
        typeof invalidMessage === 'string'
          ? invalidMessage
          : invalidMessage(...args);

      return b.add(fn, msg, args) as any;
    };
  });

  const descMap: PropertyDescriptorMap = {};
  for (let key in map) {
    descMap[key] = { value: map[key] };
  }
  Object.defineProperties(ValidatorBuilder.prototype, descMap);

  return () => new ValidatorBuilder() as any; // I know what I'm doing here
}

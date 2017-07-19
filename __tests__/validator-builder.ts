import { defineValidators, WithBuilder } from '../src/validator-builder';
import { IValidatorBuilder } from '../src/interfaces';
import Validator from '../src/validator';
import CompositeValidator from '../src/composite-validator';

describe('ValidatorBuilder', () => {
  interface IValidators {
    required(): IValidators;
    isString(): IValidators;
  }

  type Factory = () => WithBuilder<IValidators> & IValidatorBuilder;

  const exists = (v: any) => v !== undefined && v !== null;
  const v: Factory = defineValidators<IValidators>(define => ({
    required: define((val: any) => exists(val) && !!val, 'is required'),
    isString: define(
      (val: any) => !exists(v) || typeof val === 'string',
      'must be a string'
    ),
  }));

  test('can create empty', () => {
    const b = v();
  });

  test('validate() called on empty throws', () => {
    expect(() => {
      v().validate('foo', 'test value');
    }).toThrow();
  });

  test('single item success', () => {
    expect(v().required().validate('foo', 'test value')).toBe(undefined);
    expect(v().isString().validate('foo', 'test value')).toBe(undefined);
  });

  test('single item fail', () => {
    expect(v().required().validate(null, 'test value')).toBe(
      'test value is required'
    );
  });

  test('two item success', () => {
    expect(
      v().required().isString().validate('foo', 'test value')
    ).toBeUndefined();
  });

  test('two item fail (first)', () => {
    expect(v().required().isString().validate(null, 'test value')).toBe(
      'test value is required'
    );
  });

  test('two item fail (second)', () => {
    expect(v().required().isString().validate(123, 'test value')).toBe(
      'test value must be a string'
    );
  });

  test('can create two builders', () => {
    interface IFirst {
      isNumber(): IFirst;
    }

    interface ISecond {
      isNumber(): ISecond;
    }

    const v1 = defineValidators<IFirst>(v => ({
      isNumber: v(value => typeof value === 'number', 'must be a number')
    }));

    const v2 = defineValidators<ISecond>(v => ({
      isNumber: v(value => !isNaN(parseFloat(value)), 'must be a number')
    }));

    // expect(v1().isNumber().validate(123, 'test value')).toBeUndefined();
    expect(v1().isNumber().validate('123', 'test value')).not.toBeUndefined();
    // expect(v1().isNumber().validate('foo', 'test value')).not.toBeUndefined();

    // expect(v2().isNumber().validate(123, 'test value')).toBeUndefined();
    expect(v2().isNumber().validate('123', 'test value')).toBeUndefined();
    // expect(v2().isNumber().validate('foo', 'test value')).not.toBeUndefined();
  });
});

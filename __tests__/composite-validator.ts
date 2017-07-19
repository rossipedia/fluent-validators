// import { CompositeValidator, Validator, applyValidator } from '../src/builder';
import CompositeValidator from '../src/composite-validator';
import Validator from '../src/validator';
import applyValidator from '../src/apply-validator';

describe('CompositeValidator', () => {
  const exists = (v: any) => v !== undefined && v !== null;

  const required = (v: any) => !!v;
  const isString = (v: any) => !exists(v) || typeof v === 'string';

  const v1 = new Validator(required, 'is required');
  const v2 = new Validator(isString, 'must be a string');

  test('can create', () => {
    const cv = new CompositeValidator(v1, v2);
  });

  test('can apply', () => {
    applyValidator(new CompositeValidator(v1, v2), 'foo');
  });

  test('returns true for passing case', () => {
    expect(applyValidator(new CompositeValidator(v1, v2), 'foo')).toBe(true);
  });

  test('returns false for first validator fail', () => {
    expect(applyValidator(new CompositeValidator(v1, v2), null)).toBe(false);
  });

  test('returns false for second validator fail', () => {
    expect(applyValidator(new CompositeValidator(v1, v2), 123)).toBe(false);
  });

  test('uses first validator message when first validator fails', () => {
    const cv = new CompositeValidator(v1, v2);
    applyValidator(cv, null);
    expect(cv.invalidMessage).toBe(v1.invalidMessage);
  });

  test('uses second validator message when second validator fails', () => {
    const cv = new CompositeValidator(v1, v2);
    applyValidator(cv, 123);
    expect(cv.invalidMessage).toBe(v2.invalidMessage);
  });
});

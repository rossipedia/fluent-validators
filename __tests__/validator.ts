// import { Validator, applyValidator } from '../src/builder';
import Validator from '../src/validator';
import applyValidator from '../src/apply-validator';

describe('Validator', () => {
  const required = (val: any) => !!val;

  test('can create', () => {
    const v = new Validator(required, 'is required');
  });

  test('can apply', () => {
    const v = new Validator(required, 'is required');
    applyValidator(v, 'foo');
  });

  test('returns true for success', () => {
    const v = new Validator(required, 'is required');
    expect(applyValidator(v, 'foo')).toBe(true);
  });

  test('returns false for failure', () => {
    const v = new Validator(required, 'is required');
    expect(applyValidator(v, null)).toBe(false);
  });
});

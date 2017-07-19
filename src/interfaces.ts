export type Composable = (value: any, ...args: any[]) => boolean;

export interface IComposable {
  fn: Composable;
  invalidMessage: string;
  args: any[];
}

export interface IValidatorBuilder {
  validate(value: any, label: string): string | undefined;
}
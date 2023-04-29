/**
 * Class type.
 */
export type ClassType<T = unknown> = {
  new (...args: unknown[]): T;
};

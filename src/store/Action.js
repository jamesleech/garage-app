// @flow
export type ActionFunc<T> = (payload: T) => Action<T>;

export type Action<T> = {
  +type: string;
  +payload: T;
  +error?: boolean;
}

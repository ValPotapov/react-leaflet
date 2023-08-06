export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export type Action<T extends any[] = []> = (...args: T) => void;
export type Func<T extends any[], R> = (...args: T) => R;

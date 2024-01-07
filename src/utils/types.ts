export const isTruthy = <T>(a: T | undefined): a is T => Boolean(a)

export interface Dictionary {
  [key: string]: string | Dictionary
}

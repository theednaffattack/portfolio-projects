export function isString(property: string | any): property is string {
  return typeof property === "string";
}

export function isNumber<T>(property: number | T): property is number {
  return !!property;
}

export function isString(property: string | any): property is string {
  return typeof property === "string";
}

export function isNumber<T>(property: string | T): property is string {
  return !!property;
}

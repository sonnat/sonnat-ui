const isUndef = <T>(value: T | undefined): value is undefined =>
  typeof value === "undefined";

export default isUndef;

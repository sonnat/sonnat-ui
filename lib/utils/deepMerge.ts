type ObjectType = Record<string, unknown>;

export const isPlainObject = <T>(value: T): boolean =>
  value &&
  typeof value === "object" &&
  (<ObjectType>value).constructor === Object;

const deepMerge = (
  target: ObjectType,
  source: ObjectType,
  options = { clone: true }
): ObjectType => {
  const output = options.clone ? { ...target } : target;

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      // Avoid prototype pollution
      if (key === "__proto__") return;

      if (isPlainObject(source[key]) && key in target) {
        output[key] = deepMerge(
          <ObjectType>target[key],
          <ObjectType>source[key],
          options
        );
      } else output[key] = source[key];
    });
  }

  return output;
};

export default deepMerge;

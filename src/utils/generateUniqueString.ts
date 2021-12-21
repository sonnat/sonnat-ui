const generateUniqueString = (): string =>
  "_" + Math.random().toString(36).substr(2, 9);

export default generateUniqueString;

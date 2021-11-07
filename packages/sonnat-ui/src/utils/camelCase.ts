const camelCase = (s: string): string =>
  s.replace(/-./g, x => x.toUpperCase()[1]);

export default camelCase;

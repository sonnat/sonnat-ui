import { AnyObject } from "../../lib/typings";

const get = (obj: AnyObject, path: string) => {
  /* @ts-ignore */
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

const difference = (a: string[], b: string[]) => {
  const set = new Set(b);
  return a.filter(x => !set.has(x));
};

const keys = <T>(obj: T) => Object.keys(obj);

const testClassNamesMatch = <T extends AnyObject>(
  element: HTMLElement,
  classNames: T,
  allowedClassNames: string[]
) => {
  const mappedClassNames = [] as string[];

  allowedClassNames.forEach(classname => {
    expect(element).toHaveClass(classname as any);
    mappedClassNames.push(classname);
  });

  keys(classNames).forEach(classnameKey => {
    if (allowedClassNames.includes(classnameKey)) return;
    expect(element).not.toHaveClass(get(classNames, classnameKey));
    mappedClassNames.push(classnameKey as any);
  });

  expect(difference(mappedClassNames, keys(classNames))).toEqual([]);
};

export default testClassNamesMatch;

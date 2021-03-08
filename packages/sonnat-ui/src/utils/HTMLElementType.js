// using the material-ui defination, check out:
// https://github.com/mui-org/material-ui/blob/0d51325692bb193598bf25bb50fa36c5acf535ef/packages/material-ui-utils/src/HTMLElementType.js

export default function HTMLElementType(
  props,
  propName,
  componentName,
  location,
  propFullName
) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const propValue = props[propName];
  const safePropName = propFullName || propName;

  if (propValue == null) {
    return null;
  }

  if (propValue && propValue.nodeType !== 1) {
    return new Error(
      `Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. ` +
        `Expected an HTMLElement.`
    );
  }

  return null;
}

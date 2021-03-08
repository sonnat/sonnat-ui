import { keys } from "../styles/createBreakpoints";

export const breakpointEnum = keys;

const generateGridNumbers = () => {
  const arr = [];

  for (let i = 1; i < 13; i++) arr.push(i);
  for (let i = 1; i < 13; i++) arr.push(`${i}`);

  return arr;
};

export const gridNumbers = generateGridNumbers();

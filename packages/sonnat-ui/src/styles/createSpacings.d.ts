/* eslint-disable no-unused-vars */
export interface Spacings {
  gutter: number;
  space: number;
}

export interface SpacingsInputs extends Partial<Spacings> {}

export default function createSpacings(spacings: SpacingsInputs): Spacings;

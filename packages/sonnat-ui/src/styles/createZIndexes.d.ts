/* eslint-disable no-unused-vars */

export interface ZIndexes {
  sticky: number;
  header: number;
  drawer: number;
  backdrop: number;
  modal: number;
  popover: number;
}

export interface ZIndexesInputs extends Partial<ZIndexes> {}

export default function createZIndexes(zIndexes: ZIndexesInputs): ZIndexes;

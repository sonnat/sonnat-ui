export interface ZIndexes extends Record<string, number> {
  sticky: number;
  header: number;
  drawer: number;
  backdrop: number;
  modal: number;
  popover: number;
}

const createZIndexes = <T extends Partial<ZIndexes>>(
  zIndexesInput?: T
): T & ZIndexes => {
  const {
    sticky = 1000,
    header = 1010,
    drawer = 1020,
    backdrop = 1030,
    modal = 1040,
    popover = 1050,
    ...others
  } = zIndexesInput || {};

  return {
    sticky,
    header,
    drawer,
    backdrop,
    popover,
    modal,
    ...others
  } as T & ZIndexes;
};

export default createZIndexes;

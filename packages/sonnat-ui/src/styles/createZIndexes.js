export default (zIndexes = {}) => {
  const {
    sticky = 1000,
    header = 1010,
    drawer = 1020,
    backdrop = 1030,
    modal = 1040,
    popover = 1050,
    ...others
  } = zIndexes;

  return {
    sticky,
    header,
    drawer,
    backdrop,
    popover,
    modal,
    ...others
  };
};

const toHaveClass = (
  element: HTMLElement,
  searcher: { [Symbol.search](string: string): number }
) => {
  const pass = element.classList.toString().search(searcher) > -1;

  return {
    message: () => {
      return `expected classList to match at least one class name, classList: ${element.classList}, searcher: ${searcher}`;
    },
    pass
  };
};

expect.extend({ toHaveClass });

export {};

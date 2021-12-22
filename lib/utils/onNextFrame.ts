type Callback = () => void;

const onNextFrame = (callback: Callback): void => {
  if (typeof window === "undefined") return;
  setTimeout(() => requestAnimationFrame(() => void callback()));
};

export default onNextFrame;

interface RefreshOptions {
  mode: "debounce" | "throttle";
  rate?: number;
  leading?: boolean;
  trailing?: boolean;
}

interface Return {
  width: number;
  height: number;
  registerNode: <T extends HTMLElement>(node: T | null) => void;
}

declare const useResizeSensor: (
  refreshOptions?: RefreshOptions | undefined
) => Return;

export default useResizeSensor;

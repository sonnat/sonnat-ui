/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "../internals/icons";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  map,
  useConstantProp,
  useControlledProp,
  useEventCallback,
  useEventListener,
  useForkedRefs,
  useIsFocusVisible,
  usePreviousValue,
  useResizeSensor
} from "../utils";
import useStyles from "./styles";

type HandleState = {
  active: boolean;
  currentX: number;
  initialX: number;
  offsetX: number;
  zIndex: number;
};

type State = {
  sup: HandleState & { right: number };
  inf: HandleState & { left: number };
  track: { right: number; left: number };
};

type StateHandoff = {
  sup: HandleState & { right: number; element?: HTMLDivElement | null };
  inf: HandleState & { left: number; element?: HTMLDivElement | null };
  track: { right: number; left: number; element?: HTMLDivElement | null };
};

interface InputSliderBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The maximum allowed value of the slider. Should not be equal to min.
   */
  max?: number;
  /**
   * The minimum allowed value of the slider. Should not be equal to min.
   */
  min?: number;
  /**
   * The Number of digits after the decimal point. Must be in the range 0 to 20, inclusive.
   */
  fractionDigits?: number;
  /**
   * The granularity with which the slider can step through values.
   *
   * It's **required** to use this when you are using a `discrete` slider.
   */
  step?: number;
  /**
   * The value of the slider.
   *
   * For bidirectional sliders, provide an array with two values.
   */
  value?: number | number[];
  /**
   * The default value. Use when the slider is not controlled.
   *
   * For bidirectional sliders, provide an array with two values.
   */
  defaultValue?: number | number[];
  /**
   * The variant of the slider.
   * @default "continuous"
   */
  variant?: "continuous" | "discrete";
  /**
   * 	If `true`, the component will be disabled.
   * @default true
   */
  disabled?: boolean;
  /**
   * The Callback fires when the value has changed.
   */
  onChange?: (newValue: number | number[]) => void;
  /**
   * The Callback fires when the slider is being dragged.
   */
  onDragging?: (state: StateHandoff) => void;
  /**
   * The Callback fires when the dragging starts.
   */
  onDragStart?: (state: StateHandoff) => void;
  /**
   * The Callback fires when the dragging ends.
   */
  onDragEnd?: (state: StateHandoff) => void;
  /**
   * The Callback fires when the component mounts.
   */
  onMount?: () => void;
  /**
   * The Callback fires when the component dismounts.
   */
  onDismount?: () => void;
}

export type InputSliderProps = Omit<
  MergeElementProps<"div", InputSliderBaseProps>,
  "defaultChecked"
>;

type Component = {
  (props: InputSliderProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<InputSliderProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["continuous", "discrete"] as const;

const TRANSITION_DURATION_IN_MILIS = 160;

const getHandleName = (
  target: HTMLDivElement,
  handleSelector: string,
  supHandle?: HTMLDivElement,
  infHandle?: HTMLDivElement
) => {
  const handle = target.closest(handleSelector);

  if (handle)
    return handle === supHandle ? "sup" : handle === infHandle ? "inf" : "sup";
  return null;
};

const getStepPosition = (number: number, steps: HTMLDivElement[]) => {
  if (steps[number]) {
    return parseFloat(steps[number].style.right.replace("px", ""));
  } else return null;
};

const createSteps = (
  count: number,
  refsArray: HTMLDivElement[],
  widthPerStep: number,
  className: string
) => {
  const steps = [];

  for (let i = 0; i < count; i++)
    steps.push(
      <div
        ref={node => {
          if (node) refsArray[i] = node;
        }}
        key={`key/${i}`}
        className={className}
        style={{ right: widthPerStep * i }}
      ></div>
    );

  return steps;
};

const getHorizontalOffset = (
  parentWidth: number,
  supRight: number,
  infLeft: number
) => {
  return {
    sup: {
      left: parentWidth - parseFloat(`${supRight}`),
      right: parseFloat(`${supRight}`)
    },
    inf: {
      left: parseFloat(`${infLeft}`),
      right: parentWidth - parseFloat(`${infLeft}`)
    }
  };
};

const getClosestHandle = (
  xFromLeft: number,
  supOffset: { left: number; right: number },
  infOffset: { left: number; right: number }
) => {
  const deltaSup = parseFloat((supOffset.left - xFromLeft).toFixed(3));
  const deltaInf = parseFloat((infOffset.left - xFromLeft).toFixed(3));

  const absDeltaSup = Math.abs(deltaSup);
  const absDeltaInf = Math.abs(deltaInf);

  return absDeltaSup > absDeltaInf
    ? { cssProperty: "left", name: "inf" }
    : absDeltaSup < absDeltaInf
    ? {
        cssProperty: "right",
        name: "sup"
      }
    : {
        cssProperty: deltaSup < 0 ? "right" : "left",
        name: deltaSup < 0 ? "sup" : "inf"
      };
};

const InputSliderBase = (
  props: InputSliderProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    onChange,
    onMount,
    onDismount,
    step: stepProp,
    max: maxProp,
    min: minProp,
    value: valueProp,
    defaultValue,
    onDragEnd: onDragEndProp,
    onDragStart: onDragStartProp,
    onDragging: onDraggingProp,
    variant: variantProp,
    onClick: onClickProp,
    fractionDigits = 4,
    disabled = false,
    ...otherProps
  } = props;

  const min = useConstantProp(minProp, 0, {
    componentName: "InputSlider",
    propName: "min"
  });

  const max = useConstantProp(maxProp, 100, {
    componentName: "InputSlider",
    propName: "max"
  });

  const step = useConstantProp(stepProp, undefined, {
    componentName: "InputSlider",
    propName: "step"
  });

  const variant = useConstantProp(variantProp, "continuous" as const, {
    componentName: "InputSlider",
    propName: "variant"
  });

  const { current: isDiscrete } = React.useRef(variant === "discrete");

  if (max <= min) {
    throw new Error(
      "[Sonnat]: `max` prop must be greater than and not equal to `min` prop!"
    );
  }

  if (Array.isArray(valueProp) && valueProp.length > 2) {
    throw new Error(
      "[Sonnat]: The array version of `value` prop only accepts two elements! (it's a touple)"
    );
  }

  if (isDiscrete && step == null) {
    throw new Error(
      '[Sonnat]: `step` prop is required when `variant="discrete"`!'
    );
  }

  const { current: stepsCount } = React.useRef(
    Math.floor(isDiscrete ? (max - min) / step! + 1 : 0)
  );

  const [value, setValue] = useControlledProp(valueProp, defaultValue, min);
  const bidirectionalCandidate = Array.isArray(value) && value.length === 2;

  const isBidirectional: boolean = useConstantProp(
    bidirectionalCandidate,
    false,
    {
      componentName: "InputSlider",
      propName: "",
      errorHandler: () => {
        return [
          `You are changing the ${
            isBidirectional ? "bi" : "uni"
          }directional state of InputSlider to be ${
            isBidirectional ? "uni" : "bi"
          }bidirectional.`,
          "This behaviour is forbidden!" +
            "Do not change the `number` value to `number[]` (or vice versa)" +
            "after component being initialized!"
        ].join("\n");
      }
    }
  );

  if (isBidirectional) {
    const inf = (value as number[])[0];
    const sup = (value as number[])[1];

    if (!(min <= inf && inf <= max) || !(min <= sup && sup <= max)) {
      throw new Error(
        `[Sonnat]: \`value\` and \`defaultValue\` props must be within range \`[${min}, ${max}]\`!`
      );
    }

    if (!(inf <= sup)) {
      throw new Error(
        `[Sonnat]: \`value[1]\` must be greater than or equal to \`value[0]\`!`
      );
    }

    if (inf < 0 || sup < 0) {
      throw new Error(`[Sonnat]: \`value\` accepts only positive numbers!`);
    }
  } else {
    if (!(min <= value && value <= max)) {
      throw new Error(
        `[Sonnat]: \`value\` and \`defaultValue\` props must be within range \`[${min}, ${max}]\`!`
      );
    }

    if (value < 0) {
      throw new Error(`[Sonnat]: \`value\` accepts only positive numbers!`);
    }
  }

  const parentRef = React.useRef<HTMLDivElement>();

  const supRef = React.useRef<HTMLDivElement>();
  const infRef = React.useRef<HTMLDivElement>();

  const trackRef = React.useRef<HTMLDivElement>(null);
  const stepsRef = React.useRef<HTMLDivElement[]>([]);

  const rootRefHandler = useForkedRefs(parentRef, ref);

  const isInitialRender = React.useRef(true);
  const isInitiated = React.useRef(false);

  const { width: parentWidth, registerNode: registerResizeSensor } =
    useResizeSensor({
      mode: "debounce"
    });

  const [transitions, setTransitions] = React.useState<string | undefined>(
    undefined
  );

  const [isDragStarted, setDragStarted] = React.useState(false);
  const [isClickAllowed, setClickAllowed] = React.useState(true);

  const [currentHandle, setCurrentHandle] = React.useState<"inf" | "sup">(
    "sup"
  );

  const [infState, setInfState] = React.useState<State["inf"]>({
    active: false,
    currentX: 0,
    initialX: 0,
    offsetX: 0,
    zIndex: 1,
    left: 0
  });

  const [supState, setSupState] = React.useState<State["sup"]>({
    active: false,
    currentX: 0,
    initialX: 0,
    offsetX: 0,
    zIndex: 1,
    right: 0
  });

  const [trackState, setTrackState] = React.useState<State["track"]>({
    left: 0,
    right: 0
  });

  const classes = useStyles();
  const handleSelector = `.${classes.handle}`;

  React.useEffect(() => {
    if (onMount) onMount();
    return () => {
      if (onDismount) onDismount();
    };
  }, [onMount, onDismount]);

  const prevParentWidth = usePreviousValue(parentWidth);
  const widthPerStep = parentWidth / (stepsCount - 1);

  const disableTransitions = () => void setTransitions("all 0ms ease");
  const enableTransitions = () => void setTransitions(undefined);

  const steps = React.useMemo(
    () =>
      isDiscrete
        ? createSteps(stepsCount, stepsRef.current, widthPerStep, classes.step)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [widthPerStep, classes.step]
  );

  const calculateValue = (track: State["track"]) => {
    let newValue;

    if (isBidirectional) {
      newValue = [
        parseFloat(
          map(track.left, 0, parentWidth, min, max).toFixed(fractionDigits)
        ),
        parseFloat(
          (max - map(track.right, 0, parentWidth, min, max)).toFixed(
            fractionDigits
          )
        )
      ];
    } else {
      newValue = max - map(track.right, 0, parentWidth, min, max);
      newValue = parseFloat(newValue.toFixed(fractionDigits));
    }

    return newValue;
  };

  const updateHandles = (value: number | number[], checkSteps = false) => {
    let supPos = 0;
    let infPos = 0;

    if (!isInitiated.current) isInitiated.current = true;

    if (isBidirectional) {
      supPos = map((value as number[])[1], min, max, parentWidth, 0);
      infPos = map((value as number[])[0], min, max, 0, parentWidth);
    } else {
      supPos = map(value as number, min, max, parentWidth, 0);
    }

    if (isDiscrete && checkSteps) {
      const supStepNumber = Math.round(
        map(supPos / step!, 0, parentWidth / step!, 0, stepsCount - 1)
      );
      const infStepNumber = Math.round(
        map(infPos / step!, 0, parentWidth / step!, 0, stepsCount - 1)
      );

      const supStepPosition = getStepPosition(supStepNumber, stepsRef.current);
      const infStepPosition = getStepPosition(infStepNumber, stepsRef.current);

      if (supStepPosition !== null) supPos = supStepPosition;
      if (infStepPosition !== null) infPos = infStepPosition;
    }

    setInfState(state => ({
      ...state,
      currentX: infPos,
      offsetX: infPos,
      left: infPos
    }));
    setSupState(state => ({
      ...state,
      currentX: -supPos,
      offsetX: -supPos,
      right: supPos
    }));
    setTrackState({ left: infPos, right: supPos });
  };

  const onResize = () => void updateHandles(value, !isInitiated.current);

  React.useEffect(() => {
    if (parentWidth && parentWidth !== prevParentWidth) {
      if (!isInitialRender.current) {
        setTimeout(() => {
          onResize();
        }, TRANSITION_DURATION_IN_MILIS);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentWidth, prevParentWidth]);

  const clickListener: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!parentRef.current) return;

    const target = e.target as HTMLDivElement;

    const clientX = e.clientX;
    const isHandleClicked = target.closest(handleSelector) !== null;

    const parentRect = parentRef.current.getBoundingClientRect();
    const handleState = currentHandle === "sup" ? supState : infState;

    if (!handleState.active && !isHandleClicked) {
      e.preventDefault();

      let xFromLeft = clamp(clientX - parentRect.left, 0, parentWidth);
      let xFromRight = parentWidth - xFromLeft;

      const horizontalOffset = getHorizontalOffset(
        parentWidth,
        supState.right,
        infState.left
      );

      const closestHandleInfo = isBidirectional
        ? getClosestHandle(
            xFromLeft,
            horizontalOffset.sup,
            horizontalOffset.inf
          )
        : { cssProperty: "right", name: "sup" };

      const otherHandle: {
        cssProperty: "left" | "right";
        name: "inf" | "sup";
      } =
        closestHandleInfo.name === "sup"
          ? { cssProperty: "left", name: "inf" }
          : { cssProperty: "right", name: "sup" };

      const otherHandleOffset = horizontalOffset[otherHandle.name];

      xFromRight = clamp(xFromRight, 0, parentWidth - otherHandleOffset.left);
      xFromLeft = clamp(xFromLeft, 0, parentWidth - otherHandleOffset.right);

      let finalCurrentX =
        closestHandleInfo.name === "sup" ? xFromRight : xFromLeft;

      if (isDiscrete) {
        const stepNumber = Math.round(
          map(finalCurrentX / step!, 0, parentWidth / step!, 0, stepsCount - 1)
        );

        const stepPosition = getStepPosition(stepNumber, stepsRef.current);
        if (stepPosition !== null) finalCurrentX = stepPosition;
      }

      const newTrackState = {
        ...trackState,
        [closestHandleInfo.name === "sup" ? "right" : "left"]: finalCurrentX
      };

      const newValue = calculateValue(newTrackState);

      if (isBidirectional) {
        if (
          (value as number[])[0] !== (newValue as number[])[0] ||
          (value as number[])[1] !== (newValue as number[])[1]
        ) {
          if (onChange) onChange(newValue);
          setValue(newValue);
        }
      } else if (value !== newValue) {
        if (onChange) onChange(newValue);
        setValue(newValue);
      }
    }
  };

  const dragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!parentRef.current) return;

    let clientX =
      e.type === "touchstart"
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).clientX;

    const rect = parentRef.current.getBoundingClientRect();
    const currentHandleName = getHandleName(
      e.target as HTMLDivElement,
      handleSelector,
      supRef.current,
      infRef.current
    );

    if (currentHandleName) {
      const handleState = currentHandleName === "sup" ? supState : infState;

      setDragStarted(true);
      setClickAllowed(false);
      setCurrentHandle(currentHandleName);

      clientX = clientX - rect.left;
      const initialX = clientX - handleState.offsetX;

      const newSupState =
        currentHandleName === "sup"
          ? { ...supState, active: true, initialX, zIndex: 2 }
          : { ...supState, zIndex: 1 };

      const newInfState =
        currentHandleName === "inf"
          ? { ...infState, active: true, initialX, zIndex: 2 }
          : { ...infState, zIndex: 1 };

      setSupState(newSupState);
      setInfState(newInfState);

      if (onDragStartProp) {
        onDragStartProp({
          sup: { ...newSupState, element: supRef.current },
          inf: { ...newInfState, element: infRef.current },
          track: { ...trackState, element: trackRef.current }
        });
      }
    }
  };

  const dragEnd = () => {
    enableTransitions();

    const [handleState, handleStateUpdater] =
      currentHandle === "sup"
        ? [supState, setSupState]
        : [infState, setInfState];

    if (handleState.active) {
      setDragStarted(false);
      setTimeout(() => setClickAllowed(true), 10);

      (handleStateUpdater as typeof setSupState)(state => ({
        ...state,
        active: false,
        initialX: state.currentX
      }));
    }

    if (onDragEndProp) {
      onDragEndProp({
        sup: {
          ...(currentHandle === "sup"
            ? { ...supState, active: false, initialX: supState.currentX }
            : supState),
          element: supRef.current
        },
        inf: {
          ...(currentHandle === "inf"
            ? { ...infState, active: false, initialX: infState.currentX }
            : infState),
          element: infRef.current
        },
        track: { ...trackState, element: trackRef.current }
      });
    }
  };

  const dragging = (e: MouseEvent | TouchEvent) => {
    if (!parentRef.current) return;

    const handleState = currentHandle === "sup" ? supState : infState;
    const otherHandleState = currentHandle === "sup" ? infState : supState;

    if (handleState.active) {
      if (e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
      }

      let clientX =
        e.type === "touchstart"
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;

      const sign = currentHandle === "sup" ? -1 : 1;

      const rect = parentRef.current.getBoundingClientRect();
      clientX = clientX - rect.left;

      const cClientX = clamp(clientX, 0, parentWidth);
      const currentX = cClientX - handleState.initialX;
      const cCurrentX = clamp(
        currentX,
        Math.min(0, sign * parentWidth),
        Math.max(0, sign * parentWidth)
      );

      let finalCurrentX = cCurrentX;

      if (isBidirectional) {
        const otherHandlePosition = parseFloat(
          currentHandle === "sup"
            ? `${(otherHandleState as typeof infState).left}`
            : `${(otherHandleState as typeof supState).right}`
        );

        finalCurrentX = clamp(
          finalCurrentX,
          Math.min(0, sign * (parentWidth - otherHandlePosition)),
          Math.max(0, sign * (parentWidth - otherHandlePosition))
        );
      }

      if (isDiscrete) {
        const stepNumber = Math.round(
            map(
              Math.abs(finalCurrentX / step!),
              0,
              parentWidth / step!,
              0,
              stepsCount - 1
            )
          ),
          stepPosition = getStepPosition(stepNumber, stepsRef.current);

        if (stepPosition !== null) finalCurrentX = sign * stepPosition;
      }

      disableTransitions();

      const newTrackState = {
        ...trackState,
        [currentHandle === "sup" ? "right" : "left"]: Math.abs(finalCurrentX)
      };

      const newValue = calculateValue(newTrackState);

      if (isBidirectional) {
        if (
          (value as number[])[0] !== (newValue as number[])[0] ||
          (value as number[])[1] !== (newValue as number[])[1]
        ) {
          if (onChange) onChange(newValue);
          setValue(newValue);
        }
      } else if (value !== newValue) {
        if (onChange) onChange(newValue);
        setValue(newValue);
      }

      if (onDraggingProp) {
        onDraggingProp({
          sup: {
            ...supState,
            currentX: finalCurrentX,
            offsetX: finalCurrentX,
            right: Math.abs(finalCurrentX),
            element: supRef.current
          },
          inf: {
            ...infState,
            currentX: finalCurrentX,
            offsetX: finalCurrentX,
            left: Math.abs(finalCurrentX),
            element: infRef.current
          },
          track: { ...newTrackState, element: trackRef.current }
        });
      }
    }
  };

  React.useEffect(() => {
    if (isInitialRender.current) isInitialRender.current = false;
    else updateHandles(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const {
    isFocusVisibleRef: isInfFocusVisibleRef,
    onBlur: handleInfBlurVisible,
    onFocus: handleInfFocusVisible,
    ref: infFocusVisibleRef
  } = useIsFocusVisible<HTMLDivElement>();

  const {
    isFocusVisibleRef: isSupFocusVisibleRef,
    onBlur: handleSupBlurVisible,
    onFocus: handleSupFocusVisible,
    ref: supFocusVisibleRef
  } = useIsFocusVisible<HTMLDivElement>();

  const handleInfRef = useForkedRefs(infFocusVisibleRef, infRef);
  const handleSupRef = useForkedRefs(supFocusVisibleRef, supRef);

  const [isInfFocusVisible, setInfFocusVisible] = React.useState(false);
  const [isSupFocusVisible, setSupFocusVisible] = React.useState(false);

  React.useEffect(() => {
    if (disabled) {
      setInfFocusVisible(false);
      setSupFocusVisible(false);
    }
  }, [disabled]);

  React.useEffect(() => {
    isInfFocusVisibleRef.current = isInfFocusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfFocusVisible]);

  React.useEffect(() => {
    isSupFocusVisibleRef.current = isSupFocusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupFocusVisible]);

  const handleFocus = useEventCallback(
    (
      event: React.FocusEvent<HTMLDivElement>,
      handleType: "inf" | "sup" = "inf"
    ) => {
      if (handleType === "inf") {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!infRef.current) infRef.current = event.currentTarget;

        handleInfFocusVisible(event);

        if (isInfFocusVisibleRef.current === true) {
          setInfState(s => ({ ...s, zIndex: 2 }));
          setSupState(s => ({ ...s, zIndex: 1 }));
          setInfFocusVisible(true);
        }
      } else if (handleType === "sup") {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!supRef.current) supRef.current = event.currentTarget;

        handleSupFocusVisible(event);

        if (isSupFocusVisibleRef.current === true) {
          setSupState(s => ({ ...s, zIndex: 2 }));
          setInfState(s => ({ ...s, zIndex: 1 }));
          setSupFocusVisible(true);
        }
      }
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>, handleType = "inf") => {
      if (handleType === "inf") {
        handleInfBlurVisible(event);

        if (isInfFocusVisibleRef.current === false) {
          setInfFocusVisible(false);
        }
      } else if (handleType === "sup") {
        handleSupBlurVisible(event);

        if (isSupFocusVisibleRef.current === false) {
          setSupFocusVisible(false);
        }
      }
    }
  );

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    handleType: "inf" | "sup" = "inf"
  ) => {
    if (event.target === event.currentTarget && !disabled) {
      let v = 0;
      let newValue;

      const stepper = isDiscrete && step ? step : 1;

      const bounds = { min, max };

      if (handleType === "inf") {
        v = isBidirectional ? (value as number[])[0] : (value as number);
        bounds.max = isBidirectional ? (value as number[])[1] : max;
      } else if (handleType === "sup") {
        v = isBidirectional ? (value as number[])[1] : (value as number);
        bounds.min = isBidirectional ? (value as number[])[0] : min;
      }

      if (
        event.key === "Down" ||
        event.key === "ArrowDown" ||
        event.key === "Left" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        newValue = clamp(v - stepper, bounds.min, bounds.max);
      } else if (
        event.key === "Up" ||
        event.key === "ArrowUp" ||
        event.key === "Right" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        newValue = clamp(v + stepper, bounds.min, bounds.max);
      }

      if (newValue != null) {
        let _v: number | number[] = 0;
        let isUniqueValue = false;

        if (handleType === "inf") {
          _v = isBidirectional ? [newValue, (value as number[])[1]] : newValue;
        } else if (handleType === "sup") {
          _v = isBidirectional ? [(value as number[])[0], newValue] : newValue;
        }

        if (isBidirectional) {
          isUniqueValue =
            (value as number[])[0] !== (_v as number[])[0] ||
            (value as number[])[1] !== (_v as number[])[1];
        } else isUniqueValue = value !== _v;

        if (isUniqueValue) {
          disableTransitions();
          updateHandles(_v, isDiscrete);
          setValue(_v);
          if (onChange) onChange(_v);
        }
      }
    }
  };

  const handleKeyUp = useEventCallback((event: React.KeyboardEvent) => {
    if (
      event.key === "Down" ||
      event.key === "ArrowDown" ||
      event.key === "Left" ||
      event.key === "ArrowLeft" ||
      event.key === "Up" ||
      event.key === "ArrowUp" ||
      event.key === "Right" ||
      event.key === "ArrowRight"
    ) {
      enableTransitions();
    }
  });

  if (typeof window !== "undefined") {
    /* eslint-disable react-hooks/rules-of-hooks */
    useEventListener({
      target: document,
      eventType: "touchend",
      handler: dragEnd,
      options: { passive: false }
    });
    useEventListener({
      target: document,
      eventType: "mouseup",
      handler: dragEnd,
      options: { passive: false }
    });
    useEventListener(
      {
        target: document,
        eventType: "touchmove",
        handler: dragging,
        options: { passive: false }
      },
      isDragStarted
    );
    useEventListener(
      {
        target: document,
        eventType: "mousemove",
        handler: dragging,
        options: { passive: false }
      },
      isDragStarted
    );
    /* eslint-enable react-hooks/rules-of-hooks */
  }

  return (
    <div
      tabIndex={-1}
      ref={node => {
        rootRefHandler(node);
        registerResizeSensor(node);
      }}
      onClick={e => {
        if (isClickAllowed) {
          clickListener(e);
          if (onClickProp) onClickProp(e);
        }
      }}
      className={c(classes.root, className, {
        [classes.disabled]: disabled,
        [classes[variant]]: allowedVariants.includes(variant)
      })}
      {...otherProps}
    >
      <div className={classes.wrapper}>
        <div className={classes.steps}>{steps}</div>
        <div className={classes.interval}>
          {isBidirectional && (
            <div
              aria-label={`The left handle of the InputSlider`}
              tabIndex={disabled ? -1 : 0}
              role="button"
              ref={handleInfRef}
              onFocus={e => void handleFocus(e, "inf")}
              onBlur={e => void handleBlur(e, "inf")}
              onKeyDown={e => void handleKeyDown(e, "inf")}
              onKeyUp={handleKeyUp}
              onTouchStart={dragStart}
              onMouseDown={dragStart}
              className={c(classes.infHandle, classes.handle, {
                [classes.focusVisible]: isInfFocusVisible
              })}
              style={{
                left: `${infState.left}px`,
                zIndex: infState.zIndex,
                transition: transitions
              }}
            >
              <button tabIndex={-1} className={classes.handleCircle}>
                <i className={classes.handleIcon}>
                  <ChevronRight />
                </i>
              </button>
            </div>
          )}
          <div
            ref={trackRef}
            className={classes.track}
            style={{
              left: `${trackState.left}px`,
              right: `${trackState.right}px`,
              transition: transitions
            }}
          ></div>
          <div
            aria-label={`The right handle of the InputSlider`}
            tabIndex={disabled ? -1 : 0}
            role="button"
            ref={handleSupRef}
            onFocus={e => void handleFocus(e, "sup")}
            onBlur={e => void handleBlur(e, "sup")}
            onKeyDown={e => void handleKeyDown(e, "sup")}
            onKeyUp={handleKeyUp}
            onTouchStart={dragStart}
            onMouseDown={dragStart}
            className={c(classes.supHandle, classes.handle, {
              [classes.focusVisible]: isSupFocusVisible
            })}
            style={{
              right: `${supState.right}px`,
              zIndex: supState.zIndex,
              transition: transitions
            }}
          >
            <button tabIndex={-1} className={classes.handleCircle}>
              {isBidirectional && (
                <i className={classes.handleIcon}>
                  <ChevronLeft />
                </i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputSlider = React.forwardRef(InputSliderBase) as Component;

/* eslint-disable @typescript-eslint/ban-ts-comment */
InputSlider.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  fractionDigits: PropTypes.number,
  width: PropTypes.number,
  step: PropTypes.number,
  // @ts-ignore
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  // @ts-ignore
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onDragging: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onMount: PropTypes.func,
  onClick: PropTypes.func,
  onDismount: PropTypes.func,
  variant: PropTypes.oneOf(allowedVariants)
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default InputSlider;

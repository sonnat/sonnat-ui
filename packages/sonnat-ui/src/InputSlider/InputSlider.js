import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { withResizeDetector } from "react-resize-detector";
import { ChevronLeft, ChevronRight } from "../internals/icons";
import { changeColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import { blue } from "../styles/pallete";
import {
  clamp,
  closest,
  map,
  useConstantProp,
  useControlled,
  useEventListener,
  useForkRef,
  useIsMounted,
  usePreviousValue,
  useEventCallback,
  useIsFocusVisible
} from "../utils";

const componentName = "InputSlider";

const allowedVariants = ["continuous", "discrete"];

const TRANSITION_DURATION_IN_MILIS = 160;

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      hacks,
      mixins: { useIconWrapper },
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        height: pxToRem(52),
        direction: "ltr",
        width: `calc(100% - ${pxToRem(36)})`,
        margin: "0 auto"
      },
      wrapper: {
        height: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        "&:after": {
          content: '""',
          zIndex: 0,
          height: pxToRem(2),
          borderRadius: pxToRem(2),
          backgroundColor: colors.divider,
          width: "100%",
          position: "absolute"
        }
      },
      steps: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row-reverse",
        position: "absolute",
        left: 0,
        right: 0
      },
      step: {
        display: "inline-flex",
        alignItems: "center",
        position: "absolute",
        transition: "right 160ms ease",
        "&:after": {
          content: '""',
          backgroundColor: colors.text.hint,
          width: pxToRem(2),
          height: pxToRem(2),
          borderRadius: "50%",
          transform: `translateX(${pxToRem(1)})`
        }
      },
      interval: {
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        height: "100%",
        position: "absolute",
        zIndex: 2,
        left: 0,
        right: 0,
        marginRight: pxToRem(-18),
        marginLeft: pxToRem(-18)
      },
      handle: {
        ...hacks.safariTransitionRadiusOverflowCombinationFix,
        width: pxToRem(36),
        height: pxToRem(36),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        position: "absolute",
        cursor: "pointer",
        transition: "right 160ms ease, left 160ms ease",
        "&:after": {
          content: '""',
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          opacity: "0",
          transform: "scale(0)",
          transition:
            "transform 240ms ease, opacity 240ms ease, background-color 240ms ease"
        },
        "&:not($focusVisible):hover:after": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.04 })
            : changeColor(colors.primary.light, { alpha: 0.04 }),
          opacity: 1,
          transform: "scale(1)"
        }
      },
      supHandle: { right: 0 },
      infHandle: { left: 0 },
      handleCircle: {
        width: pxToRem(20),
        height: pxToRem(20),
        boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.12)`,
        backgroundColor: colors.white,
        borderRadius: "50%",
        zIndex: 1,
        position: "relative",
        cursor: "pointer",
        appearance: "none !important",
        border: "none",
        padding: "0",
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 360ms ease, box-shadow 360ms ease",
        "&:active": {
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          boxShadow: `0 0 0 1px ${
            !darkMode ? colors.primary.origin : colors.primary.light
          }`,
          "& $handleIcon": { color: colors.white }
        }
      },
      handleIcon: {
        ...useIconWrapper(16),
        color: colors.createBlackColor({ alpha: 0.56 }),
        transition: "color 360ms ease"
      },
      track: {
        position: "absolute",
        left: 0,
        right: 0,
        height: pxToRem(2),
        borderRadius: pxToRem(2),
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        marginRight: pxToRem(18),
        marginLeft: pxToRem(18),
        transform: `translateX(${pxToRem(-1)})`,
        transition: "left 160ms ease, right 160ms ease"
      },
      continuous: {},
      discrete: {},
      disabled: {
        pointerEvents: "none",
        "& $handleCircle, & $track": {
          backgroundColor: !darkMode
            ? colors.pallete.grey[400]
            : colors.pallete.grey[600]
        },
        "& $handleCircle": { boxShadow: "none" },
        "& $handle:after": {
          transform: "scale(0.8)",
          backgroundColor: !darkMode
            ? "rgba(255, 255, 255, 0.7)"
            : changeColor(colors.background.origin, { alpha: 0.56 }),
          opacity: 1
        },
        "& $handleIcon": { color: !darkMode ? colors.white : colors.black },
        "& $wrapper:after": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        }
      },
      focusVisible: {
        outline: "none",
        "&:after": {
          backgroundColor: darkMode ? blue[300] : blue[500],
          opacity: darkMode ? 0.32 : 0.12,
          transform: "scale(1)"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const getHandleName = (target, handleSelector, supHandle, infHandle) => {
  const handle = closest(target, handleSelector);

  if (handle)
    return handle === supHandle ? "sup" : handle === infHandle ? "inf" : "sup";
  return null;
};

/**
 * @param {number} number
 * @param {Element[]} steps
 */
const getStepPosition = (number, steps) => {
  if (steps[number]) {
    return parseFloat(steps[number].style.right.replace("px", ""));
  } else return null;
};

const createSteps = (count, refsArray, widthPerStep, className) => {
  const steps = [];

  for (let i = 0; i < count; i++)
    steps.push(
      <div
        ref={node => {
          refsArray[i] = node;
        }}
        key={`key/${i}`}
        className={className}
        style={{ right: widthPerStep * i }}
      ></div>
    );

  return steps;
};

const getHorizontalOffset = (parentWidth, supRight, infLeft) => {
  return {
    sup: {
      left: parentWidth - parseFloat(supRight),
      right: parseFloat(supRight)
    },
    inf: { left: parseFloat(infLeft), right: parentWidth - parseFloat(infLeft) }
  };
};

const getClosestHandle = (xFromLeft, supOffset, infOffset) => {
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

const InputSlider = React.memo(
  React.forwardRef(function InputSlider(props, ref) {
    const {
      className,
      // Exclude from the `otherProps` property.
      /* eslint-disable */
      targetRef,
      height: rootHeight,
      onClick: onClickProp,
      /* eslint-enable */
      onChange,
      onMount,
      onDismount,
      step: stepProp,
      max: maxProp,
      min: minProp,
      width: rootWidth = 0,
      value: valueProp,
      defaultValue: defaultValueProp,
      onDragEnd: onDragEndProp,
      onDragStart: onDragStartProp,
      onDragging: onDraggingProp,
      variant: variantProp,
      fractionDigits = 4,
      disabled = false,
      ...otherProps
    } = props;

    const min = useConstantProp(minProp, 0, { componentName, propName: "min" });
    const max = useConstantProp(maxProp, 100, {
      componentName,
      propName: "max"
    });

    const step = useConstantProp(stepProp, undefined, {
      componentName,
      propName: "step"
    });

    const variant = useConstantProp(variantProp, "continuous", {
      componentName,
      propName: "variant"
    });

    const { current: isDiscrete } = React.useRef(variant === "discrete");
    const { current: stepsCount } = React.useRef(
      Math.floor(isDiscrete ? (max - min) / step + 1 : 0)
    );

    const bidirectionalCandidate =
      (Array.isArray(valueProp) && valueProp.length === 2) ||
      (Array.isArray(defaultValueProp) && defaultValueProp.length === 2);

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

    const { current: defaultValue } = React.useRef(
      valueProp != null
        ? undefined
        : defaultValueProp != null
        ? bidirectionalCandidate
          ? [
              clamp(defaultValueProp[0], min, max),
              clamp(defaultValueProp[1], min, max)
            ]
          : clamp(defaultValueProp, min, max)
        : 0
    );

    const [value, setValue] = useControlled(
      valueProp,
      defaultValue,
      componentName
    );

    const isBidirectional = useConstantProp(bidirectionalCandidate, false, {
      componentName,
      errorHandler: () => {
        return [
          `You are changing the ${
            isBidirectional ? "bi" : "uni"
          }directional state of ${componentName} to be ${
            isBidirectional ? "uni" : "bi"
          }bidirectional.`,
          "This behaviour is forbidden!" +
            "Do not change the `number` value to `number[]` (or vice versa)" +
            "after component being initialized!"
        ].join("\n");
      }
    });

    if (isBidirectional) {
      const inf = value[0];
      const sup = value[1];

      if (!(min <= inf && inf <= max) || !(min <= sup && sup <= max)) {
        throw new Error(
          `[Sonnat][${componentName}]: \`value\` and \`defaultValue\` props must be within range \`[${min}, ${max}]\`!`
        );
      }

      if (!(inf <= sup)) {
        throw new Error(
          `[Sonnat][${componentName}]: \`value[1]\` must be greater than or equal to \`value[0]\`!`
        );
      }

      if (inf < 0 || sup < 0) {
        throw new Error(
          `[Sonnat][${componentName}]: \`value\` accepts only positive numbers!`
        );
      }
    } else {
      if (!(min <= value && value <= max)) {
        throw new Error(
          `[Sonnat][${componentName}]: \`value\` and \`defaultValue\` props must be within range \`[${min}, ${max}]\`!`
        );
      }

      if (value < 0) {
        throw new Error(
          `[Sonnat][${componentName}]: \`value\` accepts only positive numbers!`
        );
      }
    }

    const parentRef = React.useRef();

    const supRef = React.useRef();
    const infRef = React.useRef();

    const trackRef = React.useRef();
    const stepsRef = React.useRef([]);

    const rootRefHandler = useForkRef(parentRef, ref);

    const isInitialRender = React.useRef(true);
    const isInitiated = React.useRef(false);

    const isMountedRef = useIsMounted();

    const [transitions, setTransitions] = React.useState(undefined);
    const [isDragStarted, setDragStarted] = React.useState(false);
    const [isClickAllowed, setClickAllowed] = React.useState(true);
    const [currentHandle, setCurrentHandle] = React.useState("sup");
    const [parentWidth, setParentWidth] = React.useState(rootWidth);

    const [infState, setInfState] = React.useState({
      active: false,
      currentX: 0,
      initialX: 0,
      offsetX: 0,
      zIndex: 1,
      left: 0
    });

    const [supState, setSupState] = React.useState({
      active: false,
      currentX: 0,
      initialX: 0,
      offsetX: 0,
      zIndex: 1,
      right: 0
    });

    const [trackState, setTrackState] = React.useState({
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

    // update parentWidth when resizeDetector detects any changes in width of the parent
    React.useEffect(() => {
      let newWidth = 0;

      if (isMountedRef.current && parentRef.current) {
        newWidth = parentRef.current.getBoundingClientRect().width;
      } else if (rootWidth) newWidth = rootWidth - 36;

      setParentWidth(newWidth);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rootWidth]);

    const prevParentWidth = usePreviousValue(parentWidth);
    const widthPerStep = parentWidth / (stepsCount - 1);

    const disableTransitions = () => {
      setTransitions("all 0ms ease");
    };

    const enableTransitions = () => {
      setTransitions(undefined);
    };

    const steps = React.useMemo(
      () =>
        isDiscrete
          ? createSteps(
              stepsCount,
              stepsRef.current,
              widthPerStep,
              classes.step
            )
          : null,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [widthPerStep, classes.step]
    );

    const calculateValue = track => {
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

    const updateHandles = (value, checkSteps = false) => {
      let supPos = 0;
      let infPos = 0;

      if (!isInitiated.current) isInitiated.current = true;

      if (isBidirectional) {
        supPos = map(value[1], min, max, parentWidth, 0);
        infPos = map(value[0], min, max, 0, parentWidth);
      } else {
        supPos = map(value, min, max, parentWidth, 0);
      }

      if (isDiscrete && checkSteps) {
        const supStepNumber = Math.round(
          map(supPos / step, 0, parentWidth / step, 0, stepsCount - 1)
        );
        const infStepNumber = Math.round(
          map(infPos / step, 0, parentWidth / step, 0, stepsCount - 1)
        );

        const supStepPosition = getStepPosition(
          supStepNumber,
          stepsRef.current
        );
        const infStepPosition = getStepPosition(
          infStepNumber,
          stepsRef.current
        );

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

    const onResize = () => {
      updateHandles(value, !isInitiated.current);
    };

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

    const clickListener = e => {
      const clientX = e.clientX;
      const isHandleClicked = e.target.closest(handleSelector) !== null;

      const parentRect = parentRef.current.getBoundingClientRect();
      const handleState = currentHandle === "sup" ? supState : infState;

      if (!handleState.active && !isHandleClicked) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = null;

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

        const otherHandle =
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
            map(finalCurrentX / step, 0, parentWidth / step, 0, stepsCount - 1)
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
          if (value[0] !== newValue[0] || value[1] !== newValue[1]) {
            if (onChange) onChange(e, newValue);
            setValue(newValue);
          }
        } else if (value !== newValue) {
          if (onChange) onChange(e, newValue);
          setValue(newValue);
        }
      }
    };

    const dragStart = e => {
      let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const rect = parentRef.current.getBoundingClientRect();
      const currentHandleName = getHandleName(
        e.target,
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
          onDragStartProp(e, {
            sup: { ...newSupState, element: supRef.current },
            inf: { ...newInfState, element: infRef.current },
            track: { ...trackState, element: trackRef.current }
          });
        }
      }
    };

    const dragEnd = e => {
      enableTransitions();

      const [handleState, handleStateUpdater] =
        currentHandle === "sup"
          ? [supState, setSupState]
          : [infState, setInfState];

      if (handleState.active) {
        setDragStarted(false);
        setTimeout(() => setClickAllowed(true), 10);

        handleStateUpdater(state => ({
          ...state,
          active: false,
          initialX: state.currentX
        }));
      }

      if (onDragEndProp) {
        onDragEndProp(e, {
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

    const dragging = e => {
      const handleState = currentHandle === "sup" ? supState : infState;
      const otherHandleState = currentHandle === "sup" ? infState : supState;

      if (handleState.active) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;

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
              ? otherHandleState.left
              : otherHandleState.right
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
                Math.abs(finalCurrentX / step),
                0,
                parentWidth / step,
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
          if (value[0] !== newValue[0] || value[1] !== newValue[1]) {
            if (onChange) onChange(e, newValue);
            setValue(newValue);
          }
        } else if (value !== newValue) {
          if (onChange) onChange(e, newValue);
          setValue(newValue);
        }

        if (onDraggingProp) {
          onDraggingProp(e, {
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
    } = useIsFocusVisible();

    const {
      isFocusVisibleRef: isSupFocusVisibleRef,
      onBlur: handleSupBlurVisible,
      onFocus: handleSupFocusVisible,
      ref: supFocusVisibleRef
    } = useIsFocusVisible();

    const handleInfRef = useForkRef(infFocusVisibleRef, infRef);
    const handleSupRef = useForkRef(supFocusVisibleRef, supRef);

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

    const handleFocus = useEventCallback((event, handleType = "inf") => {
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
    });

    const handleBlur = useEventCallback((event, handleType = "inf") => {
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
    });

    const handleKeyDown = (event, handleType = "inf") => {
      if (event.target === event.currentTarget && !disabled) {
        let v;
        let newValue;

        const stepper = isDiscrete && step ? step : 1;

        const bounds = { min, max };

        if (handleType === "inf") {
          v = isBidirectional ? value[0] : value;
          bounds.max = isBidirectional ? value[1] : max;
        } else if (handleType === "sup") {
          v = isBidirectional ? value[1] : value;
          bounds.min = isBidirectional ? value[0] : min;
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
          let _v;
          let isUniqueValue = false;

          if (handleType === "inf") {
            _v = isBidirectional ? [newValue, value[1]] : newValue;
          } else if (handleType === "sup") {
            _v = isBidirectional ? [value[0], newValue] : newValue;
          }

          if (isBidirectional) {
            isUniqueValue = value[0] !== _v[0] || value[1] !== _v[1];
          } else {
            isUniqueValue = value !== _v;
          }

          if (isUniqueValue) {
            disableTransitions();
            updateHandles(_v, isDiscrete);
            setValue(_v);
          }
        }
      }
    };

    const handleKeyUp = useEventCallback(event => {
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
        element: document,
        eventName: "touchend",
        listener: dragEnd,
        options: { passive: false }
      });
      useEventListener({
        element: document,
        eventName: "mouseup",
        listener: dragEnd,
        options: { passive: false }
      });
      useEventListener(
        {
          element: document,
          eventName: "touchmove",
          listener: dragging,
          options: { passive: false }
        },
        isDragStarted
      );
      useEventListener(
        {
          element: document,
          eventName: "mousemove",
          listener: dragging,
          options: { passive: false }
        },
        isDragStarted
      );
      /* eslint-enable react-hooks/rules-of-hooks */
    }

    return (
      <div
        tabIndex={-1}
        ref={rootRefHandler}
        onClick={e => {
          if (isClickAllowed) {
            clickListener(e);
            if (onClickProp) onClickProp(e);
          }
        }}
        className={clx(classes.root, className, {
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
                className={clx(classes.infHandle, classes.handle, {
                  [classes.focusVisible]: isInfFocusVisible
                })}
                style={{
                  left: `${infState.left}px`,
                  zIndex: `${infState.zIndex}`,
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
              className={clx(classes.supHandle, classes.handle, {
                [classes.focusVisible]: isSupFocusVisible
              })}
              style={{
                right: `${supState.right}px`,
                zIndex: `${supState.zIndex}`,
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
  })
);

InputSlider.displayName = componentName;

InputSlider.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  fractionDigits: PropTypes.number,
  width: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
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
  onDismount: PropTypes.func,
  variant: PropTypes.oneOf(allowedVariants)
};

export default withResizeDetector(InputSlider, {
  handleWidth: true,
  skipOnMount: true,
  handleHeight: false,
  refreshMode: "debounce",
  refreshRate: 250
});

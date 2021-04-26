import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import { withResizeDetector } from "react-resize-detector";
import Icon from "../Icon";
import {
  useEventListener,
  closest,
  clamp,
  map,
  useForkRef,
  useControlled,
  usePreviousValue,
  useConstantProp
} from "../utils";
import makeStyles from "../styles/makeStyles";
import { changeColor } from "../styles/colorUtils";

const componentName = "InputSlider";

const allowedVariants = ["continuous", "discrete"];

const TRANSITION_DURATION_IN_MILIS = 160;

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      hacks,
      mixins: { useFontIconSize },
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
        "&:hover:after": {
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
        ...useFontIconSize(16),
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
      /* eslint-disable no-unused-vars, react/prop-types */
      targetRef,
      height: rootHeight,
      onClick: onClickProp,
      /* eslint-enable no-unused-vars, react/prop-types */
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
    const supHandleRef = React.useRef();
    const infHandleRef = React.useRef();
    const trackRef = React.useRef();
    const stepsRef = React.useRef([]);

    const rootRefHandler = useForkRef(parentRef, ref);

    const isInitialRender = React.useRef(true);
    const isInitiated = React.useRef(false);

    const [transitions, setTransitions] = React.useState("");
    const [isMounted, setMounted] = React.useState(false);
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

    const localClass = useStyles();
    const handleSelector = `.${localClass.handle}`;

    React.useEffect(() => {
      setMounted(true);
      if (onMount) onMount();
      return () => {
        setMounted(false);
        if (onDismount) onDismount();
      };
    }, [onMount, onDismount]);

    // update parentWidth when resizeDetector detects any changes in width of the parent
    React.useEffect(() => {
      let newWidth = 0;

      if (isMounted && parentRef.current) {
        newWidth = parentRef.current.getBoundingClientRect().width;
      } else if (rootWidth) newWidth = rootWidth - 36;

      setParentWidth(newWidth);
    }, [isMounted, rootWidth]);

    const prevParentWidth = usePreviousValue(parentWidth);
    const widthPerStep = parentWidth / (stepsCount - 1);

    const disableTransitions = () => {
      setTransitions("all 0ms ease");
    };

    const enableTransitions = () => {
      setTransitions("");
    };

    const steps = React.useMemo(
      () =>
        isDiscrete
          ? createSteps(
              stepsCount,
              stepsRef.current,
              widthPerStep,
              localClass.step
            )
          : null,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [widthPerStep, localClass.step]
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
      if (isMounted && parentWidth && parentWidth !== prevParentWidth) {
        if (!isInitialRender.current) {
          setTimeout(() => {
            onResize();
          }, TRANSITION_DURATION_IN_MILIS);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, parentWidth, prevParentWidth]);

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
        supHandleRef.current,
        infHandleRef.current
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
            sup: { ...newSupState, element: supHandleRef.current },
            inf: { ...newInfState, element: infHandleRef.current },
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
            element: supHandleRef.current
          },
          inf: {
            ...(currentHandle === "inf"
              ? { ...infState, active: false, initialX: infState.currentX }
              : infState),
            element: infHandleRef.current
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
              element: supHandleRef.current
            },
            inf: {
              ...infState,
              currentX: finalCurrentX,
              offsetX: finalCurrentX,
              left: Math.abs(finalCurrentX),
              element: infHandleRef.current
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
        ref={rootRefHandler}
        onClick={e => {
          if (isClickAllowed) {
            clickListener(e);
            if (onClickProp) onClickProp(e);
          }
        }}
        className={createClass(localClass.root, className, {
          [localClass.disabled]: disabled,
          [localClass[variant]]: allowedVariants.includes(variant)
        })}
        {...otherProps}
      >
        <div className={localClass.wrapper}>
          <div className={localClass.steps}>{steps}</div>
          <div className={localClass.interval}>
            <div
              ref={supHandleRef}
              onTouchStart={dragStart}
              onMouseDown={dragStart}
              className={createClass(localClass.supHandle, localClass.handle)}
              style={{
                right: `${supState.right}px`,
                zIndex: `${supState.zIndex}`,
                transition: transitions
              }}
            >
              <button className={localClass.handleCircle}>
                {isBidirectional && (
                  <Icon
                    identifier="chevron-left"
                    className={localClass.handleIcon}
                  />
                )}
              </button>
            </div>
            <div
              ref={trackRef}
              className={localClass.track}
              style={{
                left: `${trackState.left}px`,
                right: `${trackState.right}px`,
                transition: transitions
              }}
            ></div>
            {isBidirectional && (
              <div
                ref={infHandleRef}
                onTouchStart={dragStart}
                onMouseDown={dragStart}
                className={createClass(localClass.infHandle, localClass.handle)}
                style={{
                  left: `${infState.left}px`,
                  zIndex: `${infState.zIndex}`,
                  transition: transitions
                }}
              >
                <button className={localClass.handleCircle}>
                  <Icon
                    identifier="chevron-right"
                    className={localClass.handleIcon}
                  />
                </button>
              </div>
            )}
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

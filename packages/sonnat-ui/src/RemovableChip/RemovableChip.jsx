"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var classnames_1 = __importDefault(require("classnames"));
var prop_types_1 = __importDefault(require("prop-types"));
var React = __importStar(require("react"));
var Close_1 = __importDefault(require("../internals/icons/Close"));
var utils_1 = require("../utils");
var styles_1 = __importDefault(require("./styles"));
var allowedVariants = ["filled", "outlined"];
var allowedSizes = ["large", "medium", "small"];
var allowedColors = ["default", "primary", "secondary"];
var RemovableChipBase = function (props, ref) {
    var _a, _b;
    var className = props.className, label = props.label, leadingIcon = props.leadingIcon, onRemove = props.onRemove, _c = props.rounded, rounded = _c === void 0 ? false : _c, _d = props.disabled, disabled = _d === void 0 ? false : _d, _e = props.variant, variantProp = _e === void 0 ? "filled" : _e, _f = props.color, colorProp = _f === void 0 ? "default" : _f, _g = props.size, sizeProp = _g === void 0 ? "medium" : _g, otherProps = __rest(props, ["className", "label", "leadingIcon", "onRemove", "rounded", "disabled", "variant", "color", "size"]);
    var classes = styles_1.default();
    var size = utils_1.getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));
    var color = utils_1.getVar(colorProp, "default", !allowedColors.includes(colorProp));
    var variant = utils_1.getVar(variantProp, "filled", !allowedVariants.includes(variantProp));
    var removeHandler = function (e) {
        if (!disabled && onRemove)
            onRemove(e);
    };
    var _h = utils_1.useIsFocusVisible(), isFocusVisibleRef = _h.isFocusVisibleRef, handleBlurVisible = _h.onBlur, handleFocusVisible = _h.onFocus, focusVisibleRef = _h.ref;
    var removeRef = React.useRef();
    var handleRemoveRef = utils_1.useForkedRefs(focusVisibleRef, removeRef);
    var _j = React.useState(false), focusVisible = _j[0], setFocusVisible = _j[1];
    if (disabled && focusVisible) {
        setFocusVisible(false);
    }
    React.useEffect(function () {
        isFocusVisibleRef.current = focusVisible;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusVisible]);
    var handleFocus = utils_1.useEventCallback(function (event) {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!removeRef.current)
            removeRef.current = event.currentTarget;
        handleFocusVisible(event);
        if (isFocusVisibleRef.current === true)
            setFocusVisible(true);
    });
    var handleBlur = utils_1.useEventCallback(function (event) {
        handleBlurVisible(event);
        if (isFocusVisibleRef.current === false)
            setFocusVisible(false);
    });
    return label ? (<div aria-disabled={disabled ? "true" : "false"} ref={ref} className={classnames_1.default(className, classes.root, classes[size], classes[variant], classes[utils_1.camelCase(variant + "-" + color)], (_a = {},
            _a[classes.rounded] = rounded,
            _a[classes.disabled] = disabled,
            _a))} {...otherProps}>
      {leadingIcon && <i className={classnames_1.default(classes.icon)}>{leadingIcon}</i>}
      {label}
      <button aria-label={"Remove the chip with " + label + " text"} ref={handleRemoveRef} className={classnames_1.default(classes.removeButton, (_b = {},
            _b[classes.focusVisible] = focusVisible,
            _b))} onClick={removeHandler} onFocus={handleFocus} onBlur={handleBlur} disabled={disabled} tabIndex={disabled ? -1 : 0}>
        <i className={classnames_1.default(classes.removeButtonIcon)}>
          <Close_1.default />
        </i>
      </button>
    </div>) : null;
};
var RemovableChip = React.forwardRef(RemovableChipBase);
RemovableChip.propTypes = {
    label: prop_types_1.default.string.isRequired,
    leadingIcon: prop_types_1.default.node,
    className: prop_types_1.default.string,
    rounded: prop_types_1.default.bool,
    disabled: prop_types_1.default.bool,
    color: prop_types_1.default.oneOf(allowedColors),
    variant: prop_types_1.default.oneOf(allowedVariants),
    size: prop_types_1.default.oneOf(allowedSizes),
    onRemove: prop_types_1.default.func,
    onFocus: prop_types_1.default.func,
    onBlur: prop_types_1.default.func,
    onKeyDown: prop_types_1.default.func,
    onKeyUp: prop_types_1.default.func
};
exports.default = RemovableChip;

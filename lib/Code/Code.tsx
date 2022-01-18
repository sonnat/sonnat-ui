import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface CodeBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Determine whether the component is code-block or not.
   *
   * If `true`, the component will be rendered as a `<pre>` element.
   * otherwise, the component will be rendered as a `<code>` element.
   * @default false
   */
  codeBlock?: boolean;
}

export type CodeProps = MergeElementProps<"pre", CodeBaseProps>;

type Component = {
  (props: CodeProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CodeProps> | undefined;
  displayName?: string | undefined;
};

const CodeBase = (props: CodeProps, ref: React.Ref<HTMLPreElement>) => {
  const { className, children, codeBlock = false, ...otherProps } = props;

  const classes = useStyles();

  const RootNode = codeBlock ? "pre" : "code";

  return (
    <RootNode
      ref={ref}
      className={c(classes.root, className, {
        [classes.codeBlock]: codeBlock
      })}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
};

const Code = React.forwardRef(CodeBase) as Component;

Code.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  codeBlock: PropTypes.bool
};

export default Code;

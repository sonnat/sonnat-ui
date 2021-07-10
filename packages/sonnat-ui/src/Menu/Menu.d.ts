import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * An HTML element, or a function that returns one.
   * It's used to set the position of the menu.
   */
  // eslint-disable-next-line no-unused-vars
  anchorNode?: null | Element | ((element: Element) => Element);
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The placement of the menu. (start from "left" or "right") */
  placement?: "left" | "right";
  /** The `min-width` property of the menu. */
  minWidth?: number;
  /** The `placeholder` property of the search field. */
  searchPlaceholder?: string;
  /** The empty statement text when search results are empty. */
  searchEmptyStatementText?: string;
  /**
   * If `true`, the menu will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the menu will be searchable.
   * @default false
   */
  searchable?: boolean;
  /**
   * If `true`, the menu will block the page's scrolling.
   * @default false
   */
  preventPageScrolling?: boolean;
  /**
   * If `true`, the menu will appear denser.
   * @default false
   */
  dense?: boolean;
  /**
   * If `true`, the menu will be open.
   * @default false
   */
  open?: boolean;
  /** The Callback fires when the menu has opened. */
  onOpen?: () => void;
  /** The Callback fires when the menu has closed. */
  onClose?: () => void;
  /**
   * The Callback fires when user has clicked outside of the menu.
   *
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onOutsideClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /**
   * The Callback fires when the user has clicked,
   * and determines whether the click occured outside of the menu or not.
   *
   * It only fires when the menu is open!
   *
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event The event source of the callback.
   */
  outsideClickDetector?: (
    // eslint-disable-next-line no-unused-vars
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => boolean;
};

export type MenuProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const Menu: (props: MenuProps) => JSX.Element;

export default Menu;

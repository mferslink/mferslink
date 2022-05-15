import * as React from "react";
import { SVGProps } from "react";

const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="menu_svg__icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    {...props}
  >
    <path d="M510.436 67.96c-245.429 0-444.383 198.954-444.383 444.374 0 245.42 198.954 444.373 444.383 444.373 245.41 0 444.373-198.953 444.373-444.373-.001-245.42-198.963-444.374-444.373-444.374zm0 833.196c-214.744 0-388.832-174.088-388.832-388.822 0-214.744 174.089-388.832 388.832-388.832 214.732 0 388.822 174.088 388.822 388.832 0 214.734-174.09 388.822-388.822 388.822zm155.593-571.8H337.41c-15.117 0-27.385 15.602-27.385 34.844 0 19.26 12.268 34.862 27.385 34.862h328.62c15.124 0 27.375-15.603 27.375-34.862-.001-19.242-12.25-34.845-27.376-34.845zm0 156.835H337.41c-15.117 0-27.385 15.602-27.385 34.853s12.268 34.854 27.385 34.854h328.62c15.124 0 27.375-15.602 27.375-34.854-.001-19.251-12.25-34.853-27.376-34.853zm0 139.413H337.41c-15.117 0-27.385 15.603-27.385 34.846 0 19.251 12.268 34.862 27.385 34.862h328.62c15.124 0 27.375-15.612 27.375-34.862-.001-19.243-12.25-34.846-27.376-34.846z" />
  </svg>
);

export default SvgMenu;
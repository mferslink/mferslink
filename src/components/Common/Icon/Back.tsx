import * as React from "react";
import { SVGProps } from "react";

const SvgBack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="back_svg__icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    {...props}
  >
    <path d="M395.215 513.605 718.351 201.23c19.053-18.416 19.053-48.273 0-66.66-19.054-18.417-49.911-18.417-68.965 0L291.752 480.29c-19.053 18.416-19.053 48.273 0 66.66l357.633 345.688c9.526 9.208 22.012 13.796 34.498 13.796 12.485 0 24.971-4.588 34.467-13.829 19.053-18.416 19.053-48.242 0-66.66L395.215 513.605z" />
  </svg>
);

export default SvgBack;

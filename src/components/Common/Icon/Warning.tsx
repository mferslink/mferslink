import * as React from "react";
import { SVGProps } from "react";

const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={14}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="warning_svg__a" d="M0 0h16v14H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="warning_svg__b" fill="#fff">
        <use xlinkHref="#warning_svg__a" />
      </mask>
      <path
        d="M15.918 13.095 8.522.302a.603.603 0 0 0-1.046 0L.08 13.095A.601.601 0 0 0 .6 14h14.798a.603.603 0 0 0 .52-.905ZM7.6 4.648h.8a.395.395 0 0 1 .392.429l-.403 4.206a.391.391 0 0 1-.78 0l-.4-4.195a.39.39 0 0 1 .391-.44Zm1.232 6.812a.3.3 0 0 1-.303.286H7.471a.3.3 0 0 1-.303-.286v-.819a.3.3 0 0 1 .303-.302h1.057a.3.3 0 0 1 .303.302v.82Z"
        fill="#DB3939"
        mask="url(#warning_svg__b)"
      />
    </g>
  </svg>
);

export default SvgWarning;

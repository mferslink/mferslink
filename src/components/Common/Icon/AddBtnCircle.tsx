import * as React from "react";
import { SVGProps } from "react";

const SvgAddBtnCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="addBtnCircle_svg__a" d="M0 0h20v20H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="addBtnCircle_svg__b" fill="#fff">
        <use xlinkHref="#addBtnCircle_svg__a" />
      </mask>
      <path
        d="M10 20C4.475 20-.002 15.522-.002 10c0-5.523 4.477-10 10-10S20 4.477 20 10c0 5.522-4.478 10-10 10Zm0-18.57A8.572 8.572 0 1 0 18.57 10 8.572 8.572 0 0 0 10 1.43Zm.714 12.856h-1.43v-3.571h-3.57v-1.43h3.57v-3.57h1.43v3.57h3.571v1.43h-3.571v3.571Z"
        fill="#3CB9FF"
        mask="url(#addBtnCircle_svg__b)"
      />
    </g>
  </svg>
);

export default SvgAddBtnCircle;

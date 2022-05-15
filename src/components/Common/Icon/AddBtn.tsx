import * as React from "react";
import { SVGProps } from "react";

const SvgAddBtn = (props: SVGProps<SVGSVGElement>) => (
  <svg width={64} height={40} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M10.256 0h43.488c3.567 0 4.86.371 6.163 1.069a7.27 7.27 0 0 1 3.024 3.024C63.63 5.396 64 6.689 64 10.256v19.488c0 3.567-.371 4.86-1.069 6.163a7.27 7.27 0 0 1-3.024 3.024C58.604 39.63 57.311 40 53.744 40H10.256c-3.567 0-4.86-.371-6.163-1.069a7.27 7.27 0 0 1-3.024-3.024C.37 34.604 0 33.311 0 29.744V10.256c0-3.567.371-4.86 1.069-6.163a7.27 7.27 0 0 1 3.024-3.024C5.396.37 6.689 0 10.256 0Z"
        fill="#3CB9FF"
      />
      <g fill="#FFF">
        <path d="M24 18h16a2 2 0 1 1 0 4H24a2 2 0 1 1 0-4Z" />
        <path d="M34 12v16a2 2 0 1 1-4 0V12a2 2 0 1 1 4 0Z" />
      </g>
    </g>
  </svg>
);

export default SvgAddBtn;

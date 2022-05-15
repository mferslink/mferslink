import * as React from "react";
import { SVGProps } from "react";

const SvgNotification = (props: SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd" opacity={0.25}>
      <path d="M0 0h32v32H0z" />
      <path
        d="M16 4c5.891 0 10.667 4.776 10.667 10.667v10.666H5.333V14.667C5.333 8.776 10.11 4 16 4ZM16 30.667a3.333 3.333 0 0 1-3.333-3.334v-2h6.666v2A3.333 3.333 0 0 1 16 30.667Z"
        stroke="#000"
        strokeWidth={2.667}
      />
      <path
        d="M16 1.333c.92 0 1.667.747 1.667 1.667v1h-3.334V3c0-.92.747-1.667 1.667-1.667Z"
        stroke="#000"
        strokeWidth={2.667}
        fill="#ADFF56"
      />
    </g>
  </svg>
);

export default SvgNotification;

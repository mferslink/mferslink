import * as React from "react";
import { SVGProps } from "react";

const SvgCollection = (props: SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd" opacity={0.25}>
      <path d="M0 0h32v32H0z" />
      <rect
        stroke="#000"
        strokeWidth={2.667}
        x={2.667}
        y={4}
        width={26.667}
        height={24}
        rx={2.667}
      />
      <circle fill="#000" cx={8} cy={10.667} r={2} />
      <circle fill="#000" cx={8} cy={16} r={2} />
      <path
        fill="#000"
        d="M26 9.333V12H11.333V9.333zM26 14.666v2.667H11.333v-2.667z"
      />
      <circle fill="#000" cx={8} cy={21.333} r={2} />
      <path fill="#000" d="M26 20v2.667H11.333V20z" />
    </g>
  </svg>
);

export default SvgCollection;

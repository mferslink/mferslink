import * as React from "react";
import { SVGProps } from "react";

const SvgHome = (props: SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd" opacity={0.25}>
      <path d="M0 0h32v32H0z" />
      <circle stroke="#000" strokeWidth={2.667} cx={16} cy={16} r={14.667} />
      <path
        d="M18.616 22.853a14.724 14.724 0 0 0 10.114-.249"
        stroke="#000"
        strokeWidth={2.667}
      />
      <circle fill="#000" cx={12.667} cy={16} r={4.667} />
      <circle fill="#000" cx={21.333} cy={13.333} r={2} />
      <circle fill="#000" cx={26.667} cy={13.333} r={2} />
      <path fill="#000" d="M11.333 1.333H14V16h-2.667z" />
    </g>
  </svg>
);

export default SvgHome;

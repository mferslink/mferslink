import * as React from "react";
import { SVGProps } from "react";

const SvgDownLoad = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="downLoad_svg__icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    {...props}
  >
    <path d="M704 341.333h64a64 64 0 0 1 64 64V768a64 64 0 0 1-64 64H256a64 64 0 0 1-64-64V405.333a64 64 0 0 1 64-64h64v64h-64V768h512V405.333h-64v-64zM549.205 129.067l.043 347.456 74.005-74.027 45.227 45.248-150.827 150.848-150.848-150.827 45.248-45.269 73.174 73.173V129.067h64z" />
  </svg>
);

export default SvgDownLoad;

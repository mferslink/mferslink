import * as React from "react";
import { SVGProps } from "react";

const SvgUploadImg = (props: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={16} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="#000" fillRule="evenodd">
      <path d="M18.353 0H1.647C.737 0 0 .727 0 1.623v12.754C0 15.273.738 16 1.647 16h16.706c.91 0 1.647-.727 1.647-1.623V1.623C20 .727 19.262 0 18.353 0ZM1.647 1.195h16.706c.242 0 .434.189.434.428v8.503l-3.88-3.395a.616.616 0 0 0-.769-.03l-4.82 3.564L6.76 8.473a.599.599 0 0 0-.697 0l-4.851 3.385V1.623c0-.24.192-.428.434-.428Zm16.706 13.61H1.647a.428.428 0 0 1-.434-.428v-1.055l5.204-3.624 4.892 3.435c.273.189.657.129.849-.14a.597.597 0 0 0-.142-.836l-1.667-1.165 4.123-3.047 4.174 3.654c.04.04.09.06.141.09v2.688a.428.428 0 0 1-.434.428Z" />
      <path d="M6.013 7.169c1.395 0 2.527-1.116 2.527-2.49 0-1.373-1.132-2.489-2.527-2.489-1.394 0-2.526 1.116-2.526 2.49 0 1.373 1.132 2.489 2.526 2.489Zm0-3.784c.728 0 1.314.578 1.314 1.295 0 .716-.586 1.294-1.314 1.294A1.302 1.302 0 0 1 4.7 4.68c0-.717.587-1.295 1.314-1.295Z" />
    </g>
  </svg>
);

export default SvgUploadImg;
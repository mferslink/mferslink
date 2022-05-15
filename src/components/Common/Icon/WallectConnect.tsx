import * as React from "react";
import { SVGProps } from "react";

const SvgWallectConnect = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="wallectConnect_svg__a" d="M0 0h32v20H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="wallectConnect_svg__b" fill="#fff">
        <use xlinkHref="#wallectConnect_svg__a" />
      </mask>
      <path
        d="M6.55 3.908c5.219-5.21 13.68-5.21 18.899 0l.628.627a.663.663 0 0 1 0 .943l-2.149 2.145a.334.334 0 0 1-.472 0l-.865-.863c-3.64-3.635-9.543-3.635-13.184 0l-.926.924a.334.334 0 0 1-.472 0L5.86 5.54a.664.664 0 0 1 0-.943l.69-.688Zm23.342 4.436 1.912 1.909a.664.664 0 0 1 0 .943l-8.622 8.609a.67.67 0 0 1-.945 0l-6.12-6.11a.167.167 0 0 0-.236 0l-6.12 6.11a.67.67 0 0 1-.944 0L.194 11.196a.664.664 0 0 1 0-.943l1.912-1.91c.261-.26.684-.26.945 0l6.12 6.11c.066.065.17.065.236 0l6.12-6.11a.669.669 0 0 1 .944 0l6.12 6.11c.066.066.17.066.236 0l6.12-6.11a.669.669 0 0 1 .945 0Z"
        fill="#3B99FC"
        mask="url(#wallectConnect_svg__b)"
      />
    </g>
  </svg>
);

export default SvgWallectConnect;

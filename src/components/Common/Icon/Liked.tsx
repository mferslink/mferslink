import * as React from "react";
import { SVGProps } from "react";

const SvgLiked = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={15}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="liked_svg__a" d="M0 0h16v14.667H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="liked_svg__b" fill="#fff">
        <use xlinkHref="#liked_svg__a" />
      </mask>
      <path
        d="M8 14.667a1.65 1.65 0 0 1-1.19-.504l-5.3-5.426C-.438 6.743-.513 3.52 1.343 1.55A4.853 4.853 0 0 1 4.855 0h.047c1.141 0 2.222.393 3.097 1.117A4.806 4.806 0 0 1 11.143 0a4.853 4.853 0 0 1 3.513 1.549c1.855 1.97 1.78 5.194-.167 7.188l-5.302 5.426A1.65 1.65 0 0 1 8 14.667Z"
        fill="#FF5085"
        mask="url(#liked_svg__b)"
      />
    </g>
  </svg>
);

export default SvgLiked;

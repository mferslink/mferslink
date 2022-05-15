import * as React from "react";
import { SVGProps } from "react";

const SvgEmoj = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="emoj_svg__a" d="M0 0h20v20H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g>
        <mask id="emoj_svg__b" fill="#fff">
          <use xlinkHref="#emoj_svg__a" />
        </mask>
        <path
          fill="#000"
          mask="url(#emoj_svg__b)"
          d="M18.677 15.891h.005v-.03zM17.074 2.926c-3.901-3.901-10.249-3.901-14.15 0-3.901 3.9-3.901 10.248 0 14.148 3.901 3.901 10.249 3.901 14.15 0 3.901-3.9 3.901-10.248 0-14.148m-1.016 13.133c-3.34 3.341-8.778 3.34-12.119 0-3.341-3.341-3.341-8.777 0-12.118C7.28.6 12.717.6 16.06 3.94c3.34 3.34 3.34 8.778 0 12.118"
        />
      </g>
      <path
        d="M6.878 8.946a1.078 1.078 0 1 0-.003-2.156 1.078 1.078 0 0 0 .003 2.156M13.082 8.948a1.08 1.08 0 0 0 0-2.156 1.079 1.079 0 0 0 0 2.156M13.12 12.565l-.059.02a7.413 7.413 0 0 1-3.077.659c-1.11 0-2.16-.225-3.122-.666l-.058-.018c-.036-.01-.085-.024-.146-.024a.64.64 0 0 0-.64.639c0 .167.078.335.208.461l-.008.04.164.073a8.831 8.831 0 0 0 3.61.793 8.653 8.653 0 0 0 3.617-.8.643.643 0 0 0 .334-.563c0-.413-.373-.752-.823-.614"
        fill="#000"
      />
    </g>
  </svg>
);

export default SvgEmoj;
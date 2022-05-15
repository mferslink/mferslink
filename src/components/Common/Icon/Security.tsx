import * as React from "react";
import { SVGProps } from "react";

const SvgSecurity = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={16}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="security_svg__a" d="M0 0h12v16H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="security_svg__b" fill="#fff">
        <use xlinkHref="#security_svg__a" />
      </mask>
      <path
        d="M11.327 2s-.897 0-2.355-.571C7.402.857 6.448.229 6.448.229L6 0l-.392.229s-1.01.628-2.524 1.2C1.57 1.943.728 2 .728 2l-.73.057v7.886C-.001 12.857 5.327 16 6 16 6.616 16 12 12.857 12 9.943V2.057L11.327 2Zm-5.72 9.086L2.803 8.457l.841-1.086L5.44 9.03l3.364-4.286 1.01.971-4.206 5.372Z"
        fill="#6CC584"
        mask="url(#security_svg__b)"
      />
    </g>
  </svg>
);

export default SvgSecurity;

import * as React from "react";
import { SVGProps } from "react";

const SvgTwiter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={40}
    height={40}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="twiter_svg__a" d="M0 0h40v40H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g>
        <mask id="twiter_svg__b" fill="#fff">
          <use xlinkHref="#twiter_svg__a" />
        </mask>
        <path
          d="M-.003 20c0 11.046 8.955 20 20.002 20C31.045 40 40 31.046 40 20S31.045 0 19.999 0C8.952 0-.003 8.954-.003 20Z"
          fill="#00BDF3"
          mask="url(#twiter_svg__b)"
        />
      </g>
      <path
        d="M29.586 15.493v-.64a9.866 9.866 0 0 0 2.413-2.746c-.91.434-1.89.705-2.893.8a5.92 5.92 0 0 0 2.253-2.894c-1 .61-2.088 1.06-3.226 1.334a4.281 4.281 0 0 0-3.547-1.774 5.054 5.054 0 0 0-4.988 5.094c-.032.45.023.903.16 1.333a14.494 14.494 0 0 1-10.307-5.667 6.068 6.068 0 0 0-.653 2.574 5.227 5.227 0 0 0 2.267 4.52c-.79-.04-1.56-.26-2.254-.64a5.414 5.414 0 0 0 4 5.333 4 4 0 0 1-1.333.16 2.04 2.04 0 0 1-.96-.16 4.987 4.987 0 0 0 4.667 3.707A9.574 9.574 0 0 1 9.13 28H7.998a13.12 13.12 0 0 0 7.413 2.413c9.175.054 14.175-8 14.175-14.92Z"
        fill="#FFF"
      />
    </g>
  </svg>
);

export default SvgTwiter;

import * as React from "react";
import { SVGProps } from "react";

const SvgReply = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="reply_svg__a" d="M0 0h16v16H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g>
        <mask id="reply_svg__b" fill="#fff">
          <use xlinkHref="#reply_svg__a" />
        </mask>
        <path
          d="M6.139 16a.56.56 0 0 1-.554-.627l.11-.886a1.303 1.303 0 0 0-1.292-1.464H2.417A2.422 2.422 0 0 1 0 10.604V2.418A2.422 2.422 0 0 1 2.417-.001h11.164A2.422 2.422 0 0 1 16 2.418v8.186a2.422 2.422 0 0 1-2.419 2.42h-2.744c-.277 0-.542.085-.766.248l-3.604 2.621A.558.558 0 0 1 6.14 16ZM2.417 1.115c-.718 0-1.302.585-1.302 1.303v8.186c0 .718.584 1.303 1.302 1.303h1.986a2.42 2.42 0 0 1 2.418 2.349l2.594-1.887a2.403 2.403 0 0 1 1.422-.462h2.744c.718 0 1.303-.585 1.303-1.303V2.418c0-.718-.585-1.303-1.303-1.303H2.417Z"
          fillOpacity={0.848}
          fill="#22232A"
          mask="url(#reply_svg__b)"
        />
      </g>
      <path
        d="M3.162 6.511a.93.93 0 1 0 1.86 0 .93.93 0 0 0-1.86 0ZM6.883 6.511a.93.93 0 1 0 1.86 0 .93.93 0 0 0-1.86 0ZM10.976 6.511a.93.93 0 1 0 1.861 0 .93.93 0 0 0-1.86 0Z"
        fillOpacity={0.848}
        fill="#22232A"
      />
    </g>
  </svg>
);

export default SvgReply;

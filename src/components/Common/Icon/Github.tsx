import * as React from "react";
import { SVGProps } from "react";

const SvgGithub = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={40}
    height={39}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="github_svg__a" d="M0 0h40v39H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="github_svg__b" fill="#fff">
        <use xlinkHref="#github_svg__a" />
      </mask>
      <path
        d="M19.999 0C8.953 0-.003 8.95-.003 19.994c0 8.833 5.732 16.329 13.678 18.972 1 .184 1.368-.434 1.368-.963 0-.476-.019-2.051-.027-3.722-5.566 1.21-6.74-2.36-6.74-2.36-.91-2.31-2.22-2.925-2.22-2.925-1.815-1.24.138-1.216.138-1.216 2.007.142 3.065 2.06 3.065 2.06 1.784 3.057 4.68 2.174 5.82 1.663.18-1.292.698-2.174 1.27-2.674-4.442-.505-9.113-2.22-9.113-9.881 0-2.183.782-3.966 2.062-5.367-.208-.504-.893-2.537.194-5.291 0 0 1.68-.537 5.501 2.05A19.202 19.202 0 0 1 20 9.665c1.699.007 3.411.23 5.01.673 3.818-2.586 5.494-2.049 5.494-2.049 1.09 2.754.404 4.787.197 5.291 1.282 1.4 2.059 3.184 2.059 5.367 0 7.679-4.68 9.37-9.134 9.866.718.62 1.357 1.837 1.357 3.702 0 2.676-.024 4.829-.024 5.487 0 .533.36 1.156 1.374.96C34.276 36.316 40 28.825 40 19.993 40 8.952 31.044 0 19.999 0Z"
        fill="#000"
        mask="url(#github_svg__b)"
      />
    </g>
  </svg>
);

export default SvgGithub;

import * as React from "react";
import { SVGProps } from "react";

const SvgQuestion = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="question_svg__a" d="M0 0h16v16H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="question_svg__b" fill="#fff">
        <use xlinkHref="#question_svg__a" />
      </mask>
      <path
        d="M10.8 6.107c-.04.726-.26 1.293-1.374 2.4-.56.56-.92.986-.953 1.333a.56.56 0 0 1-.56.507h-.054a.56.56 0 0 1-.506-.614A3.613 3.613 0 0 1 8.666 7.72c1.007-1.007 1.027-1.333 1.04-1.667a1.447 1.447 0 0 0-.413-1.08 1.754 1.754 0 0 0-1.294-.546 1.68 1.68 0 0 0-1.68 1.68.563.563 0 0 1-1.126 0 2.807 2.807 0 0 1 2.806-2.774 2.887 2.887 0 0 1 2.094.894c.482.503.738 1.183.707 1.88Zm-2.9 6.56a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334ZM8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8Z"
        fill="#FFC250"
        mask="url(#question_svg__b)"
      />
    </g>
  </svg>
);

export default SvgQuestion;

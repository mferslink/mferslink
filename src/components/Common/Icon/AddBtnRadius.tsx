import * as React from "react";
import { SVGProps } from "react";

const SvgAddBtnRadius = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="addBtnRadius_svg__icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    {...props}
  >
    <path
      d="M511.984 64C264.976 64 64 264.96 64 512.016 64 759.024 264.976 960 511.984 960 759.056 960 960 759.024 960 512.016 960 264.944 759.024 64 511.984 64z"
      fill="#62b7f9"
      data-spm-anchor-id="a313x.7781069.0.i25"
      className="addBtnRadius_svg__selected"
    />
    <path
      d="M695.76 552.16H552.144v143.536A40.224 40.224 0 0 1 512 735.936a40.256 40.256 0 0 1-40.128-40.24v-143.52H328.24a40.208 40.208 0 1 1 0-80.4h143.632V328.192a40.16 40.16 0 1 1 80.288 0V471.76h143.616a40.208 40.208 0 1 1 0 80.416z"
      fill="#fff"
      data-spm-anchor-id="a313x.7781069.0.i20"
    />
  </svg>
);

export default SvgAddBtnRadius;

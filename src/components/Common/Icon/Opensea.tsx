import * as React from "react";
import { SVGProps } from "react";

const SvgOpensea = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={22}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path id="opensea_svg__a" d="M0 0h24v22H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="opensea_svg__b" fill="#fff">
        <use xlinkHref="#opensea_svg__a" />
      </mask>
      <path
        d="m1.427 12.562.082-.134L6.575 4.36a.172.172 0 0 1 .304.022c.845 1.93 1.575 4.333 1.233 5.828-.146.615-.545 1.449-.996 2.218a4.601 4.601 0 0 1-.189.329.172.172 0 0 1-.144.078h-5.21a.173.173 0 0 1-.153-.092.179.179 0 0 1 .007-.181Z"
        fill="#000"
        mask="url(#opensea_svg__b)"
      />
      <path
        d="M23.999 14.064v1.274a.185.185 0 0 1-.107.168c-.393.17-1.734.8-2.294 1.59C20.175 19.113 19.087 22 16.655 22H6.508c-3.601-.007-6.515-2.985-6.51-6.652v-.12c0-.097.078-.176.174-.176H5.83c.11 0 .194.106.182.218-.039.38.032.765.203 1.106a1.988 1.988 0 0 0 1.784 1.128h2.801V15.28H8.031a.177.177 0 0 1-.157-.098.184.184 0 0 1 .012-.187c.03-.048.065-.096.101-.152.262-.379.635-.966 1.007-1.637.254-.453.502-.934.699-1.42.04-.088.073-.177.105-.265.052-.156.109-.299.148-.445.041-.121.073-.25.105-.37a5.87 5.87 0 0 0 .133-1.3c0-.18-.007-.36-.024-.54a7.132 7.132 0 0 0-.056-.58 6.157 6.157 0 0 0-.078-.516 8.886 8.886 0 0 0-.159-.776l-.022-.099c-.049-.175-.088-.344-.143-.522a20.05 20.05 0 0 0-.533-1.605c-.07-.203-.15-.396-.23-.59-.119-.29-.239-.556-.347-.806a11.485 11.485 0 0 1-.154-.322c-.053-.12-.109-.238-.166-.355-.04-.088-.085-.17-.117-.251l-.342-.645a.114.114 0 0 1 .01-.124.11.11 0 0 1 .115-.04l2.142.59h.005l.007.003.282.08.31.09.115.032V1.133c0-.626.491-1.133 1.1-1.133.292 0 .573.119.778.33.207.215.322.503.322.803v1.923l.227.066a.168.168 0 0 1 .053.024l.237.185c.08.066.166.145.271.227.319.264.63.541.928.83.348.33.738.717 1.11 1.145.106.12.21.244.31.37.105.13.215.26.31.388.126.17.262.347.38.533.055.087.12.177.174.265.152.235.286.476.414.72.055.112.11.235.158.352.142.326.253.655.326.986.022.07.037.144.046.218v.016c.023.099.032.202.04.307.048.488-.011.981-.173 1.443-.05.138-.098.282-.159.421a5.46 5.46 0 0 1-.432.829 4.793 4.793 0 0 1-.18.3c-.069.104-.142.2-.207.297-.088.122-.182.25-.277.365-.085.12-.174.24-.27.347-.128.156-.26.31-.395.46-.081.097-.167.191-.256.28-.085.1-.173.187-.254.268a9.51 9.51 0 0 1-.34.33l-.219.206a.18.18 0 0 1-.118.044H13v2.227h2.144c.48 0 .936-.173 1.304-.492.125-.111.675-.596 1.326-1.328a.167.167 0 0 1 .083-.05l5.921-1.745a.173.173 0 0 1 .153.03.18.18 0 0 1 .07.141l-.001.003Z"
        fill="#000"
        mask="url(#opensea_svg__b)"
      />
    </g>
  </svg>
);

export default SvgOpensea;

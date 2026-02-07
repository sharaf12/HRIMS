import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="https://www.vecteezy.com/vector-art/20190500-nvidia-logo-vector-nvidia-icon-free-vector"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 88h-32.89l-67.43 80H101l35.48-42.17L168 168V88Zm-8 71.25L138.33 128l-26.66 31.25Z" />
      </g>
    </svg>
  );
}

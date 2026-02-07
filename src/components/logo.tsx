import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path fill="hsl(var(--primary))" d="m436.3 952.7h-307.4V71.3h307.4v142.6h-172.7v216.4h161.8v142.6h-161.8v237.2h172.7z"/>
        <path fill="hsl(var(--primary))" d="M901.7 512 538.6 133.6v756.8z"/>
        <path fill="hsl(var(--accent))" d="M527.8 512 890.8 890.4V133.6z"/>
    </svg>
  );
}

import React from 'react';

export const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M11 2c-2.5 1.5-2.5 4.5 0 6" />
        <path d="M13 2c2.5 1.5 2.5 4.5 0 6" />
        <path d="M4 12c-1.5 1.5-1.5 3.5 0 5s3.5 1.5 5 0" />
        <path d="M20 12c1.5 1.5 1.5 3.5 0 5s-3.5 1.5-5 0" />
        <path d="M7 19c-1-2-1-4 0-6" />
        <path d="M17 19c1-2 1-4 0-6" />
        <path d="M12 22v-4" />
        <path d="M12 14c-1.5-1.5-1.5-3.5 0-5" />
        <path d="M12 14c1.5-1.5 1.5-3.5 0-5" />
    </svg>
);

export const FaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

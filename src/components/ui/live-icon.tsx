import React from 'react';

const LiveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49"></path>
    <path d="M7.76 7.76a6 6 0 0 0 0 8.49"></path>
    <path d="M18.36 5.64a9 9 0 0 1 0 12.73"></path>
    <path d="M5.64 5.64a9 9 0 0 0 0 12.73"></path>
  </svg>
);

export default LiveIcon;

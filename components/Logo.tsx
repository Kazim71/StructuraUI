export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="transparent" />
      <path
        d="M65 35H45C39.4772 35 35 39.4772 35 45C35 50.5228 39.4772 55 45 55H55C60.5228 55 65 59.4772 65 65C65 70.5228 60.5228 75 55 75H35"
        stroke="#3f403c"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="75" cy="25" r="8" fill="#3f403c" />
    </svg>
  );
}

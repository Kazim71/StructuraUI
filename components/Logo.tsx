export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Geometric S */}
      <path d="M 45 25 H 20 C 11.71 25 5 31.71 5 40 C 5 48.29 11.71 55 20 55 H 35 C 43.29 55 50 61.71 50 70 C 50 78.29 43.29 85 35 85 H 5" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* tructura */}
      <text x="60" y="85" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="72" fill="currentColor" letterSpacing="-1">tructura</text>
      {/* Geometric U */}
      <path d="M 365 25 V 65 C 365 76.04 374.04 85 385 85 C 395.96 85 405 76.04 405 65 V 25" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* I */}
      <text x="420" y="85" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="72" fill="currentColor">I</text>
    </svg>
  );
}

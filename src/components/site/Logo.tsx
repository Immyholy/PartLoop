import { Link } from "@tanstack/react-router";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-11" }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="PartLoop home"
      className="inline-flex items-center gap-0 no-underline"
    >
      {/* PartLoop P Symbol */}
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} aspect-square w-auto shrink-0`}
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="13"
          fill="#EAF8E8"
        />

        <path
          d="M17 36V15C17 12.8 18.8 11 21 11H27C32.5 11 36 14.8 36 20C36 25.2 32.5 29 27 29H17"
          fill="none"
          stroke="#173D35"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M29 6C37 7.5 42 14 42 22"
          fill="none"
          stroke="#56C66D"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M36 19L42 25L45 17"
          fill="none"
          stroke="#56C66D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark: P is already in the symbol */}
      <span className="-ml-0.5 whitespace-nowrap text-xl font-extrabold leading-none tracking-tight text-slate-900">
        art<span className="text-green-600">Loop</span>
      </span>
    </Link>
  );
}
interface LogoProps {
  className?: string;
  animated?: boolean;
}

export function Logo({ className = "w-32 h-32", animated = false }: LogoProps) {
  return (
    <div className={`${className} ${animated ? 'animate-spin-slow' : ''}`}>
      <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        {/* Circular logo */}
        <g transform="translate(100, 40)">
          {/* Yellow segment */}
          <path
            d="M 0,-30 A 30,30 0 0,1 21.2,-21.2"
            fill="none"
            stroke="#F5A623"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Orange segment */}
          <path
            d="M 21.2,-21.2 A 30,30 0 0,1 30,0"
            fill="none"
            stroke="#E67E22"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Blue segment */}
          <path
            d="M 30,0 A 30,30 0 0,1 0,30"
            fill="none"
            stroke="#4A5FA0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Purple segment */}
          <path
            d="M 0,30 A 30,30 0 0,1 -30,0"
            fill="none"
            stroke="#6B2D5C"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Dark purple segment */}
          <path
            d="M -30,0 A 30,30 0 0,1 -21.2,-21.2"
            fill="none"
            stroke="#4A1942"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Yellow connecting segment */}
          <path
            d="M -21.2,-21.2 A 30,30 0 0,1 0,-30"
            fill="none"
            stroke="#FDB813"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
        
        {/* OASYS text */}
        <text
          x="100"
          y="85"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="#6B2D5C"
          textAnchor="middle"
        >
          OASYS
        </text>
      </svg>
    </div>
  );
}

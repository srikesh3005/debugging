import logoImage from '../img/image.png';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export function Logo({ className = "w-32 h-32", animated = false }: LogoProps) {
  return (
    <div className={className}>
      <img 
        src={logoImage} 
        alt="OASYS Logo" 
        className={`w-full h-full object-contain ${animated ? 'animate-spin-slow' : ''}`}
      />
    </div>
  );
}

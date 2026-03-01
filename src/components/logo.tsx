import Image from 'next/image';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`} {...props}>
      <Image
        src="/logo-cropped.png"
        alt="FurniVision Logo"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}

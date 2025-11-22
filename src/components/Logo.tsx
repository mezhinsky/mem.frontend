import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/image.png"
        alt="MosEisley Models"
        width={64}
        height={64}
        priority
        className="h-auto w-auto"
      />
    </Link>
  );
};

export default Logo;

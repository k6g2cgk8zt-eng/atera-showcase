import Image from "next/image";

type MediaImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function MediaImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
}: MediaImageProps) {
  const remote = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized={remote}
      sizes={sizes}
      className={className}
    />
  );
}

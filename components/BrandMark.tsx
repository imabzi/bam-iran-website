import Image from "next/image";

// The official BAM Iran logo (public/brand/Logo.png): the emblem, the
// ornament and the BAM wordmark, on a transparent background. Always shown
// whole and at its own proportions: never cropped, stretched or recoloured.
// Size it by height in CSS; the width follows.
export const brandLogo = { src: "/brand/Logo.png", width: 1371, height: 1611 } as const;

export function BrandMark({
  className,
  alt = "",
  priority = false,
  sizes = "120px",
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={brandLogo.src}
      width={brandLogo.width}
      height={brandLogo.height}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={className ? `brand-mark ${className}` : "brand-mark"}
      draggable={false}
    />
  );
}

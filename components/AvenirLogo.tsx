import Image from "next/image";

type AvenirLogoProps = {
  size?: number;
};

export function AvenirLogo({ size = 40 }: AvenirLogoProps) {
  return (
    <Image
      src="/uploads/logo.svg"
      alt="Avenir Facility Management"
      width={2048}
      height={1622}
      unoptimized
      style={{
        height: size,
        width: "auto",
        display: "block",
        maxHeight: size,
      }}
    />
  );
}

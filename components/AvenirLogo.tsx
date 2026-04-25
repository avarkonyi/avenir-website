type AvenirLogoProps = {
  size?: number;
};

export function AvenirLogo({ size = 40 }: AvenirLogoProps) {
  return (
    <img
      src="/uploads/logo.svg"
      alt="Avenir Facility Management"
      style={{
        height: size,
        width: "auto",
        display: "block",
        maxHeight: size,
      }}
    />
  );
}

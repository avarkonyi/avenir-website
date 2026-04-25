type AvenirLogoProps = {
  size?: number;
  dark?: boolean;
};

export function AvenirLogo({ size = 40, dark = false }: AvenirLogoProps) {
  return (
    <img
      src="/uploads/logo.png"
      alt="Avenir Facility Management"
      style={{
        height: size,
        width: "auto",
        display: "block",
        maxHeight: size,
        filter: dark
          ? "none"
          : "drop-shadow(0 0 4px rgba(255,255,255,1)) drop-shadow(0 0 8px rgba(255,255,255,0.8))",
      }}
    />
  );
}

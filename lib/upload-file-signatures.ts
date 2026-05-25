const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46] as const;
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff] as const;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46] as const;
const WEBP_SIGNATURE = [0x57, 0x45, 0x42, 0x50] as const;

export function hasPdfSignature(bytes: Uint8Array): boolean {
  return startsWithBytes(bytes, PDF_SIGNATURE);
}

export function imageSignatureMatchesMime(bytes: Uint8Array, mime: string): boolean {
  if (mime === "image/jpeg") {
    return startsWithBytes(bytes, JPEG_SIGNATURE);
  }

  if (mime === "image/png") {
    return startsWithBytes(bytes, PNG_SIGNATURE);
  }

  if (mime === "image/webp") {
    return (
      startsWithBytes(bytes, RIFF_SIGNATURE) &&
      startsWithBytes(bytes.subarray(8), WEBP_SIGNATURE)
    );
  }

  return false;
}

function startsWithBytes(bytes: Uint8Array, signature: readonly number[]): boolean {
  if (bytes.length < signature.length) {
    return false;
  }

  return signature.every((byte, index) => bytes[index] === byte);
}

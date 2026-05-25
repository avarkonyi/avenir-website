import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasPdfSignature,
  imageSignatureMatchesMime,
} from "./upload-file-signatures";

describe("upload file signature validation", () => {
  it("accepts only buffers starting with %PDF for PDF uploads", () => {
    assert.equal(hasPdfSignature(Buffer.from("%PDF-1.7")), true);
    assert.equal(hasPdfSignature(Buffer.from("%PDE-1.7")), false);
    assert.equal(hasPdfSignature(Buffer.from("%PD")), false);
  });

  it("requires JPEG magic bytes for image/jpeg", () => {
    assert.equal(
      imageSignatureMatchesMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), "image/jpeg"),
      true,
    );
    assert.equal(
      imageSignatureMatchesMime(Buffer.from([0xff, 0xd8, 0x00, 0xe0]), "image/jpeg"),
      false,
    );
  });

  it("requires PNG magic bytes for image/png", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.equal(imageSignatureMatchesMime(png, "image/png"), true);
    assert.equal(imageSignatureMatchesMime(png, "image/jpeg"), false);
  });

  it("requires RIFF and WEBP markers for image/webp", () => {
    const webp = Buffer.from([
      0x52,
      0x49,
      0x46,
      0x46,
      0x01,
      0x02,
      0x03,
      0x04,
      0x57,
      0x45,
      0x42,
      0x50,
    ]);
    assert.equal(imageSignatureMatchesMime(webp, "image/webp"), true);
    assert.equal(imageSignatureMatchesMime(webp.subarray(0, 8), "image/webp"), false);
  });

  it("rejects unsupported image MIME values even with image-looking bytes", () => {
    assert.equal(
      imageSignatureMatchesMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), "image/svg+xml"),
      false,
    );
  });
});

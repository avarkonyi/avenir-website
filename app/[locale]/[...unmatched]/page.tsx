import { notFound } from "next/navigation";

// Keep unmatched paths inside the locale boundary. Next supplies the 404
// status and noindex metadata; existing concrete routes keep precedence.
export default function UnknownLocalePath() {
  notFound();
}

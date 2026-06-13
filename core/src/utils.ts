import type { ReactNode } from "react";

/**
 * Generates a URL-friendly slug from a string or React node.
 */
export function generateSlug(text: string | ReactNode | undefined): string {
  if (text === undefined) {
    return "";
  }
  
  const textString = typeof text === "string" 
    ? text 
    : String(text);

  return textString
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

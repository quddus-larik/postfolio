"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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
    .replace(/\s+/g, "-");
}


export function useActiveHeading() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = document.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id]"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveId(
            visible[0].target.getAttribute("id") || ""
          );
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return activeId;
}

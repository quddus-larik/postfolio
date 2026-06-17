"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { generateSlug } from "./utils";

export { generateSlug };

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

export function Content({
  code,
  components,
}: {
  code: string;
  components?: React.ComponentProps<
    ReturnType<typeof getMDXComponent>
  >["components"];
}) {
  const Render = React.useMemo(() => getMDXComponent(code), [code]);

  // eslint-disable-next-line react-hooks/static-components -- mdx-bundler creates a component from compiled MDX at runtime.
  return <Render components={components} />;
}

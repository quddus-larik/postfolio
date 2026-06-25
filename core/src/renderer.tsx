"use client";

import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";

export function Content({
  code,
  html,
  components,
}: {
  code?: string;
  html?: string;
  components?: Record<string, React.ComponentType<any>>;
}) {
  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (!code) return null;

  const Render = React.useMemo(() => getMDXComponent(code), [code]);
  return <Render components={components} />;
}

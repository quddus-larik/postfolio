"use client";

import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Content({
  code,
  markdown,
  components,
}: {
  code?: string;
  markdown?: string;
  components?: Record<string, React.ComponentType<any>>;
}) {
  if (markdown) {
    return (
      <Markdown remarkPlugins={[remarkGfm]} components={components as any}>
        {markdown}
      </Markdown>
    );
  }

  if (!code) return null;

  const Render = React.useMemo(() => getMDXComponent(code), [code]);
  return <Render components={components} />;
}

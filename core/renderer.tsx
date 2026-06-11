"use client";

/* eslint-disable react-hooks/static-components -- mdx-bundler creates a component from compiled MDX at runtime. */

import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";

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

  return <Render components={components} />;
}

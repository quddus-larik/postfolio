"use client";

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

  // eslint-disable-next-line react-hooks/static-components -- mdx-bundler creates a component from compiled MDX at runtime.
  return <Render components={components} />;
}

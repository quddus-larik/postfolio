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

  return <Render components={components} />;
}

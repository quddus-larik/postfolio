"use client";

import { type ComponentProps } from "react";

type HTMLProps = ComponentProps<"div">;
import { Typography } from "@heroui/react";
import { generateSlug } from "@postfolio/core/client";


export const components: any = {
  h1: ({ children }: HTMLProps) => (
    <Typography.Heading level={1} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  h2: ({ children }: HTMLProps) => (
    <Typography.Heading level={2} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  h3: ({ children }: HTMLProps) => (
    <Typography.Heading level={3} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  h4: ({ children }: HTMLProps) => (
    <Typography.Heading level={4} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  h5: ({ children }: HTMLProps) => (
    <Typography.Heading level={5} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  h6: ({ children }: HTMLProps) => (
    <Typography.Heading level={6} id={generateSlug(children)}>
      {children}
    </Typography.Heading>
  ),

  p: ({ children }: HTMLProps) => (
    <Typography.Paragraph size="sm" id={generateSlug(children)}>
      {children}
    </Typography.Paragraph>
  ),
};

"use client"
import { type ComponentProps } from "react";

type HTMLProps = ComponentProps<"div">;
import { Typography } from "@heroui/react";

export const components: any = {
  h1: ({ children }: HTMLProps) => (
    <Typography.Heading level={1}>
      {children}
    </Typography.Heading>
  ),

  h2: ({ children }: HTMLProps) => (
    <Typography.Heading level={2}>
      {children}
    </Typography.Heading>
  ),

  h3: ({ children }: HTMLProps) => (
    <Typography.Heading level={3}>
      {children}
    </Typography.Heading>
  ),

  h4: ({ children }: HTMLProps) => (
    <Typography.Heading level={4}>
      {children}
    </Typography.Heading>
  ),

  h5: ({ children }: HTMLProps) => (
    <Typography.Heading level={5}>
      {children}
    </Typography.Heading>
  ),

  h6: ({ children }: HTMLProps) => (
    <Typography.Heading level={6}>
      {children}
    </Typography.Heading>
  ),

  p: ({ children }: HTMLProps) => (
    <Typography.Paragraph size="sm">
      {children}
    </Typography.Paragraph>
  ),
};
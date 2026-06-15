"use client";

import { type ComponentProps } from "react";
import { Button, Typography, Surface, Separator } from "@heroui/react";
import { generateSlug } from "postfolio/client";
import { Copy } from "@phosphor-icons/react";

type HTMLProps = ComponentProps<"div">;

export const components: any = {
  h1: ({ children }: HTMLProps) => (
    <Typography.Heading level={1} id={generateSlug(children)} className="mt-8 mb-4">
      {children}
    </Typography.Heading>
  ),

  h2: ({ children }: HTMLProps) => (
    <Typography.Heading level={2} id={generateSlug(children)} className="mt-8 mb-4">
      {children}
    </Typography.Heading>
  ),

  h3: ({ children }: HTMLProps) => (
    <Typography.Heading level={3} id={generateSlug(children)} className="mt-6 mb-3">
      {children}
    </Typography.Heading>
  ),

  h4: ({ children }: HTMLProps) => (
    <Typography.Heading level={4} id={generateSlug(children)} className="mt-6 mb-2">
      {children}
    </Typography.Heading>
  ),

  p: ({ children }: HTMLProps) => (
    <Typography.Paragraph size="base" className="leading-relaxed mb-4">
      {children}
    </Typography.Paragraph>
  ),

  ul: ({ children }: HTMLProps) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-default-600">
      {children}
    </ul>
  ),

  ol: ({ children }: HTMLProps) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-default-600">
      {children}
    </ol>
  ),

  li: ({ children }: HTMLProps) => (
    <li className="text-sm md:text-base">
      {children}
    </li>
  ),

  blockquote: ({ children }: HTMLProps) => (
    <blockquote className="border-l-4 border-accent bg-accent/5 p-4 my-6 italic rounded-r-xl">
      {children}
    </blockquote>
  ),

  hr: () => <Separator className="my-8" />,

  code: ({ children }: HTMLProps) => (
    <Typography type="code" className="text-accent-foreground bg-transparent px-1.5 py-0.5 rounded-md text-sm">
      {children}
    </Typography>
  ),

  pre: ({ children }: any) => {
    // Extract code content if possible
    const code = children?.props?.children || "";
    
    return (
      <Surface variant="secondary" className="my-6 overflow-hidden rounded-xl border border-border group relative">
        <div className="flex items-center justify-between px-4 py-2 bg-default-50 border-b border-separator">
          <Typography className="text-xs font-mono text-muted">Code</Typography>
          <Button 
            isIconOnly 
            size="sm" 
            variant="ghost" 
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onPress={() => navigator.clipboard.writeText(code)}
          >
            <Copy size={14} />
          </Button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            {children}
          </pre>
        </div>
      </Surface>
    );
  },

  Snippet: ({ children }: { children: string }) => (
    <Surface className="my-4 px-6 py-4 flex items-center justify-between border border-border rounded-xl font-mono text-sm bg-surface overflow-hidden">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-accent shrink-0">$</span>
        <span className="truncate">{children}</span>
      </div>
      <Button 
        isIconOnly 
        variant="ghost" 
        size="sm" 
        className="shrink-0 ml-4"
        onPress={() => navigator.clipboard.writeText(children)}
      >
        <Copy size={16} />
      </Button>
    </Surface>
  ),
};

"use client";

import { type ComponentProps } from "react";
import { Button, Typography, Surface, Separator } from "@heroui/react";
import { generateSlug } from "postfolio/client";
import { CopyIcon } from "@phosphor-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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

  li: ({ children }: HTMLProps) => <li className="text-sm md:text-base">{children}</li>,

  blockquote: ({ children }: HTMLProps) => (
    <blockquote className="border-l-4 border-accent bg-accent/5 p-4 my-6 italic rounded-r-2xl">
      {children}
    </blockquote>
  ),

  hr: () => <Separator className="my-8" />,

  code: ({ children }: HTMLProps) => (
    <Typography
      type="code"
      className="text-accent-foreground bg-transparent px-1.5 py-0.5 rounded-md text-sm"
    >
      {children}
    </Typography>
  ),

  pre: ({ children }: any) => {
    const code = children?.props?.children || "";
    const className = children?.props?.className || "";
    const language = className.replace(/language-/, "") || "text";

    return (
      <div className="my-6 overflow-hidden rounded-2xl border border-border group relative">
        <div className="flex items-center justify-between px-4 py-2 bg-default-50 border-b border-separator">
          <Typography className="text-xs font-mono text-muted">{language}</Typography>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onPress={() => navigator.clipboard.writeText(code)}
          >
            <CopyIcon size={14} />
          </Button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },

  table: ({ children }: HTMLProps) => (
    <div className="table-root table-root--primary">
      <div className="table__scroll-container">
        <table className="table__content">{children}</table>
      </div>
    </div>
  ),

  thead: ({ children }: HTMLProps) => <thead className="table__header">{children}</thead>,
  tbody: ({ children }: HTMLProps) => <tbody className="table__body">{children}</tbody>,
  tr: ({ children, ...props }: any) => <tr className="table__row" {...props}>{children}</tr>,
  th: ({ children, ...props }: any) => <th className="table__column" {...props}>{children}</th>,
  td: ({ children, ...props }: any) => <td className="table__cell" {...props}>{children}</td>,

  Snippet: ({ children }: { children: string }) => (
    <Surface className="my-4 px-6 py-4 flex items-center justify-between border border-border rounded-2xl font-mono text-sm bg-surface overflow-hidden">
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
        <CopyIcon size={16} />
      </Button>
    </Surface>
  ),
};

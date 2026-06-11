"use client"

import { type ComponentProps } from "react";

type HTMLProps = ComponentProps<"div">;

const components = {
  // Headings
  h1: ({ children, ...rest }: HTMLProps) =>
    <h1 {...rest} className="text-5xl font-bold tracking-tight mb-4">{children}</h1>,

  h2: ({ children, ...rest }: HTMLProps) =>
    <h2 {...rest} className="text-3xl font-semibold tracking-tight mb-3 mt-6">{children}</h2>,

  h3: ({ children, ...rest }: HTMLProps) =>
    <h3 {...rest} className="text-2xl font-semibold mb-2 mt-5">{children}</h3>,

  h4: ({ children, ...rest }: HTMLProps) =>
    <h4 {...rest} className="text-xl font-semibold mb-2 mt-4">{children}</h4>,

  h5: ({ children, ...rest }: HTMLProps) =>
    <h5 {...rest} className="text-base font-semibold mb-1 mt-3">{children}</h5>,

  h6: ({ children, ...rest }: HTMLProps) =>
    <h6 {...rest} className="text-sm font-semibold mb-1 mt-3">{children}</h6>,

  // Text
  p: ({ children, ...rest }: HTMLProps) =>
    <p {...rest} className="text-base leading-7 mb-4">{children}</p>,

  blockquote: ({ children, ...rest }: HTMLProps) =>
    <blockquote
      {...rest}
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4"
    >
      {children}
    </blockquote>,

  // Lists
  ul: ({ children, ...rest }: HTMLProps) =>
    <ul {...rest} className="list-disc list-inside space-y-2 mb-4">{children}</ul>,

  ol: ({ children, ...rest }: HTMLProps) =>
    <ol {...rest} className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,

  li: ({ children, ...rest }: HTMLProps) =>
    <li {...rest} className="text-base">{children}</li>,

  // Links & images
  a: (props: ComponentProps<"a">) =>
    <a
      {...props}
      className="text-blue-600 underline decoration-blue-600 hover:text-blue-700"
    />,

  img: (props: ComponentProps<"img">) =>
    <img
      {...props}
      className="max-w-full rounded-lg my-6"
      alt={props.alt || ""}
    />,

  // Code
  code: ({ children, ...rest }: HTMLProps) =>
    <code
      {...rest}
      className="bg-gray-100 text-gray-900 rounded px-1 py-0.5 font-mono text-sm"
    >
      {children}
    </code>,

  pre: ({ children, ...rest }: HTMLProps) =>
    <pre
      {...rest}
      className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm"
    >
      {children}
    </pre>,

  // Tables
  table: ({ children, ...rest }: HTMLProps) =>
    <table
      {...rest}
      className="w-full border-collapse border mb-6"
    >
      {children}
    </table>,

  th: ({ children, ...rest }: HTMLProps) =>
    <th
      {...rest}
      className="border bg-gray-100 px-3 py-2 text-left font-semibold"
    >
      {children}
    </th>,

  td: ({ children, ...rest }: HTMLProps) =>
    <td {...rest} className="border px-3 py-2">{children}</td>,
};

export default components;
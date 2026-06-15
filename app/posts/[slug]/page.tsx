import { components } from "@/components/mdx-components";
import {
  Label,
  Button,
  Description,
  Separator,
  Chip,
  Avatar,
  ButtonGroup,
} from "@heroui/react";
import { MDXPost, Slugs, generateTOC } from "postfolio/server";
import { Content } from "postfolio/renderer"
import { notFound } from "next/navigation";
import { TableOfContents } from "@/components/table-of-contents";

export async function generateStaticParams() {
  const slugs = Slugs("content/blogs");

  return slugs.map((itm) => ({
    slug: itm,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await MDXPost(slug, "content/blogs");

  if (!post) {
    notFound();
  }
  const toc = generateTOC(post.raw);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-3">
      <div className="bg-background py-4 -mx-4 px-4 space-y-3">
        <div className="flex flex-row gap-3">
          <Avatar>
            <Avatar.Image src={post.frontmatter["avatar"]} alt="avatar" />
            <Avatar.Fallback>QL</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-1 justify-start">
            <Label>Written by</Label>
            <Description>{post.frontmatter.author}</Description>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-1 justify-start">
            <Label>At</Label>
            <Description>{post.frontmatter.date}</Description>
          </div>
        </div>
        <div className="flex flex-row gap-1 justify-start">
          {post.frontmatter.tags?.map((itm: any) => (
            <Chip size="sm" key={itm} variant="primary" color="accent">
              {itm}
            </Chip>
          ))}
        </div>
        <div className="flex flex-row gap-1 justify-between items-start">
          <div className="flex gap-2 items-center">
          <Button size="sm" variant="tertiary">Github</Button>
          <Button size="sm" variant="tertiary">Twitter X</Button>
          <Button size="sm" variant="tertiary">Instagram</Button>
          </div>
          <ButtonGroup variant="tertiary">
            <Button size="sm">Copy Markdown</Button>
            <Button size="sm">Open</Button>
          </ButtonGroup>
        </div>
        <TableOfContents toc={toc} />
      </div>
      <article className="space-y-3">
        <div className="h-32 w-full">
          <img
            src={post.frontmatter.cover}
            alt={post.frontmatter.title || "Post cover"}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
        <div className="my-6">
          <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
          <Description className="text-base">
            {post.frontmatter.description}
          </Description>
        </div>
        <Content components={components} code={post.code} />
        <Separator className="my-2" />
        <div className="flex flex-col gap-1 justify-start">
          <Label>Source</Label>
          <Description>{post.frontmatter.source}</Description>
        </div>
      </article>
    </div>
  );
}

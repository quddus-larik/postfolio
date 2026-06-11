import { components } from "@/components/mdx-components";
import {
  Label,
  ListBox,
  Surface,
  Select,
  Button,
  Typography,
  Description,
  Separator,
  Chip,
  Avatar,
  ButtonGroup,
} from "@heroui/react";
import { MDXPost, Slugs, generateTOC } from "@postfolio/core";
import { Content } from "@postfolio/core/renderer";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = Slugs();

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
  const post = await MDXPost(slug);

  if (!post) {
    notFound();
  }
  const toc = generateTOC(post.raw);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-3">
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
        {post.frontmatter.tags?.map((itm) => (
          <Chip variant="primary" color="accent">
            {itm}
          </Chip>
        ))}
      </div>
      <div className="flex flex-row gap-1 justify-between items-center">
        <Button size="sm" variant="outline">Github</Button>
        <ButtonGroup variant="tertiary">
          <Button size="sm">Copy Markdown</Button>
          <Button size="sm">Open</Button>
        </ButtonGroup>
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
      </article>

      <Surface
        className="flex min-w-[320px] gap-2 rounded-3xl p-3 fixed bottom-2 right-2"
        variant="tertiary"
      >
        <Select
          className="flex-1"
          placeholder="Table of content"
          aria-label="Table of contents"
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {toc.map((itm) => (
                <ListBox.Item
                  aria-label={itm.text}
                  key={itm.slug}
                  id={itm.slug}
                  href={`#${itm.slug}`}
                  textValue={itm.text}
                >
                  {itm.text}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <Button isIconOnly aria-label="Open options">
          O
        </Button>
      </Surface>
    </div>
  );
}

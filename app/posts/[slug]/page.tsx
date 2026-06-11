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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-3 bg-background">
      <div className="flex flex-row gap-3">
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
            <Chip variant="primary" color="accent" >{itm}</Chip>
          ))}
        </div>
      <article>
        <div className="my-4">
          <h1 className="text-4xl font-bold ">{post.frontmatter.title}</h1>
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
        <Select className="flex-1" placeholder="Table of content">
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {toc.map((itm) => (
                <ListBox.Item key={itm.slug} id={itm.slug} href={`#${itm.slug}`} textValue={itm.text}>
                  {itm.text}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <Button isIconOnly>O</Button>
      </Surface>
    </div>
  );
}

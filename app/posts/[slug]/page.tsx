import { components } from "@/components/mdx-components";
import {
  Label,
  Description,
  Separator,
  Avatar,
} from "@heroui/react";
import { MDXPost, Slugs, externalPosts, generateTOC } from "postfolio/server";
import { Content } from "postfolio/renderer";
import { notFound } from "next/navigation";
import { TableOfContents } from "@/components/table-of-contents";
import type { ExternalPostInput } from "postfolio/server";


const externalPostUrls: ExternalPostInput[] = [
  { 
    url: "https://dev.to/api/articles/quddus-larik/unexpected-ui-system-in-my-first-project-5478",
    extraFrontmatter: {
      
    }
  },
];

export async function generateStaticParams() {
  const localSlugs = await Slugs({ contentDir: "content/blogs", externalBlogs: externalPostUrls});
  return localSlugs.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await MDXPost(slug, {
    contentDir: "content/blogs",
    externalBlogs: externalPostUrls,
  });

  if (!post) {
    notFound();
  }

  const toc = generateTOC(post.raw);
  const coverImage = post.frontmatter.cover || post.frontmatter.cover_image;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-3">
      <div className="bg-background py-4 -mx-4 px-4 space-y-3">
        <div className="flex flex-row gap-3">
          <Avatar>
            <Avatar.Image
              src={post.frontmatter["avatar"] as string}
              alt="avatar"
            />
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

        <TableOfContents toc={toc} />
      </div>
      <article className="space-y-3">
        {coverImage && (
          <div className="h-32 w-full">
            <img
              src={coverImage as string}
              alt={post.frontmatter.title || "Post cover"}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        )}
        <div className="my-6">
          <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
          <Description className="text-base">
            {post.frontmatter.description}
          </Description>
        </div>
        <Content components={components} code={post.code} />
        <Separator className="my-2" />
        <div className="flex flex-row gap-2 items-center justify-start">
          <Label>Source</Label>
          
        </div>
      </article>
    </div>
  );
}

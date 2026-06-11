import components from "@/components/mdx-components";
import { MDXPost, Slugs } from "@postfolio/core";
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 md:py-12 bg-background">
      <article>
        <Content components={components} code={post.code} />
      </article>
    </div>
  );
}

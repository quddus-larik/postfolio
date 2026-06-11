
import components from "@/components/mdx-components";
import { MDXPost, Slugs } from "@postfolio/core";
import { Content } from "@postfolio/core/renderer";
import { notFound } from "next/navigation";


export async function generateStaticParams() {
  const slugs = Slugs();
 
  return slugs.map((itm) => ({
    slug: itm,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await MDXPost(slug);
  
  if (!post) {
    notFound();
  }
  
  return(
    <div className="flex flex-col items-center">
      <div className="min-w-md">
        <Content components={components} code={post.code} />
      </div>
    </div>
  )
}

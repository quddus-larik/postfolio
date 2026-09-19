import {notFound} from "next/navigation";
import {GithubContent} from "postfolio";
import {MDXRenderer} from "postfolio/renderer";
import mdxComponents from "@/components";
import {Typography, Chip} from "@heroui/react";

export async function generateStaticParams() {
    const posts = await GithubContent();

    return posts.map((post) => ({slug: post.slug}));
}

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const posts = await GithubContent();
    const post = posts.find((itm) => itm.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className={"px-60 py-16"}>
            <Typography.Heading level={2}>{post.meta.title}</Typography.Heading>
            <Typography.Paragraph>{post.meta.description}</Typography.Paragraph>
            <MDXRenderer content={post.content} components={mdxComponents}/>
        </main>
    );
}

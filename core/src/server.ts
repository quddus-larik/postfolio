import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

import { generateSlug } from "./utils";

export type BlogFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  [key: string]: string | string[] | boolean | undefined;
};

export type BlogPostSource = {
  slug: string;
  filename: string;
  filePath: string;
  mdx: string;
  frontmatter?: BlogFrontmatter;
};

type TOCItem = {
  level: number;
  text: string;
  slug: string;
};

export { generateSlug };

function transformFilenameToSlug(filename: string): string {
  return filename
    .replace(/\.mdx$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMdxFileNames(contentDir: string): string[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file: string) => file.endsWith(".mdx"));
}

function getPostSourceBySlug(
  slug: string,
  contentDir: string
): BlogPostSource | undefined {
  const resolvedDir = path.resolve(contentDir);

  const filename = getMdxFileNames(resolvedDir).find(
    (file) => transformFilenameToSlug(file) === slug
  );

  if (!filename) {
    return undefined;
  }

  const filePath = path.resolve(resolvedDir, filename);

  return {
    slug,
    filename,
    filePath,
    mdx: fs.readFileSync(filePath, "utf8"),
  };
}

export function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return [...content.matchAll(headingRegex)].map(([_, hashes, text]) => ({
    level: hashes.length,
    text: text.trim(),
    slug: generateSlug(text.trim()),
  }));
}

export function Slugs(contentDir: string): string[] {
  return getMdxFileNames(contentDir).map(transformFilenameToSlug);
}

export function Post(
  slug: string,
  contentDir: string
): BlogPostSource | undefined {
  return getPostSourceBySlug(slug, contentDir);
}

export async function allPosts(
  contentDir: string
): Promise<BlogPostSource[]> {
  return Slugs(contentDir)
    .map((slug) => getPostSourceBySlug(slug, contentDir))
    .filter((post): post is BlogPostSource => Boolean(post))
    .map((post) => {
      const { data: frontmatter } = matter(post.mdx);

      return {
        ...post,
        frontmatter,
      };
    });
}

type DevToArticle = {
  slug: string;
  url: string;
  body_markdown: string;
  title: string;
  description: string;
  published_at: string;
  tags: string[];
  cover_image?: string;
  user?: { name?: string };
  [key: string]: unknown;
};

function extractFrontmatter(article: DevToArticle): BlogFrontmatter {
  return {
    title: article.title,
    description: article.description,
    date: article.published_at,
    tags: article.tags,
    author: article.user?.name,
  };
}

function mapArticleToPostSource(
  article: DevToArticle,
  extraFrontmatter: object = {}
): BlogPostSource {
  return {
    slug: article.slug,
    filename: article.slug + ".mdx",
    filePath: article.url,
    mdx: article.body_markdown,
    frontmatter: {
      ...extractFrontmatter(article),
      ...extraFrontmatter,
    },
  };
}

export async function externalPosts(
  devtoUrl: string,
  extraFrontmatter: object = {}
): Promise<BlogPostSource[]> {
  const response = await fetch(devtoUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts from ${devtoUrl}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map((article) =>
      mapArticleToPostSource(article, extraFrontmatter)
    );
  }

  return [mapArticleToPostSource(data, extraFrontmatter)];
}

export async function MDXPost(
  slug: string,
  contentDir: string
) {
  const resolvedDir = path.resolve(contentDir);

  const post = getPostSourceBySlug(slug, resolvedDir);

  if (!post) {
    return undefined;
  }

  const { code, frontmatter } = await bundleMDX<BlogFrontmatter>({
    file: post.filePath,
    cwd: resolvedDir,
  });

  return {
    slug: post.slug,
    code,
    frontmatter,
    raw: post.mdx,
  };
}
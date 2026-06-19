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
  cover?: string;
  cover_image?: string;
  [key: string]: string | string[] | boolean | undefined;
};

export type BlogPostSource = {
  slug: string;
  filename: string;
  filePath: string;
  mdx: string;
  frontmatter?: BlogFrontmatter;
};

export type ExternalPostInput =
  | string
  | { url: string; extraFrontmatter?: object };

type TOCItem = {
  level: number;
  text: string;
  slug: string;
};

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

export { generateSlug };

// --- Local file helpers ---

function toSlug(filename: string): string {
  return filename
    .replace(/\.mdx$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMdxFiles(contentDir: string): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
}

function getLocalPost(slug: string, contentDir: string): BlogPostSource | undefined {
  const dir = path.resolve(contentDir);
  const file = getMdxFiles(dir).find((f) => toSlug(f) === slug);
  if (!file) return undefined;

  const filePath = path.resolve(dir, file);
  return { slug, filename: file, filePath, mdx: fs.readFileSync(filePath, "utf8") };
}

// --- External post helpers ---

function extractFrontmatter(article: DevToArticle): BlogFrontmatter {
  return {
    title: article.title,
    description: article.description,
    date: article.published_at,
    tags: article.tags,
    author: article.user?.name,
    cover_image: article.cover_image,
  };
}

function toPostSource(article: DevToArticle, extra: object = {}): BlogPostSource {
  return {
    slug: article.slug,
    filename: `${article.slug}.mdx`,
    filePath: article.url,
    mdx: article.body_markdown,
    frontmatter: { ...extractFrontmatter(article), ...extra },
  };
}

async function fetchExternalPost(input: ExternalPostInput): Promise<BlogPostSource> {
  const url = typeof input === "string" ? input : input.url;
  const extra = typeof input === "string" ? {} : (input.extraFrontmatter ?? {});

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch post from ${url}`);

  const article: DevToArticle = await res.json();
  return toPostSource(article, extra);
}

// --- Exported functions ---

export function generateTOC(content: string): TOCItem[] {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  return [...content.matchAll(regex)].map(([_, hashes, text]) => ({
    level: hashes.length,
    text: text.trim(),
    slug: generateSlug(text.trim()),
  }));
}

export function Slugs(contentDir: string): string[] {
  return getMdxFiles(contentDir).map(toSlug);
}

export function Post(slug: string, contentDir: string): BlogPostSource | undefined {
  return getLocalPost(slug, contentDir);
}

export async function allPosts(contentDir: string): Promise<BlogPostSource[]> {
  return Slugs(contentDir)
    .map((slug) => getLocalPost(slug, contentDir))
    .filter((p): p is BlogPostSource => Boolean(p))
    .map((p) => ({ ...p, frontmatter: matter(p.mdx).data as BlogFrontmatter }))
    .filter((p) => p.frontmatter?.draft !== true);
}

export async function externalPosts(inputs: ExternalPostInput[]): Promise<BlogPostSource[]> {
  const results = await Promise.all(inputs.map(fetchExternalPost));
  return results.filter((p) => p.frontmatter?.draft !== true);
}

export async function MDXPost(
  slug: string,
  options?: { contentDir?: string; externalBlogs?: ExternalPostInput[] }
) {
  const { contentDir, externalBlogs = [] } = options ?? {};

  if (contentDir) {
    const local = getLocalPost(slug, contentDir);
    if (local) {
      const { code, frontmatter } = await bundleMDX<BlogFrontmatter>({
        file: local.filePath,
        cwd: path.resolve(contentDir),
      });
      return { slug: local.slug, code, frontmatter, raw: local.mdx };
    }
  }

  if (externalBlogs.length > 0) {
    const posts = await externalPosts(externalBlogs);
    const external = posts.find((p) => p.slug === slug);
    if (external) {
      const { code, frontmatter } = await bundleMDX<BlogFrontmatter>({
        source: external.mdx,
        cwd: process.cwd(),
      });
      return { slug: external.slug, code, frontmatter, raw: external.mdx };
    }
  }

  return undefined;
}

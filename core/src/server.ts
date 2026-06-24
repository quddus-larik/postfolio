import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";
import { generateSlug } from "./utils";

// --- Types ---

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
  frontmatter: BlogFrontmatter;
};

export type ExternalPostInput =
  | string
  | { url: string; extraFrontmatter?: object };

type TOCItem = { level: number; text: string; slug: string };

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
};

export { generateSlug };

// --- Helpers ---

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

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f: string) => f.endsWith(".mdx"));
}

function getLocalPost(slug: string, contentDir: string): BlogPostSource | undefined {
  const dir = path.resolve(contentDir);
  const file = getMdxFiles(dir).find((f) => toSlug(f) === slug);
  if (!file) return undefined;
  const filePath = path.resolve(dir, file);
  const mdx = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter } = matter(mdx);
  return { slug, filename: file, filePath, mdx, frontmatter: frontmatter as BlogFrontmatter };
}

function toPostSource(article: DevToArticle, extra: object = {}): BlogPostSource {
  const frontmatter = {
    title: article.title,
    description: article.description,
    date: article.published_at,
    tags: article.tags,
    author: article.user?.name,
    type: "external",
    cover_image: article.cover_image,
    ...extra,
  };

  const mdx = `# ${article.title}\n\n${article.body_markdown}`;

  return {
    slug: article.slug,
    filename: `${article.slug}.mdx`,
    filePath: article.url,
    mdx,
    frontmatter,
  };
}

async function fetchExternalPost(input: ExternalPostInput): Promise<BlogPostSource> {
  const url = typeof input === "string" ? input : input.url;
  const extra = typeof input === "string" ? {} : (input.extraFrontmatter ?? {});
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch post from ${url}`);
  return toPostSource(await res.json(), extra);
}

function mdxOptions() {
  return {
    mdxOptions(options: any) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      return options;
    },
  };
}

async function bundleLocal(slug: string, contentDir: string) {
  const local = getLocalPost(slug, contentDir);
  if (!local) return undefined;
  const { code, frontmatter } = await bundleMDX<BlogFrontmatter>({ file: local.filePath, cwd: path.resolve(contentDir), ...mdxOptions() });
  return { slug: local.slug, code, frontmatter, raw: local.mdx };
}

async function bundleExternal(slug: string, externalBlogs: ExternalPostInput[]) {
  if (externalBlogs.length === 0) return undefined;
  const post = (await externalPosts(externalBlogs)).find((p) => p.slug === slug);
  if (!post) return undefined;
  const { code } = await bundleMDX<BlogFrontmatter>({ source: post.mdx, ...mdxOptions() });
  return { slug: post.slug, code, frontmatter: post.frontmatter, raw: post.mdx };
}

// --- Exported functions ---

export function generateTOC(content: string): TOCItem[] {
  return [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)].map(([_, hashes, text]) => ({
    level: hashes.length,
    text: text.trim(),
    slug: generateSlug(text.trim()),
  }));
}

export async function Slugs(
  options?: string | { contentDir?: string; externalBlogs?: ExternalPostInput[] }
): Promise<string[]> {
  const { contentDir, externalBlogs = [] } =
    typeof options === "string" ? { contentDir: options, externalBlogs: [] } : (options ?? {});

  const localSlugs = contentDir ? getMdxFiles(contentDir).map(toSlug) : [];
  if (externalBlogs.length === 0) return localSlugs;

  const externalSlugs = (await externalPosts(externalBlogs)).map((p) => p.slug);
  return [...externalSlugs, ...localSlugs];
}

export function Post(slug: string, contentDir: string): BlogPostSource | undefined {
  return getLocalPost(slug, contentDir);
}

export async function allPosts(contentDir: string): Promise<BlogPostSource[]> {
  return (await Slugs(contentDir))
    .map((slug) => getLocalPost(slug, contentDir))
    .filter((p): p is BlogPostSource => Boolean(p))
    .filter((p) => p.frontmatter.draft !== true);
}

export async function externalPosts(inputs: ExternalPostInput[]): Promise<BlogPostSource[]> {
  return (await Promise.all(inputs.map(fetchExternalPost))).filter((p) => p.frontmatter?.draft !== true);
}

export async function MDXPost(
  slug: string,
  options?: { contentDir?: string; externalBlogs?: ExternalPostInput[] }
) {
  const { contentDir, externalBlogs = [] } = options ?? {};
  return (contentDir ? await bundleLocal(slug, contentDir) : undefined) ?? (await bundleExternal(slug, externalBlogs));
}

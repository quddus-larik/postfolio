import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

import { generateSlug } from "./utils.js";

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
    .filter((file) => file.endsWith(".mdx"));
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
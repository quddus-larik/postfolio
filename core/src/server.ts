import "server-only";
import fs from "node:fs";
import path from "node:path";

import { bundleMDX } from "mdx-bundler";

let BLOG_DIR_PATH = path.join(process.cwd(), "content", "blogs");

export function setContentDirectory(newPath: string) {
  BLOG_DIR_PATH = newPath;
}

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
  frontmatter?: any;
};



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

function getMdxFileNames(): string[] {
  if (!fs.existsSync(BLOG_DIR_PATH)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR_PATH)
    .filter((file) => file.endsWith(".mdx"));
}

function getPostSourceBySlug(slug: string): BlogPostSource | undefined {
  const filename = getMdxFileNames().find(
    (file) => transformFilenameToSlug(file) === slug,
  );

  if (!filename) {
    return undefined;
  }

  const filePath = path.join(BLOG_DIR_PATH, filename);

  return {
    slug,
    filename,
    filePath,
    mdx: fs.readFileSync(filePath, "utf8"),
  };
}

type TOCItem = {
  level: number;
  text: string;
  slug: string;
};


export function generateSlug(text: string){
  return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
}

export function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return [...content.matchAll(headingRegex)].map((match) => {
    const level = match[1].length;
    const text = match[2].trim();

    return {
      level,
      text,
      slug: text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
    };
  });
}

export function Slugs(): string[] {
  return getMdxFileNames().map(transformFilenameToSlug);
}

export function Post(slug: string): BlogPostSource | undefined {
  return getPostSourceBySlug(slug);
}

export async function allPosts(): Promise<BlogPostSource[]> {


  const posts = Slugs()
    .map(getPostSourceBySlug)
    .filter((post): post is BlogPostSource => Boolean(post));

  return Promise.all(
    posts.map(async (post) => {
      const { frontmatter } = await bundleMDX<BlogFrontmatter | any>({
        file: post.filePath,
        cwd: BLOG_DIR_PATH,
      });
      return { ...post, frontmatter };
    })
  );
}

export async function MDXPost(slug: string) {
  const post = Post(slug);

  if (!post) {
    return undefined;
  }



  const { code, frontmatter } = await bundleMDX<BlogFrontmatter | any>({
    file: post.filePath,
    cwd: BLOG_DIR_PATH,
  });

  return {
    slug: post.slug,
    code,
    frontmatter,
    raw: post.mdx
  };
}

import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { createJiti } from "jiti";
import matter from "gray-matter";

export interface PostItem {
    name: string;
    slug: string;
    path: string;
    meta: Record<string, any>;
    content: string;
}

export async function PostfolioConfig() {
    const projectRoot = process.cwd();
    const configPath = path.resolve(/*turbopackIgnore: true*/ projectRoot, "postfolio.config.ts");

    if (!existsSync(configPath)) {
        throw new Error(`Config file not found at ${configPath}`);
    }

    const jiti = createJiti(import.meta.url, { cache: false });
    const configModule = (await jiti.import(configPath)) as any;

    const rawConfig = configModule.default || configModule.postfolioConfig || configModule;
    const configData = rawConfig.default || rawConfig;

    if (typeof configData !== "object" || configData === null) {
        throw new Error("postfolio.config.ts must export an object as default or 'postfolioConfig'");
    }

    return configData;
}

function toSlug(filename: string): string {
    return filename
        .replace(/\.(md|mdx)$/, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function LocalPosts(): Promise<PostItem[]> {
    const configData = await PostfolioConfig();

    if (!configData.localPosts?.dir) {
        throw new Error("Missing 'localPosts.dir' in postfolio.config.ts");
    }

    const projectRoot = process.cwd();
    const postsDir = path.resolve(/*turbopackIgnore: true*/ projectRoot, configData.localPosts.dir);
    if (!existsSync(postsDir)) {
        throw new Error(`postsDir not found at ${postsDir}`);
    }

    const entries = await fs.readdir(postsDir, { withFileTypes: true });
    const mdxFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

    const posts = await Promise.all(
        mdxFiles.map(async (entry) => {
            const filePath = path.join(postsDir, entry.name);
            const fileContent = await fs.readFile(filePath, "utf8");
            const { data, content } = matter(fileContent);

            return {
                name: entry.name,
                slug: toSlug(entry.name),
                path: filePath,
                meta: data,
                content: content,
            };
        })
    );

    return posts;
}

function convertToDevToApiUrl(inputUrl: string): string {
    const parsedUrl = new URL(inputUrl);

    let pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    pathSegments = pathSegments.filter(
        (segment) => segment !== "api" && segment !== "articles"
    );

    if (pathSegments.length < 2) {
        throw new Error(`Invalid dev.to article URL structure: ${inputUrl}`);
    }

    const [username, slug] = pathSegments;
    return `https://dev.to/api/articles/${username}/${slug}`;
}

export async function DevToPosts(): Promise<PostItem[]> {
    const configData = await PostfolioConfig();

    const urls: string[] = configData.devToPosts;

    if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error("Missing or invalid 'devToPosts' array in postfolio.config.ts");
    }

    const posts = await Promise.all(
        urls.map(async (url) => {
            const apiUrl = convertToDevToApiUrl(url);

            const response = await fetch(apiUrl, {
                headers: {
                    "User-Agent": "Postfolio-Fetcher",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch article from ${apiUrl}: ${response.status} ${response.statusText}`);
            }

            const article = await response.json();

            return {
                name: `${article.slug}.md`,
                slug: article.slug,
                path: article.url,
                meta: {
                    title: article.title,
                    description: article.description,
                    published_at: article.published_at,
                    cover_image: article.cover_image,
                    tags: article.tags,
                    canonical_url: article.canonical_url,
                    reading_time_minutes: article.reading_time_minutes,
                    user: article.user,
                },
                content: article.body_markdown || article.body_html || "",
            };
        })
    );

    return posts;
}

export async function GithubContent(): Promise<PostItem[]> {
    const configData = await PostfolioConfig();
    const urls: string[] = configData.githubContents;

    if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error("Missing or invalid 'githubContents' array in postfolio.config.ts");
    }

    function convertToGithubRawUrl(pathStr: string): string {
        return pathStr
            .replace("https://github.com/", "https://raw.githubusercontent.com/")
            .replace("/blob/", "/");
    }

    const posts = await Promise.all(
        urls.map(async (url) => {
            const rawUrl = convertToGithubRawUrl(url);
            const response = await fetch(rawUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch content from ${rawUrl}: ${response.status} ${response.statusText}`);
            }

            const rawText = await response.text();
            const { data, content } = matter(rawText);

            const fileName = url.split("/").pop() || "README.md";

            return {
                name: fileName,
                slug: toSlug(fileName),
                path: url,
                meta: {
                    title: data.title || fileName.replace(/\.(md|mdx)$/, ""),
                    ...data,
                },
                content: content,
            };
        })
    );

    return posts;
}
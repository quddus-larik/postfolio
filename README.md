# postfolio

**postfolio** is a plug-and-play toolkit to easily integrate blogs into your web-based portfolios. 

Whether you are a developer, designer, or creator, `postfolio` simplifies adding a full-featured blog section to your website. It provides out-of-the-box utility functions while letting you maintain complete control over your custom UI.

## Features

- **Plug and Play**: Effortlessly drop a blog into your existing portfolio site.
- **Custom UI Ready**: We provide the data and pre-built functions; you build the design exactly how you want it. 
- **Table of Contents**: Easily generate a Table of Contents (TOC) from your headings with our pre-built generator, and track scroll position using our client hooks.
- **Powered by `mdx-bundler`**: We leverage the actively maintained and highly capable `mdx-bundler` to parse and render your MDX content, giving you the ability to embed React components right inside your markdown files.
- **Customizable Source**: Store your markdown files anywhere! Customize the content directory path at runtime.
- **External Posts**: Fetch posts from external sources like Dev.to and merge them with your local content.

## Installation

```bash
npm install postfolio
# or
pnpm add postfolio
# or
yarn add postfolio
```

## Quick Start

### 1. Fetch and display posts

```tsx
// app/page.tsx
import { allPosts, externalPosts, Slugs } from "postfolio/server";

const externalBlogs = [
  "https://dev.to/api/articles/quddus-larik/my-post-12345",
];

export default async function HomePage() {
  // Get all slugs (local + external)
  const slugs = await Slugs({
    contentDir: "content/blogs",
    externalBlogs,
  });

  // Or fetch full posts
  const localPosts = await allPosts("content/blogs");
  const external = await externalPosts(externalBlogs);
  const posts = [...external, ...localPosts];
  
  return (
    <div>
      {posts.map(post => (
        <a key={post.slug} href={`/posts/${post.slug}`}>
          {post.frontmatter.title}
        </a>
      ))}
    </div>
  );
}
```

### 2. Render a single post

```tsx
// app/posts/[slug]/page.tsx
import { MDXPost, generateTOC } from "postfolio/server";
import { Content } from "postfolio/client";

const externalBlogs = [
  "https://dev.to/api/articles/quddus-larik/my-post-12345",
];

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await MDXPost(slug, {
    contentDir: "content/blogs",
    externalBlogs,
  });
  
  if (!post) return null;
  
  const toc = generateTOC(post.raw);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <Content components={{}} code={post.code} />
    </article>
  );
}
```

## External Posts

Fetch posts from external sources (Dev.to) and combine them with your local content.

```tsx
import { externalPosts } from "postfolio/server";

const posts = await externalPosts([
  // Simple URL string
  "https://dev.to/api/articles/quddus-larik/post-12345",
  
  // URL with extra frontmatter
  {
    url: "https://dev.to/api/articles/quddus-larik/post-67890",
    extraFrontmatter: { featured: true }
  }
]);
```

| Input Type | Description |
|------------|-------------|
| `string` | URL to the Dev.to article API endpoint |
| `{ url: string; extraFrontmatter?: object }` | URL with additional frontmatter to merge |

Posts with `draft: true` are automatically filtered out.

## MDXPost Options

`MDXPost` accepts an options object as the second parameter:

```ts
MDXPost(slug, options?)
```

| Option | Type | Description |
|--------|------|-------------|
| `contentDir` | `string` | Directory containing local MDX files |
| `externalBlogs` | `ExternalPostInput[]` | Array of external post URLs/configs |

```tsx
// Local only
await MDXPost(slug, { contentDir: "content/blogs" });

// External only
await MDXPost(slug, { externalBlogs: ["https://dev.to/api/..."] });

// Both (checks local first, then external)
await MDXPost(slug, {
  contentDir: "content/blogs",
  externalBlogs: ["https://dev.to/api/..."],
});
```

## Slugs Options

`Slugs` accepts the same options as `MDXPost`:

```ts
Slugs(options?)
```

| Option | Type | Description |
|--------|------|-------------|
| `contentDir` | `string` | Directory containing local MDX files |
| `externalBlogs` | `ExternalPostInput[]` | Array of external post URLs/configs |

```tsx
// Local only
const slugs = await Slugs("content/blogs");

// External only
const slugs = await Slugs({ externalBlogs: ["https://dev.to/api/..."] });

// Both (returns [...externalSlugs, ...localSlugs])
const slugs = await Slugs({
  contentDir: "content/blogs",
  externalBlogs: ["https://dev.to/api/..."],
});
```

## Client Hooks

```tsx
"use client";
import { useActiveHeading } from "postfolio/client";

export function TableOfContents({ toc }) {
  const activeId = useActiveHeading();
  
  return (
    <ul>
      {toc.map(item => (
        <li key={item.slug} style={{ fontWeight: activeId === item.slug ? 'bold' : 'normal' }}>
          <a href={`#${item.slug}`}>{item.text}</a>
        </li>
      ))}
    </ul>
  );
}
```

## API Reference

### Server (`postfolio/server`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `allPosts` | `(contentDir: string) => Promise<BlogPostSource[]>` | Get all MDX posts (excludes drafts) |
| `externalPosts` | `(inputs: ExternalPostInput[]) => Promise<BlogPostSource[]>` | Fetch external posts (excludes drafts) |
| `MDXPost` | `(slug: string, options?) => Promise<...>` | Get post with bundled MDX code |
| `Post` | `(slug: string, contentDir: string) => BlogPostSource \| undefined` | Get a single local post |
| `Slugs` | `(options?: string \| { contentDir?, externalBlogs? }) => Promise<string[]>` | Get all slugs (local + external) |
| `generateTOC` | `(content: string) => TOCItem[]` | Generate table of contents |
| `generateSlug` | `(text: string) => string` | Convert text to URL-friendly slug |

### Client (`postfolio/client`)

| Export | Description |
|--------|-------------|
| `Content` | Render bundled MDX content |
| `useActiveHeading` | Track which heading is currently in view |

### Types

| Type | Description |
|------|-------------|
| `BlogFrontmatter` | Frontmatter schema (`title`, `description`, `date`, `tags`, `author`, `draft`, `cover`, `cover_image`) |
| `BlogPostSource` | Blog post data (`slug`, `filename`, `filePath`, `mdx`, `frontmatter`) |
| `ExternalPostInput` | `string \| { url: string; extraFrontmatter?: object }` |
| `TOCItem` | Table of contents entry (`level`, `text`, `slug`) |

---

*Focus on your portfolio's design, and let postfolio handle the blogging engine.*

---
**Build with Love by Quddus Larek**

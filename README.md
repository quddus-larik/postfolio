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

1. Fetch your posts and render your blog index:

```tsx
// app/blog/page.tsx
import { allPosts } from "postfolio/server";

export default async function BlogIndex() {
  const posts = await allPosts("content/blogs");
  
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

2. Render MDX content and extract the Table of Contents:

```tsx
// app/posts/[slug]/page.tsx
import { MDXPost, generateTOC } from "postfolio/server";
import { Content } from "postfolio/client";

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await MDXPost(slug, "content/blogs");
  
  if (!post) return null;
  
  const toc = generateTOC(post.raw);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      
      {/* Pass your custom React components map here */}
      <Content components={{}} code={post.code} />
    </article>
  );
}
```

## External Posts

Fetch posts from external sources like Dev.to and combine them with your local content.

```tsx
// app/blog/page.tsx
import { allPosts, externalPosts } from "postfolio/server";

export default async function BlogIndex() {
  // Fetch local posts
  const localPosts = await allPosts("content/blogs");
  
  // Fetch external posts from Dev.to
  const external = await externalPosts([
    // Simple URL string
    "https://dev.to/api/articles/quddus-larik/post-slug-12345",
    
    // URL with extra frontmatter
    {
      url: "https://dev.to/api/articles/quddus-larik/another-post-67890",
      extraFrontmatter: { featured: true }
    }
  ]);
  
  // Combine and display
  const allPosts = [...external, ...localPosts];
  
  return (
    <div>
      {allPosts.map(post => (
        <a key={post.slug} href={`/posts/${post.slug}`}>
          {post.frontmatter.title}
        </a>
      ))}
    </div>
  );
}
```

### ExternalPostInput

Each element in the array can be:

| Type | Description |
|------|-------------|
| `string` | A URL to the Dev.to article API endpoint |
| `{ url: string; extraFrontmatter?: object }` | URL with additional frontmatter to merge |

The function automatically extracts `title`, `description`, `date`, `tags`, and `author` from the Dev.to response.

Posts with `draft: true` in frontmatter are automatically filtered out.

## Client Hooks

If you need a Table of Contents with an active scroll spy, you can import our client hooks to build interactive UI:

```tsx
"use client";
import { useActiveHeading } from "postfolio/client";

export function TableOfContents({ toc }) {
  // Automatically tracks which heading is currently visible on the screen
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

## Custom Components

Postfolio allows you to provide custom React components to render your MDX content. This is perfect for styling headings, images, and adding custom UI blocks like syntax-highlighted code snippets.

---

## API Reference

### Server Functions

| Function | Description |
|----------|-------------|
| `allPosts(contentDir)` | Get all MDX posts from a directory (excludes drafts) |
| `externalPosts(posts[])` | Fetch posts from external sources (excludes drafts) |
| `Post(slug, contentDir)` | Get a single post by slug |
| `MDXPost(slug, contentDir)` | Get a post with bundled MDX code |
| `Slugs(contentDir)` | Get all slugs from a directory |
| `generateTOC(content)` | Generate table of contents from markdown headings |
| `generateSlug(text)` | Convert text to a URL-friendly slug |

### Client Components

| Component/Hook | Description |
|----------------|-------------|
| `Content` | Render bundled MDX content |
| `useActiveHeading` | Track which heading is currently in view |

### Types

| Type | Description |
|------|-------------|
| `BlogFrontmatter` | Frontmatter schema for blog posts |
| `BlogPostSource` | Complete blog post data structure |
| `ExternalPostInput` | Input type for external posts |

---

*Focus on your portfolio's design, and let postfolio handle the blogging engine.*

---
**Build with Love by Quddus Larek**


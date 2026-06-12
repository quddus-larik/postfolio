# postfolio

**postfolio** is a plug-and-play toolkit to easily integrate blogs into your web-based portfolios. 

Whether you are a developer, designer, or creator, `postfolio` simplifies adding a full-featured blog section to your website. It provides out-of-the-box utility functions while letting you maintain complete control over your custom UI.

## Features

- **Plug and Play**: Effortlessly drop a blog into your existing portfolio site.
- **Custom UI Ready**: We provide the data and pre-built functions; you build the design exactly how you want it. 
- **Table of Contents**: Easily generate a Table of Contents (TOC) from your headings with our pre-built generator, and track scroll position using our client hooks.
- **Powered by `mdx-bundler`**: We leverage the actively maintained and highly capable `mdx-bundler` to parse and render your MDX content, giving you the ability to embed React components right inside your markdown files.
- **Customizable Source**: Store your markdown files anywhere! Customize the content directory path at runtime.

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
import path from "node:path";
import { setContentDirectory, allPosts } from "postfolio";

// Optionally set a custom directory for your markdown files
setContentDirectory(path.join(process.cwd(), "content", "blogs"));

export default async function BlogIndex() {
  const posts = await allPosts();
  
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
import { MDXPost, generateTOC } from "postfolio";
import { Content } from "postfolio/renderer";

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await MDXPost(slug);
  const toc = generateTOC(post.raw);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      
      {/* Pass your custom React components map here */}
      <Content components={{}} code={post.code} />
      
      {/* Build your custom TOC UI here using the generated `toc` array */}
    </article>
  );
}
```

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
        <li key={item.slug} className={activeId === item.slug ? 'font-bold' : ''}>
          <a href={`#${item.slug}`}>{item.text}</a>
        </li>
      ))}
    </ul>
  );
}
```

---

*Focus on your portfolio's design, and let postfolio handle the blogging engine.*

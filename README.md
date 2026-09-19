---
title: "Possfolio"
description: "A lightweight, plug-and-play adapter for MDX-based blogs and portfolios. It supports local MDX files, Dev.to, and GitHub Markdown, allowing you to integrate content seamlessly into your own UI design system."
---

### Features:

* **Multi-Source Content Fetching:** Seamlessly aggregates blog posts and markdown content from three distinct sources:
* **Local Files:** Parses local `.md` and `.mdx` content using frontmatter (`gray-matter`).
* **Dev.to:** Imports public Dev.to articles via their REST API while preserving your own design system.
* **GitHub:** Retrieves raw Markdown files directly from public GitHub repositories.

* **Unified Data Schema:** Normalizes diverse content sources into a single, standardized `PostItem` interface (`name`, `slug`, `path`, `meta`, `content`) for simple consumption in your UI.
* **UI & Design System Agnostic:** Acts strictly as an architectural data adapter/content layer, letting you style and render content with any design system or UI library.
* **Static Generation Support:** Built for static site generation (SSG) in Next.js, allowing blog posts to be built statically at compile time for optimal performance.
* **Plug-and-Play Configuration:** Easily configures local file directories, Dev.to article URLs, and GitHub file paths within a central configuration file (`postfolio.config.ts`).

---

Postfolio is an adaptable content adapter that unifies local MDX files, Dev.to articles, and GitHub Markdown into a single, clean data interface without manual copy-pasting.
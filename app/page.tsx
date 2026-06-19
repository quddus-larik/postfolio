import { allPosts, externalPosts } from "postfolio/server";
import {
  Button,
  Card,
  Chip,
  Separator,
  Typography,
  Surface,
} from "@heroui/react";
import Link from "next/link";
import {
  Copy,
  Lightning,
  Selection,
  ListBullets,
  FileCode,
  BookOpen,
  GithubLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

const externalPostUrls = [
  "https://dev.to/api/articles/quddus-larik/unexpected-ui-system-in-my-first-project-5478",
];

export default async function Page() {
  const localPosts = await allPosts("content/blogs");
  const externalPostsList = await externalPosts(externalPostUrls);
  const allPostsList = [...externalPostsList, ...localPosts];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Typography className="text-xl font-bold tracking-tight">
            postfolio
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Link href="#features">
            <Button variant="ghost" size="sm">
              Features
            </Button>
          </Link>
          <Link href="#blog">
            <Button variant="ghost" size="sm">
              Blog
            </Button>
          </Link>
          <Button size="sm"><GithubLogoIcon />GitHub</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Hero Section */}
        <section className="py-20 flex flex-col items-center text-center gap-8">
          <Chip variant="soft" color="accent" size="sm">
            <Chip.Label>v1.0.7 is now available</Chip.Label>
          </Chip>

          <Typography.Heading
            level={1}
            className="text-6xl md:text-8xl font-black tracking-tighter max-w-4xl leading-[0.9]"
          >
            Build your portfolio blog{" "}
            <span className="text-accent">in minutes.</span>
          </Typography.Heading>

          <Typography.Paragraph className="text-xl text-muted max-w-2xl leading-relaxed">
            A high-performance MDX engine for Next.js. postfolio handles the
            complexity of bundling, TOC generation, and active heading tracking
            so you can focus on writing.
          </Typography.Paragraph>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground font-bold px-8 h-14 text-lg"
            >
              Get Started
            </Button>
            <Surface className="h-14 px-6 flex items-center gap-3 border border-border rounded-xl font-mono text-base bg-surface">
              <span className="text-accent">$</span>
              <span>npm install postfolio</span>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                className="ml-2 h-8 w-8 min-w-0 p-0"
              >
                <Copy size={16} />
              </Button>
            </Surface>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24">
          <Separator className="mb-24" />
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
            {/* Feature 1: MDX Bundling */}
            <Card className="md:col-span-2 md:row-span-1 bg-surface border-border shadow-none overflow-hidden">
              <Card.Header className="p-8 pb-0">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <Lightning size={24} weight="fill" />
                </div>
                <Card.Title className="text-2xl font-bold">
                  Lightning Fast Bundling
                </Card.Title>
                <Card.Description>
                  Powered by esbuild and mdx-bundler. Compile your MDX content
                  at runtime with unmatched speed and zero configuration
                  overhead.
                </Card.Description>
              </Card.Header>
              <Card.Content className="p-8 pt-4">
                <Surface
                  variant="secondary"
                  className="p-4 border border-separator rounded-xl"
                >
                  <Typography
                    type="code"
                    className="text-xs block bg-transparent text-default-600 whitespace-pre"
                  >
                    {`const { code } = await MDXPost(slug, "blogs");\n\n// Render with ease\n<Content code={code} />`}
                  </Typography>
                </Surface>
              </Card.Content>
            </Card>

            {/* Feature 2: RSC Native */}
            <Card className="bg-surface border-border shadow-none">
              <Card.Header className="p-8">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <FileCode size={24} weight="fill" />
                </div>
                <Card.Title className="text-xl font-bold">
                  RSC Native
                </Card.Title>
                <Card.Description className="text-sm">
                  Optimized for the Next.js App Router. Ship zero client-side
                  JavaScript for your static blog content.
                </Card.Description>
              </Card.Header>
            </Card>

            {/* Feature 3: Active Heading */}
            <Card className="bg-surface border-border shadow-none">
              <Card.Header className="p-8">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <Selection size={24} weight="fill" />
                </div>
                <Card.Title className="text-xl font-bold">
                  Active Headings
                </Card.Title>
                <Card.Description className="text-sm">
                  Built-in hooks to track the current heading in view. Perfect
                  for synced table of contents.
                </Card.Description>
              </Card.Header>
            </Card>

            {/* Feature 4: TOC & Frontmatter */}
            <Card className="md:col-span-2 bg-surface border-border shadow-none">
              <Card.Header className="p-8 pb-0">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <ListBullets size={24} weight="fill" />
                </div>
                <Card.Title className="text-2xl font-bold">
                  Structured Content
                </Card.Title>
                <Card.Description>
                  Automatic Table of Contents generation and type-safe
                  frontmatter extraction built directly into the server
                  utilities.
                </Card.Description>
              </Card.Header>
              <Card.Footer className="p-8 pt-4 flex gap-2">
                <Chip variant="soft" color="success">
                  <Chip.Label>Title</Chip.Label>
                </Chip>
                <Chip variant="soft" color="warning">
                  <Chip.Label>Date</Chip.Label>
                </Chip>
                <Chip variant="soft" color="danger">
                  <Chip.Label>Tags</Chip.Label>
                </Chip>
                <Chip variant="soft" color="danger">
                  <Chip.Label>More..</Chip.Label>
                </Chip>
              </Card.Footer>
            </Card>
          </div>
          <Separator className="mt-24" />
        </section>

        {/* Blog Posts Section */}
        <section id="blog" className="py-24 flex flex-col gap-12">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <Typography.Heading
                level={2}
                className="text-4xl font-black tracking-tight"
              >
                From the blog
              </Typography.Heading>
              <Typography.Paragraph className="text-muted">
                Explore what's possible with postfolio.
              </Typography.Paragraph>
            </div>
            <Button variant="ghost" className="font-bold">
              View all posts
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPostsList.map((itm) => (
              <Link
                key={itm.slug}
                href={`/posts/${itm.slug}`}
                className="group"
              >
                <Card className="h-full bg-surface border-border shadow-none group-hover:border-accent hover:shadow-sm transition-all">
                  <Card.Header className="flex flex-col gap-2 items-start">
                    <Chip
                      size="sm"
                      variant="soft"
                      color="accent"
                      className="capitalize"
                    >
                      <Chip.Label>
                        {itm.frontmatter?.tags?.[0] || "Article"}
                      </Chip.Label>
                    </Chip>
                    <Card.Title className="text-xl font-semibold group-hover:text-accent-foreground transition-colors">
                      {itm.frontmatter?.title}
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Card.Description className="text-sm line-clamp-3 leading-relaxed">
                      {itm.frontmatter?.description}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-secondary py-16 border-t border-separator">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
                <BookOpen
                  className="text-accent-foreground"
                  size={14}
                  weight="fill"
                />
              </div>
              <Typography className="text-lg font-bold">postfolio</Typography>
            </div>
            <Typography.Paragraph className="text-sm text-muted">
              © 2026 postfolio. Built for the future of portfolios.
            </Typography.Paragraph>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-muted hover:text-foreground">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-muted hover:text-foreground">
              Github
            </Link>
            <Link href="#" className="text-sm text-muted hover:text-foreground">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

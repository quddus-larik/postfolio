import { Slugs } from "@postfolio/core";
import { Button } from "@heroui/react";
import Link from "next/link";
export default function Page() {
  const data = Slugs();

  return (
    <div className="h-svh flex items-center justify-center flex-col gap-4">
      <h1 className="text-5xl font-bold">
        Create a Blogs and Posts for{" "}
        <span className="text-accent text-shadow-xl">Portfolios</span>!
      </h1>
      <div className="flex flex-row gap-2 items-center">
        <Button>Getting Started</Button>
        <Button>Github</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
          {data.map((slug) => (
            <Link key={slug} href={`/posts/${slug}`}>
              <Button variant="secondary">{slug}</Button>
            </Link>
          ))}
      </div>
    </div>
  );
}

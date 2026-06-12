import { allPosts, Slugs } from "postfolio";
import { Button, Card, Chip } from "@heroui/react";
export default async function Page() {
  const data = await allPosts();

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
          {data.map((itm) => (
            <Card>
              <Card.Header>
                <Card.Title>{itm.frontmatter.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{itm.frontmatter.description}</Card.Description>
              </Card.Content>
              <Card.Footer className="flex items-center gap-1">
                {itm.frontmatter.tags.map((itm: any)=>(
                  <Chip key={idx+itm} variant="primary" color="accent" size="sm">{itm}</Chip>
                ))}
              </Card.Footer>
            </Card>
          ))}
      </div>
    </div>
  );
}

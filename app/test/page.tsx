import { externalPosts, MDXPost } from "postfolio/server";

export default async function Page() {
  const externalBlogs = [
    "https://dev.to/api/articles/quddus-larik/unexpected-ui-system-in-my-first-project-5478",
  ];

  const posts = await externalPosts(externalBlogs);
  
  const data = await MDXPost("unexpected-ui-system-in-my-first-project-5478", {
    externalBlogs,
  });

  console.log("Posts", posts);
  console.log("Posts MDX", data);

  return <>Hello</>;
}
import {GithubContent} from "postfolio";

export default async function Page() {
    const files = await GithubContent();

    console.log(files);

    return (
        <p>
            {JSON.stringify(files, null, 2)}
        </p>
    )
}
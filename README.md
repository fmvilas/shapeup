This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

TEST


First, go to your Github profile and create a new Project. Then go to Project settings (`https://github.com/users/[you-user-name]/projects/[project-id]/settings`) and add the following custom fields:

|Name|Type|Values|Description|
|---|---|---|---|
|Cycle|Iteration|As many as you wish|The development cycles you're going to follow, i.e., the 6-weeks period.
|Kind|Single Select|`Bet`, `Pitch`, and `Scope`|This is used to determine the kind of an issue/PR.
|Bet|Text|_The bet issue URL_|When the issue/PR is of kind `Scope`, we need to specify which bet this is related to. It will contain the URL of the bet issue.
|Appetite|Single Select|`Small Batch`, `Medium Bath`, and `Big Batch`|This is the Shape Up's appetite for your Pitch/Bet.

You can now go to your project and start adding bets, pitches, scopes, etc.

Once you got your project setup, go to the `shapeup.config.js` file and replace the `owner` (your Github username) and `projectNumber` (the ID of your project) values with your own ones.

Right after that, create a file called `.env.local` and add the following line:

```
GITHUB_TOKEN=[your-github-token]
```

> You can create a new personal token [here](https://github.com/settings/tokens). Make sure it has, at least, the following scopes: `public_repo`, `read:project`, `read:user`.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Shape Up application.

## Communicating progress

You can communicate progress at any time in any issue or pull request (as long as it's part of the tracked Github project). To do so, you have to leave a comment in the issue or pull request with the following syntax:

```
/progress <percentage> [message]
```
or

```
/progress <percentage>

A multiline message.
It supports Markdown.
```

### Examples

```
/progress 40 We\'re still figuring out how to implement this. We have an idea but it is not yet confirmed it will work.
```

```
/progress 50

A few notes:
* We got this figured out :tada:
* We\'re going to use [this library](#link-to-website) to avoid losing time implementing this algorithm.
* We decided to go for the quickest solution and will improve it if we got time at the end of the cycle.
```

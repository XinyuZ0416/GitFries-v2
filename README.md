# What is GitFries?
GitFries is a platform that connects code issues with contributors.

Git repo owners with raised issues can post the issues on this platform, and developers looking to contribute in real-life coding projects can look for and work on them.

## Preview
You can find the GitFries v2 intro on [Youtube](https://youtu.be/ebTZlND-CFM). Example issues in the demo video are from [microsoft/vscode](https://github.com/microsoft/vscode/issues) repo.

## Technical Structure
GitFries v2 was built based on [GitFries v1](https://github.com/XinyuZ0416/GitFries-v1) in different tech stack: Typescript, Tailwind, Firebase, React, Next.js, Typesense

## Feature Implementation
- **Pagination**: Firestore's startAfter with limit, and local state to track the current page and issues
- **Filters**: a combination of Firestore indexes feature and client-side logic
- **Search bar**: self-hosted Typesense in Docker
- **Sign up, sign in, email reset, password reset**: Firebase authentication
- **Profile picture**: Firebase storage
- **Username, bio, comment, issue operations**: Firebase database
- **Real-time chat, message alert, achievement badges**: Firebase database + onSnapshot()
- **Pricing**: Stripe
- **Chatbot**: Firebase Genkit
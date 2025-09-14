# AI Transcript

A Next.js application for transcribing and analyzing audio and video files.

## Features

- Convert video files to audio automatically using FFmpeg WASM
- Process audio files directly
- Transcribe audio content with timestamps
- Analyze transcripts for sentiment, language detection, and topics
- Edit and manage transcripts
- Secure user authentication

## Getting Started

First, run the development server:

````bash
npm run dev
# or
yarn dev
# or
pnpm dev
```.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Media Processing

The application can handle both audio and video files:

- Audio files (MP3, WAV, OGG, etc.) are processed directly
- Video files are converted to audio using FFmpeg WASM in the browser
- Both types of media can be transcribed and analyzed

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```
# Database
DATABASE_URL=your_database_url
POSTGRES_URL=your_postgres_url

# Auth
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Storage
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=your_r2_bucket
R2_PUBLIC_URL=your_r2_public_url

# AI/ML
GROQ_API_KEY=your_groq_api_key
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Cloudflare R2
- **AI/ML**: LangChain with Groq LLM integration
- **Authentication**: JWT-based auth
- **Styling**: Tailwind CSS
- **Media Processing**: FFmpeg WASM

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

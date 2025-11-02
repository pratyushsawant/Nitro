# Nitro

A proof‑of‑concept AI assistant inspired by tools like **Blackbox**, **Lovable**, and **Bold**—but designed to be more adaptable and less generic. Built with **Next.js** (frontend), **JavaScript** (backend/Convex), **Clerk** (authentication), **Tailwind CSS** (styling), and **Bun** (package manager/runtime). Uses **Gemini** for LLM capabilities today, with a roadmap to plug in stronger **multimodal** LLMs.

---

## Deployment

Happy to Announce Deployment of my AI Agent
[Click here for suprise](https://nitroaiagent.vercel.app/)

## ✨ Why this POC?

Existing assistants often feel one‑size‑fits‑all. This POC focuses on:

* **Sharper task routing** and agent behaviors
* **First‑class authentication** via Clerk
* **Fast local DX** with Bun + Convex + Next.js
* **Swap‑in multimodal models** for richer input/output (text, image, code in future)

---

## 🧱 Tech Stack

* **Frontend:** Next.js (App Router)
* **Backend:** JavaScript + Convex (local dev via `convex dev`)
* **Auth:** Clerk (Publishable + Secret Keys)
* **LLM:** Gemini API (current), with plan to support other multimodal LLMs
* **Styling:** Tailwind CSS
* **Package Manager/Runtime:** Bun

---

## ⚙️ Prerequisites

* **Bun** installed (v1+ recommended)
* **Node** optional (Bun includes a Node‑compatible runtime)
* **Clerk** project (for auth keys)
* **Gemini** API key
* (Optional) **Convex** CLI (used via `bunx`)

---

## 📦 Setup

1. **Clone & install**

   ```bash
   bun install
   ```

2. **Configure environment** — create a `.env.local` in the repo root:

   ```bash
   # Clerk (Auth)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Gemini (LLM)
   GEMINI_API_KEY=your_gemini_api_key

   # Convex (if applicable)
   NEXT_PUBLIC_CONVEX_URL=http://localhost:convex   # or your deployment URL
   CONVEX_DEPLOYMENT=   # optional; only if you use remote deployments
   ```

   > **Note:** Only the variables you actually use are required. Keep all secrets out of version control.

3. **Tailwind config** — already wired to Next.js. Update `tailwind.config.*` and `globals.css` as needed.

---

## ▶️ Running Locally

Open **two terminals** in the project root.

**Terminal A – start Convex (backend dev server):**

```bash
# Either form works depending on your shell/platform
bunx convex dev
# or (case-insensitive in most shells)
Bunx convex dev
```

**Terminal B – start Next.js (frontend):**

```bash
bun run dev
```

The app should now be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📜 NPM/Bun Scripts

Common scripts you might find in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "convex:dev": "convex dev"
  }
}
```

> Run with Bun: `bun run dev`, `bun run build`, `bun run start`, etc.

---

## 🔐 Authentication (Clerk)

* Client uses `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
* Server actions/routes use `CLERK_SECRET_KEY`.
* Protect API routes and server components as needed (e.g., middleware, auth helpers).

---

## 🧠 LLM (Gemini)

* The server reads `GEMINI_API_KEY` from `.env.local`.
* Model selection is abstracted so you can **swap in stronger/multimodal LLMs** later with minimal code churn.

---

## 🗂️ Suggested Project Structure

```
.
├── app/
│   ├── (routes)/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── convex/                  # Convex functions, schema
├── lib/                     # LLM clients, auth utils
├── components/              # UI components
├── styles/
├── public/
├── tailwind.config.ts
├── tsconfig.json | jsconfig.json
├── package.json
└── .env.local (not committed)
```

---

## 🚀 Deployment Notes

* **Next.js** → Vercel (or any Node host)
* **Convex** → use Convex cloud or self‑hosted as applicable
* **Env** → set production secrets via your host’s dashboard (never commit secrets)

---

## 🧭 Roadmap

* Plug‑in **better multimodal LLMs** (vision, audio)
* Structured tool‑use / function calling for richer actions
* In‑app evaluation harness for prompts/tools
* Expanded agent skills (code, docs, data, chat)

---

## 🔧 Troubleshooting

* **Auth errors**: verify Clerk keys and allowed origins in Clerk dashboard.
* **LLM errors**: confirm `GEMINI_API_KEY` and model name; check rate limits.
* **Convex not starting**: ensure `bunx convex dev` in a separate terminal and schema is valid.
* **Tailwind styles missing**: confirm `globals.css` import and `content` globs in `tailwind.config.*`.

---

## 🤝 Contributing

This is a hackathon POC. PRs and issues are welcome—focus on clarity, testability, and incremental improvements.

---


## 🙏 Acknowledgements

* Clerk for painless authentication
* Convex for streamlined backend dev
* Bun for fast install/run
* Google’s Gemini for LLM capabilities

> Built as a **POC** to demonstrate a less‑generic, more adaptable AI assistant that you can extend quickly.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> Nitro

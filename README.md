# Arjun Rai — Portfolio

Personal portfolio for [arjunrai.xyz](https://arjunrai.xyz), built with React and React Router.

The site combines an oversized single-fold homepage with compact, warm, information-dense inner pages.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Single-fold introduction and section index |
| `/projects` | Project cards with summaries, technology stacks, and live links |
| `/about` | Background, experience, and skills |
| `/contact` | Email and social links |

## Development

Requirements:

- Node.js 18 or newer
- npm

Install dependencies and start the local development server:

```bash
npm install
npm start
```

Create an optimized production build:

```bash
npm run build
```

Run the test watcher:

```bash
npm test
```

## Project structure

```text
src/
├── PortfolioPage.js      # Portfolio layout and routed pages
├── PortfolioPage.css     # Portfolio design system and responsive styles
└── portfolioData.js      # Projects, experience, and skills content

public/
├── favicon.svg
├── manifest.json
└── sitemap.xml
```

To update portfolio content, edit [`src/portfolioData.js`](src/portfolioData.js). Page copy and shared layout components live in [`src/PortfolioPage.js`](src/PortfolioPage.js).

## Deployment

Firebase Hosting is configured in [`firebase.json`](firebase.json). All routes rewrite to `index.html`, allowing React Router pages to load directly.

```bash
npm run build
firebase deploy --only hosting
```

Deployment requires a configured Firebase CLI session and access to the associated project.

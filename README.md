# Dylan Allen — Portfolio

The personal site of Dylan Allen, Senior AI Engineer. It is a fast, static, single-page portfolio covering his
background, selected work, experience, skills, and contact details, built around one theme: finding where models get
things wrong and building the checks that catch it. All content comes from one typed data file, the UI supports light
and dark themes, and the production build is plain static files that any host can serve.

## Tech stack

- **React 19** and **TypeScript 6**
- **Vite 6** for the dev server and production build
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with semantic design tokens
- **Motion** (`motion/react`) for restrained, reduced-motion-aware animation, loaded through `LazyMotion` with only the
  `domAnimation` features
- **lucide-react** icons and self-hosted **Geist** / **Geist Mono** fonts (Fontsource)
- **Vitest**, **Testing Library**, and **jsdom** for tests; **Oxlint** for linting

## Requirements

- **Node.js 20.17+** works with this pinned Vite 6 setup. **Node 22 LTS is recommended** (see `.nvmrc`).
- npm (the repository ships a `package-lock.json`)

Oxlint declares Node `^20.19 || >=22.12`, so `npm install` on Node 20.17 or 20.18 prints a harmless `EBADENGINE`
warning.

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL (http://localhost:5173 by default).

## Scripts

| Command              | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server with hot module replacement          |
| `npm run build`      | Type-check with `tsc -b`, then build static files into `dist/` |
| `npm run preview`    | Serve the production build from `dist/` locally                |
| `npm run lint`       | Lint `src/` with Oxlint                                        |
| `npm run typecheck`  | Type-check the whole project without building                  |
| `npm test`           | Run the test suite once with Vitest                            |
| `npm run test:watch` | Run Vitest in watch mode                                       |

## Project structure

```text
.
├── index.html                # <head>: SEO and social meta, JSON-LD, pre-paint theme script
├── public/                   # Copied as-is to the build output
│   ├── Dylan-Allen-Resume.pdf
│   ├── favicon.svg
│   ├── favicon.ico           # 32×32 fallback for clients without SVG favicons
│   ├── apple-touch-icon.png  # 180×180
│   ├── icon-192.png          # Web app manifest icons
│   ├── icon-512.png
│   ├── og-image.png          # 1200×630 social preview
│   ├── site.webmanifest
│   └── robots.txt
├── src/
│   ├── data/resume.ts        # Single source of truth for all site content
│   ├── components/
│   │   ├── ui/               # Primitives: Section, Container, Reveal, Tag, ButtonLink, icons
│   │   ├── layout/           # Navbar, mobile menu, theme toggle, footer
│   │   └── sections/         # Hero, About, Projects, Experience, Education, Skills, Contact
│   │       └── <section>/    # Subcomponents for each section
│   ├── hooks/                # useTheme, useActiveSection, useScrolled, useHashScroll
│   ├── lib/                  # cn (class names) and motion (shared easing and stagger)
│   ├── test/                 # Vitest setup and the head metadata drift test
│   ├── index.css             # Tailwind entry point, design tokens, light and dark themes
│   ├── App.tsx               # Page composition, section order, and motion setup
│   └── main.tsx              # Entry point: fonts, styles, React root
├── .env / .env.example       # VITE_SITE_URL, used for absolute URLs in index.html
├── .nvmrc                    # Recommended Node version
└── vite.config.ts            # Vite, React, Tailwind, and site URL plugins plus the Vitest config
```

Component, hook, and helper tests sit next to the code they cover as `*.test.ts` or `*.test.tsx` files.

## Editing content

Components read resume facts from **`src/data/resume.ts`**. The one exception is the Experience section title in
`src/components/sections/Experience.tsx` ("8+ years in production. The last four inside LLM systems."), which restates
the years; update it by hand if they change.

| Export          | Drives                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile`       | Name, role, location, email, LinkedIn, resume link, hero headline and intro, About summary                                                                             |
| `headlineStats` | The facts row under the Hero intro                                                                                                                                     |
| `stats`         | The headline stat tiles in About                                                                                                                                       |
| `focusAreas`    | The focus area cards in About                                                                                                                                          |
| `projects`      | Selected work cards; `flow` lists each diagram's stages as `{ label, check? }`, where `check: true` marks a stage that checks model output                             |
| `experience`    | The roles timeline, including highlights and tags                                                                                                                      |
| `skills`        | Grouped skill lists; `id` picks each card's icon, `description` adds a line to the featured card, and the first three `Languages` entries also feed the Hero facts row |
| `education`     | Degrees (school, degree, field, year), shown in the Education section with a timeline of every role since graduation                                                   |
| `navLinks`      | Navbar links and section numbers (01, 02, and so on) in list order; each `id` must match a section `id`                                                                |

**Phone number.** `profile.showPhone` is `true`, so `profile.phone` is listed first in the Contact section as a tap-to-call
link. Set it to `false` to keep the number only on the downloadable resume.

**Resume PDF.** Replace `public/Dylan-Allen-Resume.pdf` with a new file of the same name. If you rename it, update
`profile.resumeUrl` to match.

**Head metadata.** Search engines and link previews read `index.html` before any JavaScript runs, so some facts are
repeated there and in `public/site.webmanifest`: the title, description, Open Graph and Twitter text, and the JSON-LD
`Person` record (job title, email, LinkedIn, region, school, and skills). When those facts change in `resume.ts`,
update both files too, and regenerate the social image if its text changes. `src/test/headMetadata.test.ts` fails
`npm test` when the copies drift from `resume.ts`.

## Theming

Colors are semantic CSS variables defined in **`src/index.css`**:

- `:root` holds the light theme and `:root[data-theme='dark']` holds the dark theme.
- `@theme inline` exposes the variables as Tailwind utilities such as `bg-bg`, `bg-surface`, `border-line`,
  `text-fg-muted`, and `text-accent`. Components use these utilities rather than raw palette colors, so a token change
  applies to both themes everywhere.
- To change the accent, update `--accent`, `--accent-strong`, `--accent-soft`, and `--accent-line` in both theme blocks.
  If you change the page background, also update the `theme-color` values in `index.html` and `src/hooks/useTheme.ts`.
- Fonts are set with `--font-sans` and `--font-mono` in the `@theme` block.

The theme is resolved before first paint by the inline script in `index.html`, using the visitor's saved choice first
and the system preference otherwise. `useTheme` keeps every component in sync with that attribute (including a choice
made in another tab), follows OS changes until the visitor picks a theme, and saves the choice in `localStorage`.

## SEO and social previews

`index.html` includes a canonical link, `robots`, Open Graph and Twitter card tags, and JSON-LD structured data. Absolute
URLs are built from **`VITE_SITE_URL`**, which the `site-url` plugin in `vite.config.ts` fills into the HTML at build
time.

- Set `VITE_SITE_URL` to the deployed URL, for example `https://your-domain.com` (a trailing slash is tolerated). On a
  GitHub Pages project site, include the repository path: `https://<user>.github.io/<repo-name>`.
- Set it in your host's build environment (recommended) or in `.env.production.local`, which git ignores. Environment
  variables take precedence over `.env`.
- On Vercel and Netlify it is optional: when it is empty, the build uses the production URL those hosts expose
  (`VERCEL_PROJECT_PRODUCTION_URL`, or Netlify's `URL`).
- When no URL is known, as in local builds with the committed empty `.env`, the canonical link, `og:url`, `og:image`
  (with its type, size, and alt tags), `twitter:image`, and the JSON-LD `url` are left out, the Twitter card falls back
  to `summary`, and the build prints a warning. A value that is not an absolute http(s) URL fails the build.
- After building, check `dist/index.html`, then test the live URL with a link preview inspector such as LinkedIn's Post
  Inspector.
- Once the domain is known, consider adding a `Sitemap:` line to `public/robots.txt`.

### Regenerating the social image

`public/og-image.png` is a static 1200×630 PNG. It was drawn as an SVG and rasterized with
[`@resvg/resvg-js`](https://github.com/thx/resvg-js) using the Geist TTF files from the `geist` npm package. The design
uses an `#09090b` background with a faint 56px grid and a soft teal glow, the monogram, the name, the role in teal
(`#2dd4bf`), a one-line tagline, and a row of monospace chips.

To update it, install the tools in a scratch folder outside this repository (they are not project dependencies):

```bash
npm i @resvg/resvg-js geist
```

```js
// render.mjs: rasterize og.svg (1200×630) with the Geist fonts
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'

const fonts = 'node_modules/geist/dist/fonts'
const png = new Resvg(fs.readFileSync('og.svg', 'utf8'), {
  font: {
    fontFiles: [
      `${fonts}/geist-sans/Geist-Regular.ttf`,
      `${fonts}/geist-sans/Geist-Medium.ttf`,
      `${fonts}/geist-sans/Geist-SemiBold.ttf`,
      `${fonts}/geist-mono/GeistMono-Regular.ttf`,
    ],
    loadSystemFonts: false,
    defaultFontFamily: 'Geist',
  },
}).render().asPng()
fs.writeFileSync('og-image.png', png)
```

Keep the output at 1200×630 and under about 300 KB, copy it to `public/og-image.png`, and update `og:image:alt` and
`twitter:image:alt` in `index.html` if the text changed. Social networks cache previews, so use each platform's inspector
to refresh the cached image.

## Deployment

`npm run build` writes static files to `dist/`. The site is a single page with in-page anchors, so no SPA rewrite rules
are needed.

**Vercel**: import the repository and choose the Vite preset. Use `npm run build` as the build command and `dist` as the
output directory. The production domain is picked up automatically; add `VITE_SITE_URL` under Environment Variables only
to override it.

**Netlify**: use `npm run build` as the build command and `dist` as the publish directory. The site's main URL is picked
up automatically; add `VITE_SITE_URL` in the site's environment variables only to override it. To pin Node, set
`NODE_VERSION=22`.

**GitHub Pages**: a project site is served from `/<repo-name>/`, so set the base path in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/<repo-name>/',
  // ...
})
```

Vite then prefixes bundled assets and the icon, manifest, and social image links in `index.html`. Links written as
plain strings in components are not rewritten, including `profile.resumeUrl` (`/Dylan-Allen-Resume.pdf`), so point
them at `` `${import.meta.env.BASE_URL}Dylan-Allen-Resume.pdf` `` or use a relative path. Set
`VITE_SITE_URL=https://<user>.github.io/<repo-name>` for the build, then publish `dist/` with a GitHub Actions workflow
or the `gh-pages` branch. With a custom domain served from the root, no base path is needed.

## Accessibility and performance

- **Reduced motion**: animations run through `<MotionConfig reducedMotion="user">`, custom sequences check
  `useReducedMotion()` and render their final state, and smooth scrolling is disabled when the OS asks for reduced
  motion.
- **Keyboard navigation**: a skip link, visible `:focus-visible` rings, semantic landmarks, one `h1` with an `h2` per
  section, `aria-expanded` on disclosure controls, and labels on icon-only buttons. `scroll-padding-top` keeps focused
  controls clear of the fixed navbar.
- **Deep links**: `useHashScroll` scrolls to the URL fragment (for example `/#contact`) after the app mounts, and again
  once web fonts have loaded.
- **No theme flash**: the theme is applied by a small inline script before the stylesheet and app load.
- **Lean runtime**: fonts are self-hosted, icons are inline SVG, and the page makes no third-party requests at load.
  Motion runs through `LazyMotion` with `domAnimation`, so animated elements use the `m.*` components (not `motion.*`),
  and a test that renders a component outside `App` must wrap it in `<LazyMotion features={domAnimation}>`.

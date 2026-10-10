# Mansur Çiftlik — Website & Farm Management

The source code for the **Mansur Çiftlik** website and related web-based record-management features.

**Website:** [mansurciftlik.com](https://www.mansurciftlik.com)

This repository combines a public-facing farm website with authenticated tools for livestock management and milk-production records. Unlike most of the older projects in this portfolio, it may receive further development.

## What is included

- **Public website:** Farm presentation and content pages, with SEO metadata and a sitemap.
- **Livestock management:** Dashboard and sections for animals, cows, calves, heifers, bulls, and vaccinations.
- **Milk records:** Calendar-based daily milk entries, quantity summaries, and calculation tools.
- **Authentication:** Sign-in flows for the management and records areas.
- **Responsive interface:** UI components designed for desktop and mobile browsers.

## Technology stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4 and project-specific styles
- **Data and authentication:** Supabase and `@supabase/ssr`
- **Other libraries:** ExcelJS, Lucide React

## Project layout

```text
src/
  app/
    (site)/         # Public-facing pages
    management/     # Livestock management screens
    records/        # Milk records interface
    layout.js       # Shared root layout and SEO metadata
    sitemap.js      # Sitemap
  components/       # Reusable interface components
  contexts/         # React contexts
  lib/              # Data and Supabase integration
  proxy.js          # Request/proxy handling
public/             # Images and public assets
```

## Run locally

**Requirements:** Node.js, npm, and access to compatible Supabase projects and tables.

```bash
git clone https://github.com/muhammedkolee/mansurciftlikWeb.git
cd mansurciftlikWeb
npm ci
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The application also provides `npm run build` and `npm run start` scripts.

### Supabase configuration

The code supports these environment variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_records_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_records_publishable_key
NEXT_PUBLIC_SUPABASE_URL_MANAGEMENT=your_management_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY_MANAGEMENT=your_management_publishable_key
```

Use project-specific values, appropriate Supabase Row Level Security policies, and non-privileged browser keys. This repository does not ship a complete database provisioning workflow, so cloning alone is not sufficient to reproduce the connected services.

## Project status

This is an existing web project that **may be updated in the future**. The README describes the checked-in code; it does not guarantee current availability of every deployed feature. Contributions and refactoring are not currently committed to a public roadmap.

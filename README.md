# LotWise Labs frontend

Low-fidelity storefront and admin wireframe. It uses React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide icons. Sample data lives in `src/data` and is read through `src/services`. No backend is required.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

`npm run dev` starts the Vite development server. `npm run build` typechecks and writes a static build to `dist/`.

Copy `.env.example` to `.env` only if you want the reserved variable names present. `VITE_API_BASE_URL` is unused in this phase.

## Brand assets

Satoshi is loaded from `public/fonts` at weights 400, 500, 700, and 900. An official logo file was not in the project workspace, so the header uses a labeled logo slot plus the LotWise Labs name in Satoshi. Place the official mark in `public/images/brand` before replacing that slot. Do not redraw the brand mark.

## Directory map

```text
src/
├── app/router/          Route table
├── app/routes/          Storefront pages
├── admin/layouts/       Admin shell
├── admin/pages/         Admin screens
├── admin/components/    Admin-only UI
├── components/          Storefront UI
├── data/                Sample records
├── services/            Read and price those records
├── hooks/               Cart preview and account-layout preview
├── types/               Shared models
├── utils/               Formatting and form checks
└── styles/              Tailwind entry, tokens, wireframe rules
```

`public/images/` is reserved for future product, category, banner, and brand files. The wireframe draws labeled placeholders instead of missing images.

## Demonstration boundaries

- The cart is stored in this browser under `lotwise-wireframe-cart`.
- Checkout writes a confirmation into `sessionStorage` and does not take payment.
- Account sign-in does not create a session. A separate control previews the signed-in screens.
- Admin forms and status controls change the current view only. They do not update the storefront sample file.
- Discount codes `DEMO10` and `FIXED5` adjust the provisional cart total locally.

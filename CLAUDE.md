# Beat Store — Project Context

## Project Overview

A custom beat licensing platform built for a single producer/client. The client uploads beats,associates uploaded licensing contracts to them, and sells those contracts to artists. Artists can browse and preview all beats freely, download MP3s for free, and purchase WAV or WAV + Trackout licenses via contract. This is a solo-producer storefront, not a marketplace — all beats belong to one artist.

## Claude Code Instructions

Anytime Claude Code is prompted, refer to CHANGES.md in the root of the project to log the changes, following the instructions and the format given in the example.

### User Roles

- **Guest** — can browse, search/filter, play beats, download MP3s, view contract details
- **User** — same as guest, plus: purchase contracts, view purchase history (contracts and downloaded WAV / WAV + Trackout), manage account
- **Admin** — same as user, plus: upload/edit beats, add/edit contracts, view all users, view all contracts

---

## Demo Concerns

This is a **frontend-only demo**. There is no live backend. Key constraints:

- All data is **mocked locally** — beats, users, contracts, cart contents are stubbed JSON that Claude Code is responsible for creating in a separate file
- Client-side filtering only — no server queries
- Auth is **role-simulated** — a mock role state (guest / user / admin) drives protected routes
- File uploads are **visually simulated** — dropzones accept files but do not POST anywhere
- Payment flow uses **Braintree test mode UI only** — no real charges
- Waveform peaks are **pre-stubbed arrays** — no server-side peak generation
- Infinite scroll paginates through a **local mock array**

---

## Design Direction

> The app should lean towards being darker visually.
> When possible, there should be space so that components, text, icons, etc. don't feel cluttered.
> Edges should be lightly rounded.
> The accent colors should appear in or around most components, but thinly.
> Headings should be emboldened, but not so much so that content is overshadowed.
> Backgrounds should have a textured appearance to them.
> Sections should have well-defined borders.
> The app should feel approachable - think like Disney/Pixar, while still having a bit of an edge (try mixing the themes for FX's Shogun and Pixar's Luca - Beautiful and rugged with bright and approachable).

### Color Palette

```css
:root {
  /* Primary — dominant brand color, used for key UI surfaces and nav */
  --color-primary: #105067;

  /* Secondary — supporting color, used for cards, sections, containers */
  --color-bg: #141115;

  /* Tertiary — accent/highlight, used for CTAs, active states, waveform progress */
  --color-accent-hero: #c7778b;

  /* Fourth — used for borders, dividers, subtle backgrounds */
  --color-accent-2: #7f56ae;

  /* Fifth — used for muted text, disabled states, placeholders */
  --color-accent-3: #7fdeff;

  /* Text — primary readable text */
  --color-text: #fef3f3e8;

  /* Text Muted — secondary/supporting text */
  --color-text-muted: #e1dfdfde;

  /* Surface Raised — cards, modals, elevated containers */
  --color-surface-raised: #5b8189;

  /* Dark Mode equivalents — define separately or use a [data-theme="dark"] selector */
}
```

### Typography

- **Display** — `Play` (Google Fonts, weights 400 + 700) — headings, beat titles, hero text
- **Body** — `Winky Rough` (Google Fonts, weights 300–900) — all body copy, labels, UI text
- **Numeric/Label** — `Nunito` (Google Fonts, weights 200–1000) — BPM values, prices, technical readouts. Not a true monospace — used for its rounded numeric clarity.

All three loaded via single Google Fonts `<link>` in the HTML head. Apply via CSS variables:

```css
/* Display font — used for headings, beat titles, hero text */
--font-display: "Play", sans-serif;

/* Body font — used for all body copy, labels, UI text */
--font-body: "Winky Rough", sans-serif;

/* Mono font — used for BPM values, prices, technical labels */
--font-mono: "Nunito", monospace;
```

### Motion & Texture

**Texture:**

- CSS noise/grain overlay on all dark surfaces (`--color-bg`, `--color-primary`) to create a worn, tactile feel rather than flat digital black
- Cards and modals (`--color-surface-raised`) have a faint top-edge highlight or inner glow using accent colors at low opacity (~10–15%)
- Section borders are visible and well-defined, using `--color-primary` or a 1–2px accent-colored line at low opacity

**Motion:**

- Beat rows stagger-fade upward sequentially on load (short delay between each row)
- Bottom bar player slides up from off-screen on first play
- Navbar transitions to frosted glass (backdrop-blur) on scroll
- Waveform progress bar glows softly in `--color-accent-hero` as the track plays
- Modals scale up gently from center on entrance (weighted, physical feel — not instant)
- Buttons show a thin accent-colored border on hover with a soft pulse
- Cart icon spring-animates on item add
- Accent colors appear as thin glowing borders on all component focus and hover states

**General feel:** Dark, textured, and structured but warm and approachable. Inspired by the rugged beauty of FX's Shogun mixed with the bright approachability of Pixar's Luca. Space between elements is generous. Edges lightly rounded. Headings bold but not dominant. Color accents appear frequently but thinly

---

## Tech Stack

- **Vite**
- **TypeScript** — strict mode
- **ESLint + Prettier**
- **Node 22.2**
- **Package manager** — npm

### Framework & Tooling

- **React** (via Vite + TypeScript)
- **TanStack Router** — (`@tanstack/react-router`) client-side routing and protected route wrappers
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — base component library; all components are copied into the project and modified

### State Management

- **Zustand** — global state for: currently playing track, cart contents, mock auth role

### Data Fetching / Pagination

- **TanStack Query** (`@tanstack/react-query`) — `useInfiniteQuery` for paginated beat listing

### Audio

- **wavesurf** (`wavesurf` + `wavesurfer.js`) — waveform rendering, global audio state, and persistent mini-player

### File Handling

- **react-dropzone** — drag-and-drop file selection in admin upload forms

### PDF

- **react-pdf** (`wojtekmaj/react-pdf`) — contract PDF viewer inside a modal

### Payments

- **Braintree** (`braintree-web` + `braintree-web-drop-in`) — wrapped in React's useEffect

### Notifications

- **Sonner** — toast notifications, shadcn-native (shadcn/ui), promise-based API for async feedback

### Utilities

- **react-countdown** — discount/contract expiration countdown timers

### Animation

- **Motion** (`motion`) — React animations via `motion/react`; used for staggered row reveals, modal entrances, bottom bar slide-up, button hover states, and micro-interactions

---

## Pages

### 1. Beat Listing (Home) — `/`

Public. The primary browsing experience.

**Layout:** Full-width. Sticky navbar at top. Search/filter bar below navbar.
Beat rows load progressively as the user scrolls. Main audio card appears above the table - showing time progress and and waveform when song has beeen selected or inactive state before a song is selected. Bottom bar audio card only shows after a song has been selected, persists while scrolling. Hovering over a track from the table should highlight the song, and a song that is currently selected (featured in the audio cards should be lightly highlighted in a different color)

**Components:**

- Navbar (guest or user state)
- Search/filter bar
- Beat rows (each row: art thumbnail, title, BPM, tags, MP3 download button, cheapest contract price, add-to-cart icon)
- Tag/genre pills (within each row)
- Discount badge (if applicable on contract price)
- Main audio card (visible at all times, in empty state until a song is selected)
- Bottom bar / smaller audio card (persistent after any track is selected, invisible until a track is selected)
- Waveform skeleton (exists in empty state audio card, and until waveform is loaded)
- Pagination sentinel (triggers next page load on scroll)
- Empty state (no results for current filter)
- Toast notifications (add to cart, download triggered)

---

### 2. User Account — `/account`

Protected (User + Admin). Purchase history and account settings.

**Layout:** Sidebar or tabbed layout. Two sections: Purchased Contracts, Account Settings.

**Components:**

- Navbar (user state)
- Purchased contracts table (contract name, beat title, coverage type, purchase date, download status)
- MP3 download button (per row, for previously purchased items)
- Account settings form (email, password reset)
- Empty state (no purchases yet)
- Toast notifications (settings saved, password updated)

---

### 3. Checkout — `/checkout`

Protected (User). Cart review and payment.

**Layout:** Single-column centered. Order summary at top, payment form below.

**Components:**

- Navbar (user state)
- Cart/order summary table (contract name, beat, coverage, price, discount badge if applicable)
- Countdown timer (if discount expiration is active on any item)
- Braintree wrapped in useEffect with user info (email, billing address, card details)
- Confirmation dialog (on successful purchase)
- Toast notifications (purchase success, payment error)

---

### 4. Admin Dashboard — `/admin`

Protected (Admin only). Overview landing page for the admin.

**Layout:** Dashboard grid. Summary stats cards + quick links to sub-pages.

**Components:**

- Navbar (admin state)
- Stat cards (total beats, total contracts, total users, recent sales, links to each individual page)
- Quick nav links to admin sub-pages

---

### 5. Admin — Beats — `/admin/beats`

Protected (Admin only). View, play and link to manage all beats.
Primarily the same layout as all-beats page for users and guests, instead of add to cart -> edit icon

**Layout:** Full-width table with edit icon per row.

**Components:**

- Navbar (admin state)
- Main audio card (visible at all times, in empty state until a song is selected)
- Bottom bar / smaller audio card (persistent after any track is selected, invisible until a track is selected)
- Waveform skeleton (exists in empty state audio card, and until waveform is loaded)
- Beats table
- Search/filter bar
- Empty state (no results for current filter)
- Beat rows (each row: art thumbnail, title, BPM, tags, MP3 download button, cheapest contract price, edit icon)
- Pagination sentinel (triggers next page load on scroll)
- Tag/genre pills (within each row)
- Confirmation dialog (on beat delete)
- Toast notifications (delete success/error)

---

### 6. Admin — Add / Edit Beat — `/admin/beats/new` and `/admin/beats/:id/edit`

Protected (Admin only). Upload or edit a beat and its associated files.

**Layout:** Form box with file drop zones across the top, text inputs below.

**Components:**

- Navbar (admin state)
- File dropzone × 4 (beat art image, MP3, WAV, Trackout ZIP)
- Upload progress indicator (per dropzone)
- Beat form inputs (title, tags/genres [accepts one at a time], BPM)
- An updated box with genre pills after each each tag/genre is typed in and added
- Save button
- Toast notifications (save success/error)

---

### 7. Admin — Users — `/admin/users`

Protected (Admin only). View all registered users.

**Layout:** Full-width table.

**Components:**

- Navbar (admin state)
- Users table (email, signup date, expired contract count, total purchased contracts, last purchase date)
- Empty state (no users yet)

---

### 8. Admin — Contracts — `/admin/contracts`

Protected (Admin only). View and manage all contracts.

**Layout:** Full-width table with edit icon per row.

**Components:**

- Navbar (admin state)
- Contracts table (file coverage typep [WAV or WAV + Trackout ZIP] price, discount, discount expiration date, streams, downloads, duration, edit icon, delete icon)
  - Sort By: file coverage, price, discount expiration
- Confirmation dialog (on contract delete)
- Toast notifications (delete success/error)

---

### 9. Admin — Add / Edit Contract — `/admin/contracts/new` and `/admin/contracts/:id/edit`

Protected (Admin only). Create or edit a contract linked to a beat.

**Layout:** Form Box with text / numberic inputs, File Drop box for PDF below.

**Components:**

- Navbar (admin state)
- File dropzone × 1 (contract PDF)
- Upload progress indicator
- Contract form inputs (file coverage type checkbox [WAV or WAV + Trackout ZIP], price, discount, discount expiration)
- Save button
- Toast notifications (save success/error)

---

## Components

### Custom / Fully Built

**Navbar**

- Libraries: TanStack Router (links), Zustand (cart count, auth state), shadcn `Popover` or `DropdownMenu` (cart dropdown)
- Three visual states: guest (sign-in prompt), user (email + cart), admin (email + cart + dashboard link)

**Beat Row** _(the individual row in the beat listing, not a card)_

- Libraries: Zustand (play state, cart state), Sonner (toast on add to cart / download)
- Contains: art thumbnail, title, BPM, tag pills, MP3 download button, cheapest contract price, share icon, add-to-cart icon (or edit if in admin state)

**Main Audio Card**

- Libraries: wavesurf + WaveSurfer.js (waveform + playback), Zustand (currently playing track), Sonner
- Appears above the beat listing after any track is selected, or as a skeleton / empty state before one is selected. Contains: art, title, tags, waveform with scrubbing, playback controls, volume, share icon, add-contract button

**Bottom Bar / Smaller Audio Card**

- Libraries: wavesurf + WaveSurfer.js or shared audio context, Zustand
- Persistent bottom bar after any track is selected to play. Appears only after first track is selected on the page Contains: title, playback controls, volume, share icon, add-contract button. No waveform.

**Mobile Audio Player**

- Libraries: same as bottom bar
- Adapted layout of the bottom bar for narrow viewports. Touch-friendly controls.

**Search / Filter Bar**

- Libraries: Zustand or local state (filter values), shadcn `Select` (sort dropdown)
- Inputs: keyword search, genre/tag multiselect, BPM range, sort order

**Beat Form**

- Libraries: react-dropzone (4 zones), shadcn `Input`, Sonner
- Fields: art image drop, MP3 drop, WAV drop, Trackout ZIP drop, title, tags/genres, BPM, save

**Contract Form**

- Libraries: react-dropzone (1 zone), shadcn `Input`, `Checkbox`, Sonner
- Fields: PDF drop, coverage checkbox, price, discount, discount expiration, save

**Beats Table** (admin)

- Libraries: shadcn `Table`, TanStack Router (edit link), Zustand or TanStack Query (data)

**Users Table** (admin)

- Libraries: shadcn `Table`

**Contracts Table** (admin)

- Libraries: shadcn `Table`, react-countdown (discount expiration column), TanStack Router (edit link)

**Cart Dropdown**

- Libraries: shadcn `Popover` or `DropdownMenu`, Zustand (cart state), TanStack Router (checkout link)
- Brief summary of cart items. Shown from navbar cart icon.

**Checkout / Order Summary**

- Libraries: shadcn `Table`, Zustand (cart state), Braintree, react-countdown

**Contract Cards** _(advertising a contract on or near a beat)_

- Libraries: shadcn base, Zustand (add to cart), react-countdown
- Shows: coverage type, price, discount badge, streams/downloads allowed, expiration

**Sign Up / Log In**

- Use the Auth Modal to create two modals, one for signing up, and one for signing in, each with a link to the other
- This should drive the state of mayn portions of the program

---

### Library-Backed (style and theme to match design system)

**Auth Modal** — shadcn `Dialog`; login + signup forms inside

**Share Modal** — shadcn `Dialog`; copyable URL + optional social links

**Contract Detail Modal** — shadcn `Dialog`; contract terms summary + open PDF button + add to cart

**PDF Viewer** — `react-pdf` inside a shadcn `Dialog`; page navigation + zoom controls

**File Dropzone** — `react-dropzone`; styled to match design system per instance (image, audio, zip, pdf)

**Upload Progress Indicator** — driven by `react-dropzone` `onProgress` callbacks; per-file progress bar

**Toast System** — `Sonner` `<Toaster />` placed in app root; themed to match palette

**Countdown Timer** — `react-countdown`; used on contract cards, cart, contracts table

**MP3 Download Button** — shadcn `Button` with idle/downloading/done state; no extra library

**Discount Badge** — shadcn `Badge`; themed accent color

**Tag / Genre Pill** — shadcn `Badge` variant; reused across beat rows, audio cards, forms, filter bar

---

### Utility / Structural (no significant UI)

**Protected Route Wrapper** — TanStack Router + Zustand role check; redirects guests and non-admins

**Pagination Sentinel** — single `div` with `ref`; watched by `IntersectionObserver` to trigger `fetchNextPage`

**Waveform Skeleton** — CSS animated placeholder shaped like a waveform; shown while WaveSurfer loads

**Empty States** — inline conditional JSX per context (no beats, empty cart, no purchases)

**Error Boundary** — React class component wrapping WaveSurfer and data-fetching components

**Confirmation Dialog** — shadcn `AlertDialog`; reusable with configurable prompt + confirm action

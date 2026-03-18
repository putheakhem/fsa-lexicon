# FSA Lexicon

A multilingual financial terminology lexicon for the **Financial Sector Authority (FSA)**, supporting **Khmer, English, and French**. The system manages financial terms, definitions, source references, sector classifications, and term groupings, with Telegram publishing support.

Built with **Laravel 13**, **Inertia.js v2**, and **React 19**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.3, Laravel 13 |
| Auth | Laravel Fortify v1 (headless, with 2FA/TOTP) |
| Frontend | React 19, TypeScript, Inertia.js v2 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI) |
| Routing (frontend) | Laravel Wayfinder |
| Database | MySQL / SQLite (via Laravel) |
| Testing | Pest v4 |
| Static Analysis | Larastan (PHPStan), Rector |
| Code Style | Laravel Pint |

---

## Requirements

- PHP 8.3+
- Composer
- Node.js 20+
- A supported database (MySQL, PostgreSQL, or SQLite)

---

## Getting Started

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials and any mail/service settings.

### 3. Run migrations

```bash
php artisan migrate
```

### 4. Start the development server

```bash
composer run dev
```

This starts the full stack concurrently: Laravel server, queue worker, Pail log viewer, and Vite.

SSR mode:

```bash
composer run dev:ssr
```

---

## Application Structure

### Backend (`app/`)

| Path | Description |
|---|---|
| `app/Models/User.php` | User model with Fortify 2FA support |
| `app/Http/Controllers/Settings/` | Profile and security settings controllers |
| `app/Http/Requests/` | Form request validation classes |
| `app/Actions/Fortify/` | Fortify action classes (user creation, password reset) |
| `app/Providers/FortifyServiceProvider.php` | Wires Fortify views to Inertia React components |

### Frontend (`resources/js/`)

| Path | Description |
|---|---|
| `pages/` | Inertia page components |
| `pages/auth/` | Login, register, password reset, 2FA, email verification |
| `pages/settings/` | Profile, security, and appearance settings |
| `pages/dashboard.tsx` | Authenticated dashboard |
| `layouts/` | App layout, auth layout, settings layout |
| `components/` | Shared UI components (shadcn/ui based) |
| `actions/` | Wayfinder-generated controller action helpers |
| `routes/` | Wayfinder-generated named route helpers |

### Routes

| URI | Name | Access |
|---|---|---|
| `/` | `home` | Public |
| `/dashboard` | `dashboard` | Auth + verified |
| `/settings/profile` | `profile.edit` | Auth |
| `/settings/security` | `security.edit` | Auth + verified |
| `/settings/appearance` | `appearance.edit` | Auth + verified |

Fortify automatically registers routes for login, logout, registration, password reset, email verification, two-factor authentication, and password confirmation.

---

## Authentication

Authentication is handled by **Laravel Fortify** (headless). The full flow is covered:

- Email/password login with rate limiting
- User registration
- Password reset via email
- Email verification
- Two-factor authentication (TOTP) with QR code and recovery codes
- Password confirmation gate

---

## Lexicon Domain (upcoming)

The lexicon data model is fully specified in [doc/lexicon-migration.md](doc/lexicon-migration.md) and covers:

- **Term** — multilingual term (`term_kh`, `term_en`, `term_fr`) with Telegram publish status and approval flag
- **TermDefinition** — per-language definitions linked to terms and source references
- **Reference** — source documents (title, code, file attachment)
- **Sector** — financial sector hierarchy (self-referential)
- **TermGroup** — term grouping with hierarchy support
- **TelegramAccount** — external Telegram user records
- Pivot tables: `reference_terms`, `sector_terms`, `group_terms`

**Languages supported**: Khmer, English, French (via `Language` enum)

---

## Testing

```bash
# Run all tests
php artisan test --compact

# Run a specific test file or filter
php artisan test --compact --filter=ProfileTest
```

Tests use **Pest v4** and are located in `tests/Feature/` and `tests/Unit/`.

---

## Code Quality

```bash
# Format PHP code
vendor/bin/pint

# Static analysis
vendor/bin/phpstan analyse

# Automated refactoring
vendor/bin/rector process
```

---

## Frontend Build

```bash
# Development (with HMR)
npm run dev

# Production build
npm run build
```

---

## License

Private — Financial Sector Authority (FSA). All rights reserved.

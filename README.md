# Wedding Invitation Site

Next.js 15, Prisma, PostgreSQL wedding invitation app with two SSG invitation pages (husband/wife), i18n (KZ/RU), and admin panel.

## Setup

1. Copy `.env.example` to `.env` and set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_EVENT_DATE`, `APP_PORT`, `DB_PORT`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`.
2. Install: `npm install`
3. Database: `npx prisma migrate deploy` (or `npx prisma db push` for dev)
4. Seed SuperAdmin: set `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` in `.env`, then `npm run db:seed`
5. Add music: place your melody file at `public/audio/melody.mp3` (used by the hero music button)

## Code quality

- **Lint**: `npm run lint` (Next.js + ESLint, config in `.eslintrc.json`)
- **Format**:
  - Apply formatting: `npm run format` (Prettier, config in `.prettierrc`)
  - Check formatting (CI): `npm run format:check`
- **Tests**:
  - Run tests: `npm test`
  - Run tests with coverage (>= 80%): `npm run test:coverage`

## Git hooks (Husky)

- Hooks live in `.husky/`:
  - `pre-commit`: runs `lint-staged` (ESLint + Prettier only on изменённых файлов)
  - `pre-push`: runs `npm test -- --coverage`
- Installation (после `npm install`): Husky устанавливается автоматически через скрипт `prepare` в `package.json`.

## Run

- Dev app only: `npm run dev` (requires Postgres running, e.g. `docker compose -f docker-compose.dev.yml up db`)
- Build: `npm run build` && `npm start`
- Docker (prod): `docker build -t wedding_invitation .` then `docker compose up -d`

## Routes

- `/` → redirects to default locale
- `/[locale]` (kz | ru) → home with links to invitation pages
- `/[locale]/invitation/husband` — husband’s guests invitation (SSG)
- `/[locale]/invitation/wife` — wife’s guests invitation (SSG)
- `/admin/login` — admin login
- `/admin` — admin dashboard (guests table; SuperAdmin can create admins)

## Invitation RSVP form reliability

- Основная форма приглашения — компонент `RsvpForm` (страницы `/[locale]/invitation/husband` и `/[locale]/invitation/wife`).
- Серверная валидация данных гостя:
  - Схема `guestSchema` (`lib/validations/guest.ts`) на `zod`:
    - `name`: обязательная строка, тримминг, максимальная длина 500 символов, без строгих ограничений по символам (имена и даже «странный» ввод не ломают форму).
    - `attendance`: одно из значений `COMING` | `WITH_PARTNER` | `NOT_COMING`.
  - Эти же данные используются в API-роутах:
    - `POST /api/guests/husband`
    - `POST /api/guests/wife`
- Устойчивость формы:
  - Любой ввод (включая скрипты/символы) обрабатывается как обычная строка и не исполняется в браузере.
  - При успехе поля очищаются и показывается сообщение об успехе.
  - При ошибке отправки показывается сообщение об ошибке, введённые данные не теряются, пользователь может повторить попытку без повторного ввода.
  - Отправка блокируется во время запроса, чтобы избежать случайных двойных кликов.

## SuperAdmin credentials (after seed)

SuperAdmin email and password are taken from environment variables:

- `SUPERADMIN_EMAIL`
- `SUPERADMIN_PASSWORD`

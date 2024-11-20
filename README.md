[![ci](https://github.com/Remicck/multi-tenant-sample/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Remicck/multi-tenant-sample/actions/workflows/ci.yml)

## Setup

**1. Installing Docker Compose**

Please check [Installation scenarios](https://docs.docker.com/compose/install/) section.

**2. Enabling git hook and corepack**

```sh
npm run setup
```

**3. Installing Deps**

```sh
pnpm i
```

**4. Creating `.env.local` and modifying environment variables**

```sh
cp .env.sample .env.local
```

Set the following environment variables in `.env.local`.

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

_If you don't use Google OAuth, you can remove a provider from `_clients/NextAuth.ts`._

## Dev

```sh
# start docker-compose, migrations(generating the client), and next dev
pnpm dev
# create new migration
pnpm dev:db:migrate
# reset the DB
pnpm dev:db:reset
# view the contents
pnpm dev:db:studio
```

📙 [Database ER diagram](/prisma/ERD.md)

## Test

Test uses also DB so need to start DB first.

```sh
# unit test

# run the DB and generate the client
pnpm test:db:setup
# execute
pnpm test
# watch the unit test
pnpm test:watch
# reset the DB
pnpm test:db:reset

# e2e

# install chrome
pnpm exec playwright install chrome
# run the DB and generate the client
pnpm test:db:setup
# test uses a built app since next.js has different cache behavior between development and production
pnpm build
# execute
pnpm test:e2e
```

💁‍♀️ This template recommends using a real database but when you face not keeping idempotency, you might consider using mock.

## Prod

```sh
pnpm db:start
pnpm build
pnpm start
```

If you set `POSTGRESQL_URL` as GitHub secrets, you will be able to execute migration for database on GitHub actions(`.github/workflows/migration.yml`).

## Observability

This project has [OpenTelemetry](https://opentelemetry.io/) and it works only production environment.

### Local

```sh
pnpm db:start
pnpm build
pnpm start
# open Jaeger
open http://localhost:16686/
```

### Server

Please add a url to `process.env.TRACE_EXPORTER_URL`.

## Email

Mocking SendGrid API with MailDev for Development
During development, you can use the [ykanazawa/sendgrid\-maildev \- Docker Image \| Docker Hub](https://hub.docker.com/r/ykanazawa/sendgrid-maildev) to mock the SendGrid API. This setup provides the following benefits:

Mock Server for SendGrid API: Easily simulate email sending without sending real emails.
MailDev Integration: View and verify the results of SendGrid API requests in a mock mailbox through the MailDev interface.
This combination allows seamless email-related development and debugging without affecting production email workflows.

You can access the mock mailbox at [http://localhost:1080](http://localhost:1080), making it simple to debug and validate email functionality during development.

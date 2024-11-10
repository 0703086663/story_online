# Development

Application running by NestJS and PostgreSQL

## Environment

```bash
# Copy env variables
$ cp .env.template .env

# [Account] Default account in dev
ADMIN_PASSWORD=admin        # admin@example.com
MANAGER_PASSWORD=manager    # manager@example.com
USER_PASSWORD=user          # user@example.com

# [Minio] Run minio in local
USE_MINIO=0 # or 1 if use
MINIO_USE_SSL=false # true if production

# [Database]
# If you want example data then set it `1`
USE_FAKE_DATA=
```

## Database

Running postgres then create database name `novel_db`

```bash
# start docker
$ docker compose up postgres

# running container
$ docker exec -it postgres psql -U postgres

# create database if not exist
$ CREATE DATABASE novel_db;
```

## Data and Migrations

```bash
# generate table
$ npx prisma generate

# apply migration
$ npx prisma migrate dev
```

## Development

```bash
# generate fake/dummy data (If needed)
$ npx prisma db seed

# read database (If needed)
$ npx prisma studio
```

## Notes

```bash
# If you gonna change schema then you need run
$ npx prisma migrate dev
# or
$ npx prisma migrate dev --name ${name-migration}
# Then push the prisma/migration with source
```

## Running the app

```bash
# watch mode / development
$ npm run start:dev

# production mode
$ npm run build && npm run start:prod
```

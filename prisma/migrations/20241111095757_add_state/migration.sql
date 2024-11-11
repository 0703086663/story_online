-- CreateEnum
CREATE TYPE "STATE" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "state" "STATE" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "state" "STATE" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "state" "STATE" NOT NULL DEFAULT 'ACTIVE';

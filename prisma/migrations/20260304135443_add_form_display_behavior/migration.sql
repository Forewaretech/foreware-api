-- CreateEnum
CREATE TYPE "DisplayBehavior" AS ENUM ('ALWAYS', 'ONCE_PER_BROWSER', 'ONCE_PER_SESSION');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "displayBehavior" "DisplayBehavior" NOT NULL DEFAULT 'ONCE_PER_BROWSER';

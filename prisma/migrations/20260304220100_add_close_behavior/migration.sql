-- CreateEnum
CREATE TYPE "CloseBehavior" AS ENUM ('SHOW_AGAIN', 'HIDE_FOR_SESSION', 'HIDE_FOR_24H', 'HIDE_FOR_7D');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "closeBehavior" "CloseBehavior" NOT NULL DEFAULT 'HIDE_FOR_24H';

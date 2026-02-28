/*
  Warnings:

  - The values [POPUP] on the enum `TriggerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TriggerType_new" AS ENUM ('EMBED', 'POPUP_PAGE_LOAD', 'POPUP_PAGE_SCROLL', 'POPUP_PAGE_TIME_DELAY');
ALTER TABLE "Form" ALTER COLUMN "triggerType" TYPE "TriggerType_new" USING ("triggerType"::text::"TriggerType_new");
ALTER TYPE "TriggerType" RENAME TO "TriggerType_old";
ALTER TYPE "TriggerType_new" RENAME TO "TriggerType";
DROP TYPE "public"."TriggerType_old";
COMMIT;

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "options" TEXT[];

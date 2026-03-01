/*
  Warnings:

  - The values [LINKEDIN] on the enum `Platform` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAGE_LEVEL] on the enum `TrackingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Platform_new" AS ENUM ('GOOGLE_ADS', 'META_PIXEL', 'GOOGLE_ANALYTICS', 'LINKEDIN_INSIGHT');
ALTER TABLE "TrackingCode" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TYPE "Platform" RENAME TO "Platform_old";
ALTER TYPE "Platform_new" RENAME TO "Platform";
DROP TYPE "public"."Platform_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TrackingType_new" AS ENUM ('CONVERSION', 'PAGE', 'EVENT');
ALTER TABLE "TrackingCode" ALTER COLUMN "type" TYPE "TrackingType_new" USING ("type"::text::"TrackingType_new");
ALTER TYPE "TrackingType" RENAME TO "TrackingType_old";
ALTER TYPE "TrackingType_new" RENAME TO "TrackingType";
DROP TYPE "public"."TrackingType_old";
COMMIT;

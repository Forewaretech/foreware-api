/*
  Warnings:

  - The values [FOOTER] on the enum `Placement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Placement_new" AS ENUM ('HEADER', 'BODY');
ALTER TABLE "TrackingCode" ALTER COLUMN "placement" TYPE "Placement_new" USING ("placement"::text::"Placement_new");
ALTER TYPE "Placement" RENAME TO "Placement_old";
ALTER TYPE "Placement_new" RENAME TO "Placement";
DROP TYPE "public"."Placement_old";
COMMIT;

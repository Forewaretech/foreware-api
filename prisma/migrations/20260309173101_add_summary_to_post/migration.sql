/*
  Warnings:

  - You are about to drop the column `message` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ActivityLog` table. All the data in the column will be lost.
  - Added the required column `summary` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "message",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "action" TEXT,
ADD COLUMN     "detail" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "summary" TEXT NOT NULL;

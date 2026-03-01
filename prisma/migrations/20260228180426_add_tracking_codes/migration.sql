-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('GOOGLE_ADS', 'META_PIXEL', 'GOOGLE_ANALYTICS', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "Placement" AS ENUM ('HEADER', 'BODY', 'FOOTER');

-- CreateEnum
CREATE TYPE "TrackingType" AS ENUM ('CONVERSION', 'PAGE_LEVEL', 'EVENT');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "TrackingCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "placement" "Placement" NOT NULL,
    "type" "TrackingType" NOT NULL,
    "codeSnippet" TEXT NOT NULL,
    "status" "TrackingStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingCode_pkey" PRIMARY KEY ("id")
);

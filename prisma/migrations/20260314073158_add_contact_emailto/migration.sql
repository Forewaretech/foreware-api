-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTo" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cc" TEXT,

    CONSTRAINT "EmailTo_pkey" PRIMARY KEY ("id")
);

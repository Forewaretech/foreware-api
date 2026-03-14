import { prisma } from "../../config/db.js";

export const createUpdate = async (data: { email: string; cc: string }) => {
  // Use a hardcoded ID so Prisma always finds/updates the SAME single record
  const GLOBAL_ID = "SINGLE_RECORD_ID";

  return await prisma.emailTo.upsert({
    where: {
      id: GLOBAL_ID,
    },
    update: {
      email: data.email,
      cc: data.cc,
    },
    create: {
      id: GLOBAL_ID,
      email: data.email,
      cc: data.cc,
    },
  });
};

export const getAllEmailTo = async () => {
  return await prisma.emailTo.findMany();
};

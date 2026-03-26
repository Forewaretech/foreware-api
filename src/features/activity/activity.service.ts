import { prisma } from "../../config/db.js";

export async function logActivity(data: {
  action: string;
  detail: string;
  userId?: string;
  metadata?: any;
}) {
  return prisma.activityLog.create({
    data,
  });
}

export const getAllActivityLogs = async (option: { limit: number }) => {
  return await prisma.activityLog.findMany({
    take: option.limit,
    orderBy: {
      createdAt: "desc",
    },
  });
};

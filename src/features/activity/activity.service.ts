import { prisma } from "../../config/db.js";

export async function logActivity(data: {
  type: string;
  title: string;
  message: string;
  userId: string;
  metadata: any;
}) {
  return prisma.activityLog.create({
    data,
  });
}

// tracking.service.ts
import { prisma } from "../../config/db.js";
import {
  Platform,
  Placement,
  TrackingType,
  TrackingStatus,
} from "../../generated/prisma/enums.js";
import { logActivity } from "../activity/activity.service.js";
import type { CreateTrackingDTO } from "./tracking.validation.js";

export const createTrackingCode = async (data: CreateTrackingDTO) => {
  const createdCode = await prisma.trackingCode.create({
    data: {
      name: data.name,
      platform: data.platform.toUpperCase() as Platform,
      placement: data.placement.toUpperCase() as Placement,
      type: data.type.toUpperCase() as TrackingType,
      codeSnippet: data.codeSnippet,
      status: (data.status?.toUpperCase() as TrackingStatus) ?? "INACTIVE",
    },
  });

  await logActivity({
    action: "Created Tracking Code",
    detail: `Name: ${createdCode.name}`,
    metadata: {
      leadId: createdCode.id,
      date: Date.now(),
    },
    userId: createdCode?.userId || "",
  });

  return;
};

export const getAllTrackingCodes = async () => {
  return prisma.trackingCode.findMany();
};

export const getTrackingCodeById = async (id: string) => {
  return prisma.trackingCode.findUnique({ where: { id } });
};

export const updateTrackingCode = async (
  id: string,
  data: Partial<CreateTrackingDTO>,
) => {
  const updatedTracking = await prisma.trackingCode.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.platform && {
        platform: data.platform.toUpperCase() as Platform,
      }),
      ...(data.placement && {
        placement: data.placement.toUpperCase() as Placement,
      }),
      ...(data.type && {
        type: data.type.toUpperCase() as TrackingType,
      }),
      ...(data.codeSnippet && { codeSnippet: data.codeSnippet }),
      ...(data.status && {
        status: data.status.toUpperCase() as TrackingStatus,
      }),
    },
  });

  await logActivity({
    action: "Deleted Tracking Code",
    detail: `Name: ${updatedTracking.name}`,
    metadata: {
      leadId: updatedTracking.id,
      date: Date.now(),
    },
    userId: updatedTracking?.userId || "",
  });

  return;
};

export const deleteTrackingCode = async (id: string) => {
  const deletedCode = await prisma.trackingCode.delete({ where: { id } });

  await logActivity({
    action: "Deleted Tracking Code",
    detail: `Name: ${deletedCode.name}`,
    metadata: {
      leadId: deletedCode.id,
      date: Date.now(),
    },
    userId: deletedCode?.userId || "",
  });

  return deletedCode;
};

export const getPublicTrackingCodes = async (placement?: string) => {
  const whereClause: any = {
    status: TrackingStatus.ACTIVE,
  };

  if (placement) {
    whereClause.placement = placement.toUpperCase() as Placement;
  }

  return prisma.trackingCode.findMany({
    where: whereClause,
    select: {
      id: true,
      placement: true,
      codeSnippet: true,
    },
  });
};

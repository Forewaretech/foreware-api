// tracking.service.ts
import { prisma } from "../../config/db.js";
import {
  Platform,
  Placement,
  TrackingType,
  TrackingStatus,
} from "../../generated/prisma/enums.js";
import type { CreateTrackingDTO } from "./tracking.validation.js";

export const createTrackingCode = async (data: CreateTrackingDTO) => {
  return prisma.trackingCode.create({
    data: {
      name: data.name,
      platform: data.platform.toUpperCase() as Platform,
      placement: data.placement.toUpperCase() as Placement,
      type: data.type.toUpperCase() as TrackingType,
      codeSnippet: data.codeSnippet,
      status: (data.status?.toUpperCase() as TrackingStatus) ?? "INACTIVE",
    },
  });
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
  return prisma.trackingCode.update({
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
};

export const deleteTrackingCode = async (id: string) => {
  return prisma.trackingCode.delete({ where: { id } });
};

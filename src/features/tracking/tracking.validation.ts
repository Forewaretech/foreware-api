// tracking.validation.ts
import { z } from "zod";

export enum PlatformEnum {
  google_ads = "google_ads",
  meta_pixel = "meta_pixel",
  google_analytics = "google_analytics",
  linkedin = "linkedin_insight",
}

export enum PlacementEnum {
  header = "header",
  body = "body",
}

export enum TrackingTypeEnum {
  conversion = "conversion",
  page_level = "page",
  event = "event",
}

const trackingBodySchema = z.object({
  name: z.string().min(1),
  platform: z.enum(PlatformEnum),
  placement: z.enum(PlacementEnum),
  type: z.enum(TrackingTypeEnum),
  codeSnippet: z.string().min(1),
  status: z.enum(["active", "inactive"]).optional(),
});

export const createTrackingSchema = z.object({
  body: trackingBodySchema,
});

export const updateTrackingSchema = z.object({
  body: trackingBodySchema.partial(),
});

export const trackingQuerySchema = z.object({
  query: z.object({
    placement: z.enum(PlacementEnum),
  }),
});

export type CreateTrackingDTO = z.infer<typeof trackingBodySchema>;
export type UpdateTrackingDTO = z.infer<typeof trackingBodySchema.partial>;

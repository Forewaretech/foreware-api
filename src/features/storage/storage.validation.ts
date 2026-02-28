import z from "zod";

export const presignedUrlSchema = z.object({
  // This matches the { body: req.body } structure in your middleware
  body: z.object({
    fileType: z.string().min(1, "file type is required").includes("/"),
    fileName: z.string().min(1, "file name is required"),
    folder: z.string().optional(),
  }),
  // You can also add validation for query or params here later
  // query: z.object({ ... }),
  // params: z.object({ ... })
});

export type PresignedUrlDTO = z.infer<typeof presignedUrlSchema>["body"];

export const urlSchema = z.object({
  query: z.object({
    url: z.url(),
  }),
});

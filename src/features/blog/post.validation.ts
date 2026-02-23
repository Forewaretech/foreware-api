import z from "zod";

export const postValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required"),
    slug: z.string().min(1, "slug is required"),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    featuredImage: z.string().optional(),
    featuredImageTitle: z.string().optional(),
    featuredImageCaption: z.string().optional(),
    content: z.string().min(1, "content is required"),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required").optional(),
    slug: z.string().min(1, "slug is required").optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    featuredImage: z.string().optional(),
    featuredImageTitle: z.string().optional(),
    featuredImageCaption: z.string().optional(),
    content: z.string().min(1, "content is required").optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const idValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export type PostDTO = z.infer<typeof postValidationSchema>["body"];

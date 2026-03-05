import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { removeUndefinedFields } from "../../utils/prisma_helpers.js";
import { logActivity } from "../activity/activity.service.js";
import { deleteS3Object } from "../storage/storage.service.js";
import type { PostDTO } from "./post.validation.js";

export const getAllPosts = async () => {
  return await prisma.post.findMany();
};

// export const deletePost = async (id: string) => {
//   return await prisma.post.delete({ where: { id } });
// };

export const deletePost = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: { featuredImage: true },
  });

  if (!post) throw new AppError("Post not found", 404);

  // NON-BLOCKING APPROACH
  if (post.featuredImage) {
    // We call the function but we DON'T 'await' it here if we want
    // the DB to delete immediately regardless of S3's speed.
    // OR, we await it but catch the error so it doesn't bubble up.
    deleteS3Object(post.featuredImage).catch((err) => {
      console.error("S3 Cleanup failed, but proceeding with DB delete:", err);
    });
  }

  // This will run even if deleteS3Object is still working or failed
  return await prisma.post.delete({
    where: { id },
  });
};

export const getPost = async (id: string) => {
  return await prisma.post.findFirst({ where: { id } });
};

export const createPost = async (postData: PostDTO) => {
  // User that is creating the post
  const superAdmin = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  if (!superAdmin) {
    throw new AppError("User not found", 404);
  }

  const createdPost = await prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      status: postData.status,
      category: postData.category || null,
      featuredImage: postData.featuredImage || null,
      featuredImageCaption: postData.featuredImageCaption || null,
      featuredImageTitle: postData.featuredImageTitle || null,
      seoDescription: postData.seoDescription || null,
      seoTitle: postData.seoTitle || null,
      userId: superAdmin.id,
    },
  });

  await logActivity({
    type: "post",
    title: "New post created",
    message: `Blog post published: ${createdPost.title}`,
    metadata: { postId: createdPost.id },
    userId: user.id,
  });

  return createdPost;
};

export const updatePost = async (id: string, updateData: Partial<PostDTO>) => {
  // Check if post exists first to give a clean 404
  const existingPost = await prisma.post.findUnique({ where: { id } });

  if (!existingPost) {
    throw new AppError("Post not found", 404);
  }

  // 1. Remove undefined keys so Prisma doesn't complain
  const cleanData = removeUndefinedFields(updateData);

  return await prisma.post.update({
    where: { id },
    data: cleanData,
  });
};

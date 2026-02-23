import {
  createPost,
  getAllPosts,
  deletePost,
  getPost,
  updatePost,
} from "./post.service.js";

import type { Response, Request } from "express";

export const getPostsController = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.json(posts);
};

export const createPostController = async (req: Request, res: Response) => {
  const {
    title,
    content,
    slug,
    status,
    category,
    featuredImage,
    featuredImageCaption,
    featuredImageTitle,
    seoDescription,
    seoTitle,
  } = req.body;

  const newPost = await createPost({
    title,
    content,
    slug,
    status,
    category,
    featuredImage,
    featuredImageCaption,
    featuredImageTitle,
    seoDescription,
    seoTitle,
  });

  res.status(201).json(newPost);
};

export const deletePostsController = async (req: Request, res: Response) => {
  const posts = await deletePost(req.params.id as string);
  res.status(200).json(posts);
};

export const getPostController = async (req: Request, res: Response) => {
  const posts = await getPost(req.params.id as string);
  res.status(200).json(posts);
};

export const updatePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  // req.body is already validated by your Zod middleware here
  const updatedPost = await updatePost(id as string, req.body);

  res.status(200).json({
    status: "success",
    data: updatedPost,
  });
};

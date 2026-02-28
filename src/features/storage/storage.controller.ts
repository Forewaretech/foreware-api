import type { Request, Response } from "express";
import { deleteS3Object, getPresignedImage } from "./storage.service.js";

export const presignedUrlController = async (req: Request, res: Response) => {
  const { fileName, fileType, folder = "default" } = req.body;
  const { uploadUrl, key, fileUrl } = await getPresignedImage({
    fileName,
    fileType,
    folder: folder || "default",
  });

  res.status(201).json({ uploadUrl, key, fileUrl });
};

export const deleteS3ObjectController = async (req: Request, res: Response) => {
  const { url } = req.query;
  console.log("URL :", url);
  await deleteS3Object(url as string);
  res.status(200).json({ url });
};

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Response, Request } from "express";
import { s3Client } from "../../config/aws.config.js";
import { AppError } from "../../utils/AppError.js";
import { cleanFileName } from "../../utils/s3Helpers.js";

export const presignedUrlController = async (req: Request, res: Response) => {
  // 1. Data is already validated by middleware before reaching here
  const { fileName, fileType, folder = "default" } = req.body;

  const key = `${folder}/${cleanFileName(fileName)}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  // 2. Await the async call. In Express 5, if this rejects,
  // it automatically hits your Global Error Handler.
  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 120, // 2 minutes
  });

  if (!uploadUrl) {
    throw new AppError("Failed to generate upload URL", 500);
  }

  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  res.status(201).json({
    uploadUrl,
    fileUrl,
  });

  res.json({ uploadUrl, key, fileUrl });
};

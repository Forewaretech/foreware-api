import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../config/aws.config.js";
import { cleanFileName } from "../../utils/s3_helpers.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../utils/AppError.js";

export const deleteS3Object = async (fileUrl: string) => {
  try {
    // 1. Check if it's an AWS URL (adjust the bucket name to match yours)
    const isAwsUrl = fileUrl.includes("amazonaws.com");
    if (!isAwsUrl) return;

    // 2. Extract the Key (everything after the bucket domain)
    // URL: https://bucket.s3.region.amazonaws.com/blog/image.png
    // Key: blog/image.png
    const urlParts = new URL(fileUrl);

    const key = urlParts.pathname.substring(1); // Removes the leading slash

    // 3. Send Delete Command
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    );

    console.log(`Successfully deleted S3 object: ${key}`);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    // We usually log this but don't stop the whole process
    // to avoid "orphaned" files blocking DB cleanup
  }
};

export const getPresignedImage = async (data: {
  fileName: string;
  fileType: string;
  folder?: string;
}) => {
  // 1. Data is already validated by middleware before reaching here
  const { fileName, fileType, folder = "default" } = data;

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

  return { uploadUrl, key, fileUrl };
};

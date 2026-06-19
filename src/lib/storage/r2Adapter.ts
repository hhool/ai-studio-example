import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
// 做了双重保险，无论你在 Vercel 填的是带 _ID 还是不带的，都能读到
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY || "";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "kidsmobi";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://downloader.poki2.online";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
  // 👇 就是这一行解决了 DNS 解析失败的畸形 URL 问题！
  forcePathStyle: true, 
});

export const r2Adapter = {
  getUploadUrl: async (key, contentType) => {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    // Return the presigned url and the final public url
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    return { uploadUrl, publicUrl };
  },
  
  deleteAsset: async (key) => {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await client.send(command);
  }
};
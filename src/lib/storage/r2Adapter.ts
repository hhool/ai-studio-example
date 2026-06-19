import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT; // e.g. https://<account>.r2.cloudflarestorage.com
const region = process.env.R2_REGION || "auto";
const bucket = process.env.R2_BUCKET;

const s3 = new S3Client({
  endpoint: endpoint || undefined,
  region,
  credentials: process.env.R2_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        sessionToken: process.env.R2_SESSION_TOKEN || process.env.R2_TOKEN || undefined,
      }
    : undefined,
  forcePathStyle: false,
});

export async function getPresignedPutUrl(key: string, expiresSeconds = 300) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
  return url;
}

export async function getPresignedGetUrl(key: string, expiresSeconds = 300) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  // Try signing with the configured client first
  try {
    const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
    return url;
  } catch (e) {
    // fallback: try signing against the bucket-subdomain endpoint so signature's host matches public URL
  }

  if (!endpoint) throw new Error('R2_ENDPOINT not configured for fallback');
  const host = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const bucketEndpoint = `https://${bucket}.${host}`;
  // create a temporary client configured to use the bucket subdomain as endpoint
  const tmpClient = new S3Client({
    endpoint: bucketEndpoint,
    region,
    credentials: process.env.R2_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          sessionToken: process.env.R2_SESSION_TOKEN || process.env.R2_TOKEN || undefined,
        }
      : undefined,
    forcePathStyle: false,
  });
  const tmpUrl = await getSignedUrl(tmpClient, cmd, { expiresIn: expiresSeconds });
  return tmpUrl;
}

// Read object bytes using server credentials — useful for dev verification
export async function fetchObjectBuffer(key: string) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const res = await s3.send(cmd);
  // res.Body is a stream in Node.js; collect into buffer
  const stream = res.Body as any;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);
  return { buffer, contentType: (res.ContentType as string) || 'application/octet-stream' };
}

export async function uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  // Ensure credentials exist for server-side upload
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured for server upload');
  }
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType || 'application/octet-stream' });
  await s3.send(cmd);
  return { url: await getObjectUrl(key), size: buffer.length };
}

export async function getObjectUrl(key: string) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  if (!endpoint) {
    // If no explicit endpoint, return a path-like s3 url
    return `s3://${bucket}/${key}`;
  }
  // Public URL via endpoint
  // Cloudflare R2 endpoints typically serve objects at <account>.r2.cloudflarestorage.com/<bucket>/<key>
  // Prefer bucket-subdomain style: <bucket>.<endpoint-host>/<key>
    try {
      const host = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '');
      // Use encodeURI so that path separators (/) remain as path segments
      return `https://${bucket}.${host}/${encodeURI(key)}`;
    } catch (e) {
      return `${endpoint.replace(/\/$/, '')}/${bucket}/${encodeURI(key)}`;
    }
}

export async function deleteObject(key: string) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  // If credentials are not configured, surface a clear error
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured');
  }
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  try {
    await s3.send(cmd);
    return true;
  } catch (e: any) {
    console.warn('r2Adapter.deleteObject error', e?.message || e);
    return false;
  }
}

export async function statObject(key: string) {
  if (!bucket) throw new Error('R2_BUCKET not configured');
  const cmd = new HeadObjectCommand({ Bucket: bucket, Key: key });
  try {
    const res = await s3.send(cmd);
    return { size: res.ContentLength };
  } catch (e) {
    return null;
  }
}

export default { getPresignedPutUrl, getPresignedGetUrl, uploadBuffer, getObjectUrl, deleteObject, statObject, fetchObjectBuffer };

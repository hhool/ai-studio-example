import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

async function run() {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  const key = `tests/direct-${Date.now()}.txt`;

  const client = new S3Client({
    endpoint: endpoint || undefined,
    region: process.env.R2_REGION || 'auto',
    credentials: process.env.R2_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          sessionToken: process.env.R2_SESSION_TOKEN || process.env.R2_TOKEN || undefined,
        }
      : undefined,
  });

  try {
    console.log('attempting PutObject', { bucket, key });
    const put = new PutObjectCommand({ Bucket: bucket, Key: key, Body: 'direct test payload' });
    const pres = await client.send(put);
    console.log('put ok', pres);

    const head = new HeadObjectCommand({ Bucket: bucket, Key: key });
    const info = await client.send(head);
    console.log('head ok', { size: info.ContentLength });

    const del = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await client.send(del);
    console.log('deleted ok');
  } catch (e: any) {
    console.error('direct SDK error', e?.name, e?.message);
    if (e?.$metadata) console.error('metadata', e.$metadata);
    process.exitCode = 2;
  }
}

run();

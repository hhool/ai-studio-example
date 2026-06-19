Cloudflare R2 — Public Access & Presign Troubleshooting

This document explains options to make objects accessible and troubleshoot presigned URL issues.

1) Quick: Enable public read access (console)
- Go to Cloudflare Dashboard → R2 → Buckets → select your bucket (e.g., `kidsmobi`).
- Under "Bucket settings" enable "Public access" or set a public policy that allows `GetObject` for `/*`.
- Save changes. Wait a few seconds for propagation.
- Verify by uploading an object and doing:
  curl -I https://<bucket>.<account>.r2.cloudflarestorage.com/<path/to/object>

2) Preferred production flow: presigned PUT/GET
- Keep bucket private; generate presigned PUT for uploads and presigned GET for downstream consumers.
- Ensure presigned URLs are signed with the same host form as you will use to access them. Two common host styles:
  - Account endpoint + path-style: `https://<account>.r2.cloudflarestorage.com/<bucket>/<key>`
  - Bucket subdomain: `https://<bucket>.<account>.r2.cloudflarestorage.com/<key>`
- If presigned GET returns `403`, try generating the presign with the bucket-subdomain endpoint (our server now attempts this fallback automatically).

3) Dev fallback (recommended for local dev)
- Keep bucket private and use server-side proxy for previewing uploaded files (we added `/api/assets/fetch?key=...`).
- Admin UI will use the server fetch for previews when public URLs are not available.

4) Common causes of 400/403 on public GET
- Bucket remains private — enable public read or use presigned GET.
- URL encoding: Signed requests expect the same canonical URI used during signing. Use unencoded path segments when accessing bucket-subdomain URLs.
- Session tokens / temporary credentials: avoid mixing temp tokens between presigner and requester; server-side presigner should use same credentials.

5) Testing checklist
- Upload via server proxy, then call `/api/assets/fetch?key=...` (server will read with credentials).
- Generate presigned GET via `/api/assets/presign` and try curl -I on the returned `getUrl`.
- If presigned GET fails but server fetch works, consider enabling public access or switching to bucket-subdomain presigning.

6) Security note
- Public buckets expose all objects; prefer presigned URLs or Cloudflare Workers to proxy if you need control.

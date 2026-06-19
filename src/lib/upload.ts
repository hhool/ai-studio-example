export async function uploadAssetFile(file: File, key: string) {
  // Request presigned upload URL from backend
  const pres = await fetch('/api/assets/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  if (!pres.ok) throw new Error('Presign request failed');
  const presj = await pres.json();
  const uploadUrl: string = presj.uploadUrl;

  // If server returned a local proxy (starts with /api), use form POST
  let upJson: any = null;
  if (uploadUrl.startsWith('/')) {
    const fd = new FormData();
    fd.append('file', file as unknown as Blob);
    const upRes = await fetch(uploadUrl, { method: 'POST', body: fd });
    if (!upRes.ok) throw new Error('Upload failed');
    upJson = await upRes.json();
  } else {
    // Assume presigned direct URL (PUT)
    const putRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } });
    if (!putRes.ok && putRes.status !== 200 && putRes.status !== 201 && putRes.status !== 204) {
      throw new Error('Direct upload failed: ' + putRes.status);
    }
    // For direct uploads we don't get a JSON body back; construct a public URL if provided by backend later
    upJson = { url: null };
  }

  // Notify backend upload complete (metadata recording)
  const compRes = await fetch('/api/assets/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, size: file.size, contentType: file.type, uploadedBy: 'admin' }),
  });
  let compJson: any = {};
  try {
    compJson = await compRes.json();
  } catch (e) {
    // ignore
  }

  // Prefer a server-provided public URL
  const publicUrl = compJson?.url || upJson?.url || null;

  // Attempt server-side fetch preview (useful in dev when public URL is unavailable)
  try {
    const previewRes = await fetch(`/api/assets/fetch?key=${encodeURIComponent(key)}`);
    if (previewRes.ok) {
      const blob = await previewRes.blob();
      const objUrl = URL.createObjectURL(blob);
      return objUrl; // usable preview URL in the browser
    }
  } catch (e) {
    // ignore and fall back
  }

  // Fall back to public URL or key
  return publicUrl || key;
}

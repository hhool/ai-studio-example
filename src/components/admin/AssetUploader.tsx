import React from "react";
import { uploadAssetFile } from "../../lib/upload";

export default function AssetUploader({ onUploaded, defaultKeyPrefix = "tests/" }: any) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const key = `${defaultKeyPrefix}${Date.now()}-${f.name}`;
    try {
      const url = await uploadAssetFile(f, key);
      // url may be an object URL (preview) or public URL
      alert("Uploaded: " + url);
      onUploaded && onUploaded(url, key);
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div className="space-y-2">
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
      <button onClick={handlePick} className="px-4 py-2 bg-slate-900 text-white rounded-xl">Upload Asset</button>
    </div>
  );
}

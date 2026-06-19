import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDirname = () => {
  try {
    if (typeof __dirname !== 'undefined') return __dirname;
    // @ts-ignore
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return process.cwd();
  }
};
const UPLOADS_DIR = path.join(getDirname(), "../../../uploads");

// Ensure root directory exists (Wrap in try-catch for Vercel Serverless read-only filesystem)
if (!process.env.VERCEL) {
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create local uploads directory (likely running on read-only serverless environment like Vercel). Local fallback will not work.");
}
}

export const localAdapter = {
  getUploadUrl: async (key: string, contentType: string) => {
    const uploadUrl = `/api/assets/upload-local?key=${encodeURIComponent(key)}`;
    const publicUrl = `/uploads/${key}`;
    return { uploadUrl, publicUrl };
  },
  
  deleteAsset: async (key: string) => {
    const filePath = path.join(UPLOADS_DIR, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

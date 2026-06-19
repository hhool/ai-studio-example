import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../../uploads");

// Ensure root directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

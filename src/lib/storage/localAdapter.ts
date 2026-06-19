import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Prefer workspace-relative resource folder based on process.cwd()
const ASSETS_ROOT = path.resolve(process.cwd(), "../resource/assets");

function ensureDir(dir: string) {
  return mkdir(dir, { recursive: true }).catch(() => undefined);
}

export async function uploadBuffer(key: string, buffer: Buffer) {
  const dest = path.join(ASSETS_ROOT, key);
  await ensureDir(path.dirname(dest));
  await writeFile(dest, buffer);
  const s = await stat(dest);
  return {
    url: `/local-assets/${encodeURIComponent(key)}`,
    size: s.size,
    path: dest,
  };
}

export async function deleteObject(key: string) {
  const dest = path.join(ASSETS_ROOT, key);
  return fs.promises.unlink(dest).catch(() => undefined);
}

export async function statObject(key: string) {
  const dest = path.join(ASSETS_ROOT, key);
  try {
    const s = await stat(dest);
    return { size: s.size, path: dest };
  } catch (e) {
    return null;
  }
}

export default {
  uploadBuffer,
  deleteObject,
  statObject,
};

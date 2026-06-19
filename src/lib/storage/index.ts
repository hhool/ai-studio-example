import { r2Adapter } from "./r2Adapter";
import { localAdapter } from "./localAdapter";

// Use 'r2' for production, 'local' for development fallback
const STORAGE_MODE = process.env.STORAGE_MODE || "local";

export const storageAdapter = STORAGE_MODE === "r2" ? r2Adapter : localAdapter;

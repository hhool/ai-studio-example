import type { CMSProduct, CMSSettings, Evaluation } from "../types";

export interface ContentBundle {
  settings: CMSSettings | null;
  products: CMSProduct[];
  evaluations: Evaluation[];
}

export function isScrapedContentSource(): boolean {
  return (import.meta.env.VITE_CONTENT_SOURCE ?? "cms").toLowerCase() === "scraped";
}

export async function fetchContentBundle(): Promise<ContentBundle> {
  const response = await fetch("/api/content/bundle", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    const suffix = details ? `: ${details}` : "";
    throw new Error(`Content bundle request failed (${response.status}${suffix})`);
  }

  const payload = (await response.json()) as Partial<ContentBundle>;

  return {
    settings: payload.settings ?? null,
    products: Array.isArray(payload.products) ? payload.products : [],
    evaluations: Array.isArray(payload.evaluations) ? payload.evaluations : [],
  };
}
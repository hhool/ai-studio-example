import { CMSProduct } from "../types";

export interface ProductValidationResult {
  valid: boolean;
  errors: string[];
}

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateCMSProduct(product: CMSProduct): ProductValidationResult {
  const errors: string[] = [];

  if (!product.id?.trim()) errors.push("Missing product id.");
  if (!product.brand?.trim()) errors.push("Missing brand.");
  if (!product.zh?.name?.trim()) errors.push("Missing ZH name.");
  if (!product.en?.name?.trim()) errors.push("Missing EN name.");
  if (!product.category?.trim()) errors.push("Missing category.");

  const cover = (product.imageUrl || "").trim();
  if (!cover) {
    errors.push("Missing primary cover image URL.");
  } else if (!isValidHttpUrl(cover)) {
    errors.push("Primary cover image URL must be http(s).");
  }

  (product.galleryUrls || []).forEach((url, idx) => {
    if (url.trim() && !isValidHttpUrl(url.trim())) {
      errors.push(`Gallery image #${idx + 1} is not a valid http(s) URL.`);
    }
  });

  if ((product.videoUrl || "").trim() && !isValidHttpUrl((product.videoUrl || "").trim())) {
    errors.push("Legacy videoUrl must be http(s).");
  }

  (product.videos || []).forEach((video, idx) => {
    if (!video.url?.trim()) {
      errors.push(`Structured video #${idx + 1} is missing URL.`);
      return;
    }
    if (!isValidHttpUrl(video.url.trim())) {
      errors.push(`Structured video #${idx + 1} is not a valid http(s) URL.`);
    }
  });

  const relatedIds = product.relatedProductIds || [];
  if (relatedIds.includes(product.id)) {
    errors.push("relatedProductIds must not include self id.");
  }

  const scenarios = product.scenarios || [];
  if (product.status === "published" && scenarios.length === 0) {
    errors.push("Published product requires at least one scenario.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

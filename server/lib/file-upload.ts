import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

/**
 * File upload configuration
 */
export const FILE_UPLOAD_CONFIG = {
  // Maximum file size: 2MB for images, 5MB for PDFs
  MAX_FILE_SIZE: 2 * 1024 * 1024,
  MAX_PDF_SIZE: 5 * 1024 * 1024,
  // Allowed image MIME types
  ALLOWED_IMAGE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  // Allowed PDF MIME types
  ALLOWED_PDF_TYPES: ["application/pdf"],
  // Upload directory relative to project root
  UPLOAD_DIR: path.join(process.cwd(), "public", "uploads"),
  // Public URL prefix for uploaded files
  PUBLIC_URL_PREFIX: "/uploads",
};

/**
 * Validate uploaded file
 */
export function validateFile(file: File, allowPDF: boolean = false): { valid: boolean; error?: string } {
  const allowedTypes = allowPDF 
    ? [...FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES, ...FILE_UPLOAD_CONFIG.ALLOWED_PDF_TYPES]
    : FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES;
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size (different limits for PDFs)
  const maxSize = allowPDF && file.type === "application/pdf" 
    ? FILE_UPLOAD_CONFIG.MAX_PDF_SIZE 
    : FILE_UPLOAD_CONFIG.MAX_FILE_SIZE;
    
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const randomString = randomBytes(16).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${randomString}${ext}`;
}

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir(): Promise<void> {
  if (!existsSync(FILE_UPLOAD_CONFIG.UPLOAD_DIR)) {
    await mkdir(FILE_UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save uploaded file to disk and return public URL
 */
export async function saveUploadedFile(file: File, userId: string, allowPDF: boolean = false): Promise<string> {
  // Validate file
  const validation = validateFile(file, allowPDF);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed");
  }

  // Ensure upload directory exists
  await ensureUploadDir();

  // Generate unique filename
  const filename = generateUniqueFilename(file.name);
  const filePath = path.join(FILE_UPLOAD_CONFIG.UPLOAD_DIR, filename);

  // Convert File to Buffer and save
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);

  // Return public URL
  return `${FILE_UPLOAD_CONFIG.PUBLIC_URL_PREFIX}/${filename}`;
}

/**
 * Delete uploaded file by URL
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  if (!fileUrl || !fileUrl.startsWith(FILE_UPLOAD_CONFIG.PUBLIC_URL_PREFIX)) {
    return; // Not a valid upload URL, skip deletion
  }

  const filename = path.basename(fileUrl);
  const filePath = path.join(FILE_UPLOAD_CONFIG.UPLOAD_DIR, filename);

  // Use dynamic import to avoid issues if fs/promises is not available
  const { unlink } = await import("fs/promises");
  
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    // Log error but don't throw - file deletion is not critical
    console.error(`Failed to delete file ${filePath}:`, error);
  }
}

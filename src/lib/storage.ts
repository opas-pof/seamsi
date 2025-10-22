import { supabase } from "./supabase";

export const TEMPLE_BUCKET = "temple-images";

function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() as string : "bin";
}

function buildTempleImagePath(templeId: string, filename: string): string {
  const ext = getExtension(filename);
  const safeId = templeId.trim() || "unknown";
  return `${safeId}/${Date.now()}.${ext}`;
}

export async function uploadTempleImage(file: File, templeId: string): Promise<string> {
  const path = buildTempleImagePath(templeId, file.name);
  const { error } = await supabase.storage.from(TEMPLE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });
  if (error) throw error;
  const { data } = supabase.storage.from(TEMPLE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function buildTempleSeoImagePath(templeId: string, filename: string): string {
  const ext = getExtension(filename);
  const safeId = templeId.trim() || "unknown";
  return `${safeId}/seo/${Date.now()}.${ext}`;
}

export async function uploadTempleSeoImage(file: File, templeId: string): Promise<string> {
  const path = buildTempleSeoImagePath(templeId, file.name);
  const { error } = await supabase.storage.from(TEMPLE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });
  if (error) throw error;
  const { data } = supabase.storage.from(TEMPLE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function buildFortuneSeoImagePath(templeId: string, fortuneNumber: number, filename: string): string {
  const ext = getExtension(filename);
  const safeId = templeId.trim() || "unknown";
  const num = Number.isFinite(fortuneNumber) ? fortuneNumber : 0;
  return `${safeId}/fortunes/${num}/seo/${Date.now()}.${ext}`;
}

export async function uploadFortuneSeoImage(file: File, templeId: string, fortuneNumber: number): Promise<string> {
  const path = buildFortuneSeoImagePath(templeId, fortuneNumber, file.name);
  const { error } = await supabase.storage.from(TEMPLE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });
  if (error) throw error;
  const { data } = supabase.storage.from(TEMPLE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}



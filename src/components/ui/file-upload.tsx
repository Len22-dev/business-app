import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { createClient } from "@/lib/supabase/client";

interface FileUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  accept?: string;
  folder?: string; // Optional: folder path inside the bucket
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  onUpload,
  accept = "image/*,application/pdf",
  folder = "",
  label = "Upload File",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Generate a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (!data.publicUrl) throw new Error("Failed to get public URL");
      onUpload(data.publicUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Upload failed");
      } else {
        setError("Upload failed");
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}; 
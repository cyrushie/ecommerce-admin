"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { urlToHttpOptions } from "url";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [url, setUrl] = useState("");

  const onSuccess = (result: any) => {
    setUrl(result.info.secure_url);
  };

  useEffect(() => {
    onChange(url);
  }, [url]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {value.map((url) => {
          return (
            <div
              key={url}
              className="w-[200px] h-[200px] relative rounded-md overflow-hidden"
            >
              <div className="absolute z-10 top-2 right-2">
                <Button
                  disabled={disabled}
                  size="icon"
                  variant="destructive"
                  onClick={() => onRemove(url)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Image
                fill
                alt="background image"
                src={url}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
      <CldUploadWidget
        onSuccess={onSuccess}
        uploadPreset="hktdlpeu"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              onClick={onClick}
              variant="secondary"
              size="sm"
              type="button"
              disabled={disabled}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

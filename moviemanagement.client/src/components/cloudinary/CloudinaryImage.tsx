import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

interface CloudinaryImageProps {
  imageUrl: string;
  hd?: boolean; // Pass true to get HD image
}

export const ENV = {
  CLOUDINARY_CLOUD_NAME:
    (import.meta.env.VITE_CLOUND_NAME as string) ?? "Not found",
};

const cld = new Cloudinary({
  cloud: {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
  },
});

const extractPublicId = (url: string): string => {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex > -1 && parts.length > uploadIndex + 1) {
    return parts.slice(uploadIndex + 1).join("/");
  }
  return "";
};

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  imageUrl,
  hd = false,
}) => {
  const publicId = extractPublicId(imageUrl);

  if (!ENV.CLOUDINARY_CLOUD_NAME)
    throw new Error("Cloudinary cloud name is not found");

  console.log(`Env ne ${ENV.CLOUDINARY_CLOUD_NAME}`);

  let img = cld.image(publicId).format("auto").quality("auto");

  // If hd prop is true, request a higher resolution image
  if (hd) {
    img = img.resize(auto().gravity(autoGravity()).width(1920).height(1080));
  }

  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

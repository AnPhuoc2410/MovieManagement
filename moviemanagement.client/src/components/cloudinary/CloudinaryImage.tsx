import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import React from "react";
import { ENV } from "../../env/env.config";

interface CloudinaryImageProps {
  imageUrl: string;
  hd?: boolean; // Pass true to get HD image
}

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

  let img = cld.image(publicId).format("auto").quality("auto");

  // If hd prop is true, request a higher resolution image
  if (hd) {
    img = img.resize(auto().gravity(autoGravity()).width(1920).height(1080));
  }

  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

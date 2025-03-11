import React from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { ENV } from "../../env/env.config";

interface CloudinaryImageProps {
  imageUrl: string;
  hd?: boolean; // Set true to request a high-resolution image
}

const cld = new Cloudinary({
  cloud: {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
  },
});

/**
 * Extracts the public ID from a Cloudinary URL.
 * It assumes the format: "https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}"
 */
const extractPublicId = (url: string): string => {
  try {
    const urlObject = new URL(url);
    const pathParts = urlObject.pathname.split("/");
    const uploadIndex = pathParts.indexOf("upload");

    if (uploadIndex > -1 && pathParts.length > uploadIndex + 1) {
      return pathParts.slice(uploadIndex + 1).join("/");
    }
  } catch (error) {
    console.error("Invalid Cloudinary URL:", url);
  }
  return "";
};

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({ imageUrl, hd = false }) => {
  if (!imageUrl) {
    console.warn("Missing image URL for CloudinaryImage component.");
    return null;
  }

  const publicId = extractPublicId(imageUrl) || "default-image"; // Set a fallback image ID

  console.log("Cloudinary Image URL:", imageUrl);
  console.log("Extracted Public ID:", publicId);

  let img = cld.image(publicId).format("auto").quality("auto");

  // If hd prop is true, request a higher resolution image
  if (hd) {
    img = img.resize(auto().gravity(autoGravity()).width(1920).height(1080));
  }

  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

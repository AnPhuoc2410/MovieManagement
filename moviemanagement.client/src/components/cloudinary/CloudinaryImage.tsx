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
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUND_NAME as string,
}

// Initialize Cloudinary instance with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
  },
});

// Helper function to extract publicId from the full URL
const extractPublicId = (url: string): string => {
  // Expected URL format: 
  // https://res.cloudinary.com/dwqyqsqmq/image/upload/{public_id}
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex > -1 && parts.length > uploadIndex + 1) {
    return parts.slice(uploadIndex + 1).join('/');
  }
  return '';
};

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({ imageUrl, hd = false }) => {
  const publicId = extractPublicId(imageUrl);
console.log(`Env ne ${ENV.CLOUDINARY_CLOUD_NAME}`)

  let img = cld.image(publicId).format('auto').quality('auto');

  // If hd prop is true, request a higher resolution image
  if (hd) {
    img = img.resize(auto().gravity(autoGravity()).width(1920).height(1080));
  }
  
  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

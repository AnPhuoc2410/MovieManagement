import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

interface CloudinaryImageProps {
  imageUrl: string;
  hd?: boolean; // Pass true to get HD image
}

// Initialize Cloudinary instance with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dwqyqsqmq'
  }
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
  let img = cld.image(publicId).format('auto').quality('auto');

  // If hd prop is true, request a higher resolution image
  if (hd) {
    img = img.resize(auto().gravity(autoGravity()).width(1920).height(1080));
  }
  
  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

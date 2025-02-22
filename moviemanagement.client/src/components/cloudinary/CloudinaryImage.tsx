import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

interface CloudinaryImageProps {
  imageUrl: string;
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
  // https://res.cloudinary.com/dwqyqsqmq/image/upload/{version}/{public_id}
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex > -1 && parts.length > uploadIndex + 2) {
    return parts.slice(uploadIndex + 2).join('/');
  }
  return url;
};

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({ imageUrl }) => {
  const publicId = extractPublicId(imageUrl);
  const img = cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(100).height(50));

  return <AdvancedImage cldImg={img} />;
};

export default CloudinaryImage;

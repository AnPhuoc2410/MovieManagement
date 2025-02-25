import React, { useEffect, useRef } from "react";
import Button from "@mui/material/Button";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadWidgetProps {
  uwConfig: any;
  setPublicId: (publicId: string) => void;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  uwConfig,
  setPublicId,
}) => {
  const uploadWidgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.cloudinary) {
      // Initialize the Cloudinary upload widget with your configuration
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Upload successful:", result.info);
            setPublicId(result.info.public_id);
          }
        },
      );
    }
  }, [uwConfig, setPublicId]);

  // Open the widget when the MUI Button is clicked
  const handleUploadClick = () => {
    if (uploadWidgetRef.current) {
      uploadWidgetRef.current.open();
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleUploadClick}>
      Tải Ảnh
    </Button>
  );
};

export default CloudinaryUploadWidget;

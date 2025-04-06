import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // or .bubble.css
import { Box, Typography } from "@mui/material";

interface TextEditProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  readOnly?: boolean; // Add readOnly prop
}

export default function TextEdit({
  value,
  onChange,
  error,
  readOnly = false, // Default to false
}: TextEditProps) {
  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
        readOnly={readOnly} // Apply the readOnly attribute
      />
      {error && (
        <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

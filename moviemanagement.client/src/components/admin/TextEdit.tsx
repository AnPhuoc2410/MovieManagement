import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // or .bubble.css
import { Box, Typography } from "@mui/material";

function TextEdit({ value, onChange, error }) {
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
      />
      {error && (
        <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default TextEdit;
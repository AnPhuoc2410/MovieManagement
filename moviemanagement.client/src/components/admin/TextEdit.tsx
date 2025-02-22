import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // or .bubble.css

function TextEdit({ value, onChange }) {
  return (
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
  );
}

export default TextEdit;

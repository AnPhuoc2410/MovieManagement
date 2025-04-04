export const textFieldStyle = {
  mb: 3,
  "& .MuiOutlinedInput-root": {
    height: "50px", // Consistent height
    "&.Mui-focused fieldset": {
      borderColor: "#e6c300",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontSize: "0.95rem",
    transform: "translate(14px, 16px) scale(1)",
    "&.Mui-focused": {
      color: "#000",
      transform: "translate(14px, -9px) scale(0.75)",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "3px",
    marginTop: "3px",
  },
};

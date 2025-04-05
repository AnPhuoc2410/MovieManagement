const textFieldStyle = {
  mb: 3,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#e6c300",
    },
    "&.Mui-error fieldset": {
      borderColor: "#ff9800",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#000",
    },
    "&.Mui-error": {
      color: "#ff9800",
    },
  },
  "& .MuiFormHelperText-root": {
    "&.Mui-error": {
      color: "#ff9800",
    },
  },
};

const iconStyle = {
  color: "#666",
};

const stepperStyle = {
  mb: 4,
  "& .MuiStepLabel-root .Mui-completed": {
    color: "#e6c300",
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "#e6c300",
  },
  "& .MuiStepLabel-label": {
    color: "#666",
    "&.Mui-active": {
      color: "#000",
    },
    "&.Mui-completed": {
      color: "#000",
    },
  },
};

const buttonStyle = {
  primary: {
    backgroundColor: "#e6c300",
    color: "black",
    py: 1.5,
    px: 4,
    borderRadius: 1.5,
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 500,
    boxShadow: 2,
    "&:hover": {
      backgroundColor: "#ccad00",
      boxShadow: 4,
    },
    "&:disabled": {
      backgroundColor: "#e0e0e0",
      color: "#9e9e9e",
    },
  },
  secondary: {
    borderColor: "#e6c300",
    color: "black",
    "&:hover": {
      borderColor: "#ccad00",
      backgroundColor: "rgba(230, 195, 0, 0.1)",
    },
    "&:disabled": {
      borderColor: "#e0e0e0",
      color: "#9e9e9e",
    },
  },
};

export { textFieldStyle, iconStyle, stepperStyle, buttonStyle };

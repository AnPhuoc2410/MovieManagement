import MuiTextField from "@mui/material/TextField";

interface TextFieldProps {
  readOnly?: boolean;
  [key: string]: unknown;
}

export default function InputComponent({ readOnly, ...props }: TextFieldProps) {
  return (
    <MuiTextField
      inputProps={{ readOnly }}
      sx={{
        "&:has([readonly]) ": {
          "& .MuiInputLabel-filled": {
            color: "#cecece",
          },
          "& .MuiFilledInput-root": {
            "&:before": {
              borderBottom: "1px solid #cecece",
            },
          },
        },
      }}
      {...props}
    />
  );
}

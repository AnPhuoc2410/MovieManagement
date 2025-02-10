import { Box, Typography } from "@mui/material";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  return (
    <Box>
      <Typography variant="h1" align="center">
        Movie Management
      </Typography>
      {/* <LoadingSpinner /> */}
    </Box>
  );
};

export default App;

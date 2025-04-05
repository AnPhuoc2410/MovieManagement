import { Box } from "@mui/material";
import NavigateButton from "../NavigateButton";

const NotFound = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="flex max-w-lg flex-col items-center justify-center text-center">
          <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl text-red-600">
            Sorry, we couldn't find this page.
          </p>
          <p className="mb-8 mt-4">
            But don't worry, you can find plenty of other things on our
            homepage.
          </p>
          <NavigateButton
            to={"/"}
            className="rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
          />
        </div>
      </div>
    </Box>
  );
};

export default NotFound;

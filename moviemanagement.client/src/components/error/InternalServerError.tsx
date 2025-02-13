import React from "react";
import NavigateButton from "../shared/NavigateButton";

const InternalServerError = () => {
  return (
    <section className="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-400">
            <span className="sr-only">Error</span>500
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Internal Server Error.
          </p>
          <p className="mb-8 mt-4 dark:text-gray-600">
            But don't worry, you can find plenty of other things on our
            homepage.
          </p>
          <NavigateButton
            to="/"
            text="Back to homepage"
            className="rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
          />
        </div>
      </div>
    </section>
  );
};

export default InternalServerError;

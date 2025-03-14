import { defineConfig, loadEnv } from "vite";
import prodConfig from "./vite.config.prod";
import devConfig from "./vite.config.dev";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (mode === "development") {
    return devConfig;
  }

  return prodConfig;
});

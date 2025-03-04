import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.tsx";
import "./index.scss";
import i18n from "./constants/i18n.ts";
import { I18nextProvider } from "react-i18next";
import { worker } from "./mocks/browser";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3, // limit retry attempts
    },
  },
});

async function enableMocking() {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    return worker.start({
      onUnhandledRequest: "bypass", // Don't warn about unhandled requests
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </QueryClientProvider>,
  );
});

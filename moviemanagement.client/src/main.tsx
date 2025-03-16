import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import i18n from "./i18n";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.scss";
import { worker } from "./mocks/browser";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <GoogleOAuthProvider clientId="57725428107-3ppj4bcq83ls8b7jlojbka02glmhn4ed.apps.googleusercontent.com">
            <AuthProvider>
              <App />
            </AuthProvider>
          </GoogleOAuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  );
});

import { ThemeProvider } from "@mui/material";
import { Suspense, useEffect } from "react";
import { ToasterWithMax } from "./components/common/ToasterWithMax";
import Loader from "./components/shared/Loading/LoadingScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useThemeProvider } from "./theme/useThemeProvider";
import useRouteElements from "./useRouteElements";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { useLocation } from "react-router";

const App = () => {
  const routeElements = useRouteElements();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

return (
  <ThemeProvider theme={useThemeProvider}>
    <AuthProvider>
      <LanguageProvider>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary>
            {routeElements}
            <ToasterWithMax position="top-center" max={3} />
          </ErrorBoundary>
        </Suspense>
      </LanguageProvider>
    </AuthProvider>
  </ThemeProvider>
);
};

export default App;

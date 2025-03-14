import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import { useThemeProvider } from "./theme/useThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Mock components
vi.mock("./components/common/ToasterWithMax", () => ({
  ToasterWithMax: () => <div data-testid="toast-mock" />,
}));

vi.mock("./components/LoadingSpinner", () => ({
  default: () => <div data-testid="spinner-mock">Loading...</div>,
}));

// Mock route elements
vi.mock("./useRouteElements", () => ({
  default: () => () => <div data-testid="routes-mock">Route Content</div>,
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={useThemeProvider}>
        <AuthProvider>
          <LanguageProvider>{component}</LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>,
  );
};

describe("App Component", () => {
  it("renders without crashing", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("routes-mock")).toBeInTheDocument();
  });

  it("shows loading spinner initially", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("spinner-mock")).toBeInTheDocument();
  });

  it("renders toast container", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("toast-mock")).toBeInTheDocument();
  });

  it("renders with all providers", async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      // Check if main content is rendered
      expect(screen.getByTestId("routes-mock")).toBeInTheDocument();
      // Check if toast container is present
      expect(screen.getByTestId("toast-mock")).toBeInTheDocument();
    });
  });

  it("handles suspense fallback correctly", () => {
    vi.mock("./useRouteElements", () => ({
      default: () => {
        throw Promise.resolve(); // Simulate lazy loading
      },
    }));

    renderWithProviders(<App />);
    expect(screen.getByTestId("spinner-mock")).toBeInTheDocument();
  });

  it("maintains providers hierarchy", () => {
    const { container } = renderWithProviders(<App />);

    // Check if providers are in correct order
    expect(container.innerHTML).toMatch(
      /ThemeProvider.*AuthProvider.*LanguageProvider/s,
    );
  });
});

// Test responsive behavior
describe("App Responsive Behavior", () => {
  it("renders correctly on mobile viewport", () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event("resize"));

    renderWithProviders(<App />);
    expect(screen.getByTestId("routes-mock")).toBeInTheDocument();
  });

  it("renders correctly on desktop viewport", () => {
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));

    renderWithProviders(<App />);
    expect(screen.getByTestId("routes-mock")).toBeInTheDocument();
  });
});

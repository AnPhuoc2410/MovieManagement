import React, { Component, ErrorInfo, ReactNode } from "react";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Check if the error is a 404 error
      if (this.state.error?.message.includes("404")) {
        return <NotFound />;
      }
      // For all other errors, show 500 error page
      return <InternalServerError />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

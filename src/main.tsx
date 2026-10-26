import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import QueryProvider from "./providers/QueryProvider";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./providers/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
);

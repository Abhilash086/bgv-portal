import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { ErrorBoundary } from "@/providers/ErrorBoundary";
import { Toaster } from "sonner";
import { router } from "@/routes/Router";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

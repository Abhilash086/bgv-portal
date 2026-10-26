import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorSvg from "@/assets/error.svg";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#181a1f] px-5 py-12 text-center text-[#e5e7eb]">
          <section className="w-full max-w-2xl">
            {/* Custom inline SVG illustration */}
            <div className="mx-auto mb-8 flex justify-center">
                <img src={ErrorSvg} className="w-40 sm:w-50 " alt="Error illustration" />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a8b7]">
              Well, that wasn't supposed to happen
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Something went wrong
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#a1a8b7] sm:text-base">
              We hit an unexpected problem. Don't worry — you can head home and
              get back on track.
            </p>

            {/* Error details */}
            {/* <div className="mt-8 rounded-xl border border-[#353a45] bg-[#20232a] p-5 text-left">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c58b8e]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#b5bbc8]">
                  Error details
                </h2>
              </div>

              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[#a1a8b7]">
                {import.meta.env.DEV
                  ? (this.state.error?.stack ??
                    this.state.error?.message ??
                    "Unknown error")
                  : "An unexpected application error occurred. Please try again."}
              </pre>
            </div> */}

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#d6d9e0] px-6 py-3 text-sm font-semibold text-[#20232a] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1a8b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a1f]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M3 10.5L12 3L21 10.5M5.5 9V21H18.5V9M9.5 21V14H14.5V21"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Go to Home
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#454b59] px-6 py-3 text-sm font-medium text-[#d5dae4] transition hover:bg-[#242831] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1a8b7]"
              >
                Try Again
              </button>
            </div>

            <p className="mt-7 text-xs text-[#777f90]">
              A small hiccup. We'll get you back on track.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

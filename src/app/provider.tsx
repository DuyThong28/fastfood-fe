import { ErrorBoundary } from "react-error-boundary";
import { MainErrorFallback } from "@/components/errors/main";
import { Suspense, ReactNode } from "react";
import AuthProvider from "@/context/auth";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading....
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <AuthProvider>{children}</AuthProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

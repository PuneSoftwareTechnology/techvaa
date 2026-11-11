"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RecaptchaPreloader } from "@/components/common/recaptcha-script";

/** Root client-side provider stack mounted once in the app layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <Toaster richColors position="top-center" />
        <RecaptchaPreloader />
      </QueryProvider>
    </ThemeProvider>
  );
}

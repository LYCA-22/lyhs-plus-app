"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}

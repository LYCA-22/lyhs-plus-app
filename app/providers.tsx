"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { DynamicBack } from "@/components/dynamicBack";
import { ServiceStatus } from "@/components/statusControl";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AppDock } from "@/components/appDock";
import { InitPage } from "@/components/appInit/page";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Provider store={store}>
        <InitPage />
        <ServiceStatus />
        <main className="w-full min-h-dvh relative">
          <DynamicBack containerEl={scrollEl} />
          {!pathname.startsWith("/login") && <AppDock />}
          <div
            id="main-area"
            className="bg-background relative w-full grow h-dvh"
          >
            <AnimatePresence mode="wait">
              <motion.div
                ref={setScrollEl}
                id="scroll-div"
                key={pathname}
                initial={{ scale: 0.99, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="h-dvh overflow-y-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </Provider>
    </ThemeProvider>
  );
}

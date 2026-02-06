"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { DynamicBack } from "@/components/dynamicBack";
import { ServiceStatus } from "@/components/statusControl";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { NavBar } from "@/components/navBar";
import { InitPage } from "@/components/appInit/page";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Provider store={store}>
        <InitPage />
        <ServiceStatus />
        <div className="w-full flex items-center justify-center">
          <main className="w-full sm:w-[500px] h-dvh flex flex-col items-center justify-center relative sm:border-x sm:border-border">
            {!pathname.startsWith("/login") && <NavBar />}
            <DynamicBack />
            <div
              id="main-area"
              className="bg-background overflow-hidden relative w-full grow"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ scale: 0.99, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.7 }}
                  className="overflow-y-auto overflow-x-hidden box-border h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </Provider>
    </ThemeProvider>
  );
}

"use client";
import { Tabs, Tab } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { icons } from "@/components/icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Tabs
        className="m-1"
        aria-label="Options"
        color="default"
        selectedKey={theme}
        onSelectionChange={(key) => setTheme(String(key))}
      >
        <Tab
          className={"p-1 px-2"}
          key="light"
          title={icons["theme-light"]()}
        />
        <Tab
          className={"p-1 px-2"}
          key="system"
          title={icons["theme-system"]()}
        />
        <Tab className={"p-1 px-2"} key="dark" title={icons["theme-dark"]()} />
      </Tabs>
    </div>
  );
}

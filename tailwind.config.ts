import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(progress|tabs).js",
  ],
  theme: {
    extend: {
      margin: {
        deviceTop: "calc(env(safe-area-inset-top) + 10px)",
        deviceBottom: "env(safe-area-inset-bottom)",
      },
      fontFamily: {
        custom: ["OpenAI Sans", "sans-serif"],
        custom2: ["neue", "sans-serif"],
      },
      padding: {
        deviceTop: "calc(env(safe-area-inset-top) + 10px)",
        deviceBottom: "env(safe-area-inset-bottom)",
      },
      maxHeight: {
        "screen-56": "calc(var(--dvh) - 56px)",
      },
      colors: {
        "gradient-start": "#ff6b6b",
        "gradient-middle": "#f7b731",
        "gradient-end": "#4ecdc4",
        background: "var(--background)",
        foreground: "var(--foreground)",
        hoverbg: "var(--hoverbg)",
        buttonBg: "var(--buttonBg)",
        borderColor: "var(--borderColor)",
        rootBg: "var(--rootBg)",
        inputPrimary: "#1E9BDE",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindScrollbarHide,
    plugin(({ addUtilities }) => {
      addUtilities({
        ".border-gradient": {
          "border-width": "4px",
          "border-image": "linear-gradient(45deg, #ff6b6b, #f7b731, #4ecdc4) 1",
        },
      });
    }),
  ],
} as const satisfies Config;

export default config;

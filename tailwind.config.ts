import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#f9f8f5",
          100: "#f0eee8",
          200: "#e2ddd2"
        },
        ink: {
          900: "#1e2622",
          700: "#4b5952"
        },
        moss: {
          500: "#587467",
          600: "#3f5a4d"
        }
      },
      boxShadow: {
        card: "0 8px 30px rgba(30, 38, 34, 0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211d",
        moss: "#51624f",
        sage: "#d9e2d1",
        pollen: "#f1c85b",
        coral: "#d96b5f",
        skyglass: "#d7edf2"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 33, 29, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // App folder ke liye
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components folder ke liye
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: "#3b82f6",
          dark: "#0a0a0c",
          glass: "rgba(255, 255, 255, 0.05)",
        },
      },
      backgroundImage: {
        'cyber-gradient': "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
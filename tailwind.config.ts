import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "DM Sans", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(123, 110, 246, 0.18)"
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        float: "float 5s ease-in-out infinite",
        pulseDot: "pulseDot 1.4s ease-in-out infinite"
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(-100%)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseDot: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(74,222,128,.6)" }, "70%": { boxShadow: "0 0 0 7px rgba(74,222,128,0)" } }
      }
    }
  },
  plugins: []
};

export default config;

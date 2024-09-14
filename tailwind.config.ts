import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      keyframes: {
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },  // Initial and end position
          '50%': { transform: 'translateY(-5px)' }    // Midpoint bounce
        }
      },
      animation: {
        bounceCustom: 'bounceY 0.8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;

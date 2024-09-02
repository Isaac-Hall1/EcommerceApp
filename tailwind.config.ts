import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn .4s forwards',
      },
      keyframes : {
          'fadeIn': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },                  
      },
  },
  plugins: [],
};
export default config;

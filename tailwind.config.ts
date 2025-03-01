import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ค้นหาไฟล์ใน src
    "./app/**/*.{js,jsx,ts,tsx}", // ค้นหาไฟล์ใน app
    "./node_modules/flowbite/**/*.js", // รองรับ Flowbite components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"), // ใช้ plugin ของ Flowbite
  ],
} satisfies Config;

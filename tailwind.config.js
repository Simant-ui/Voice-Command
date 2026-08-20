/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#07090D",
        darkSurface: "#0D1118",
        glassCard: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.08)",
        purpleGlow: "#8b5cf6",
        electricViolet: "#7000ff",
        cyanGlow: "#00f0ff",
        skyGlow: "#38bdf8",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "Geist", "system-ui", "sans-serif"],
        mono: ["Fira Code", "Consolas", "monospace"],
      },
      animation: {
        'orb-breath': 'orbBreath 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        orbBreath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 45px rgba(0, 240, 255, 0.6))' },
        }
      },
      boxShadow: {
        'premium-glow': '0 0 50px rgba(139, 92, 246, 0.35)',
        'cyan-glow': '0 0 50px rgba(0, 240, 255, 0.35)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}

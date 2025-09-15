import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Construction theme colors
        construction: {
          yellow: "hsl(var(--construction-yellow))",
          orange: "hsl(var(--construction-orange))",
          blue: "hsl(var(--blueprint-blue))",
          safety: "hsl(var(--safety-orange))",
          hardhat: "hsl(var(--hard-hat-yellow))",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "bounce-construction": {
          "0%, 100%": { 
            transform: "translateY(0) rotate(0deg)",
          },
          "50%": { 
            transform: "translateY(-10px) rotate(-5deg)",
          },
        },
        "hammer-swing": {
          "0%, 100%": { 
            transform: "rotate(-10deg)",
          },
          "50%": { 
            transform: "rotate(20deg)",
          },
        },
        "crane-lower": {
          "0%, 100%": { 
            transform: "translateY(0px)",
          },
          "50%": { 
            transform: "translateY(20px)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "bob-running": {
          "0%": { 
            transform: "translateX(-100px) scaleX(1)",
            left: "0%"
          },
          "25%": { 
            transform: "translateX(0px) scaleX(1)",
            left: "25%"
          },
          "50%": { 
            transform: "translateX(0px) scaleX(-1)",
            left: "50%"
          },
          "75%": { 
            transform: "translateX(0px) scaleX(-1)",
            left: "75%"
          },
          "100%": { 
            transform: "translateX(100px) scaleX(1)",
            left: "100%"
          }
        },
        "typing-dots": {
          "0%, 60%, 100%": {
            transform: "translateY(0)",
          },
          "30%": {
            transform: "translateY(-10px)",
          },
        },
        "bob-bounce": {
          "0%, 100%": { 
            transform: "translateY(0px) scale(1)",
          },
          "50%": { 
            transform: "translateY(-15px) scale(1.1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-construction": "bounce-construction 2s ease-in-out infinite",
        "hammer-swing": "hammer-swing 1.5s ease-in-out infinite",
        "crane-lower": "crane-lower 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "typing-dots": "typing-dots 1.4s ease-in-out infinite",
        "bob-running": "bob-running 8s ease-in-out infinite",
        "bob-bounce": "bob-bounce 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

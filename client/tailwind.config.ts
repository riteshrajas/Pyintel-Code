/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{jsx,tsx}", "./*.html"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Enhanced Dark Theme
                dark: {
                    50: "#f8f9fa",
                    100: "#e9ecef",
                    200: "#dee2e6",
                    300: "#ced4da",
                    400: "#adb5bd",
                    500: "#6c757d",
                    600: "#495057",
                    700: "#343a40",
                    800: "#212529",
                    900: "#1a1d23",
                    950: "#0d1117",
                },
                // Modern Primary Colors
                primary: {
                    50: "#f0fdf9",
                    100: "#ccfbef",
                    200: "#99f6e0",
                    300: "#5eead4",
                    400: "#2dd4bf",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                    800: "#115e59",
                    900: "#134e4a",
                    950: "#042f2e",
                },
                // Secondary Colors
                secondary: {
                    50: "#fef7ff",
                    100: "#fdeeff",
                    200: "#fcddff",
                    300: "#f9bbff",
                    400: "#f389ff",
                    500: "#ea56ff",
                    600: "#d433f0",
                    700: "#b521cc",
                    800: "#981fa5",
                    900: "#7c1d82",
                    950: "#52035f",
                },
                // Accent Colors
                accent: {
                    orange: "#ff6b35",
                    blue: "#0ea5e9",
                    purple: "#8b5cf6",
                    pink: "#ec4899",
                    emerald: "#10b981",
                },
                // Status Colors
                success: "#22c55e",
                warning: "#f59e0b",
                error: "#ef4444",
                info: "#3b82f6",
                // Surface Colors
                surface: {
                    light: "#ffffff",
                    dark: "#1f2937",
                    darker: "#111827",
                    elevated: "#374151",
                },
                // Legacy Colors (for backward compatibility)
                darkHover: "#374151",
                light: "#f9fafb",
                danger: "#ef4444",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
                display: ["Cal Sans", "Inter", "sans-serif"],
            },
            fontSize: {
                '2xs': '0.625rem',
                '3xl': '1.953rem',
                '4xl': '2.441rem',
                '5xl': '3.052rem',
                '6xl': '3.815rem',
                '7xl': '4.768rem',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '112': '28rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'large': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
                'colored': '0 8px 25px -8px rgba(20, 184, 166, 0.25)',
                'glow': '0 0 20px rgba(20, 184, 166, 0.3)',
                'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            },
            animation: {
                "up-down": "up-down 3s ease-in-out infinite alternate",
                "fade-in": "fadeIn 0.5s ease-in-out",
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "fade-in-down": "fadeInDown 0.6s ease-out",
                "fade-in-left": "fadeInLeft 0.6s ease-out",
                "fade-in-right": "fadeInRight 0.6s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
                "slide-up": "slideUp 0.4s ease-out",
                "slide-down": "slideDown 0.4s ease-out",
                "bounce-subtle": "bounceSubtle 2s infinite",
                "pulse-soft": "pulseSoft 2s ease-in-out infinite",
                "spin-slow": "spin 3s linear infinite",
                "wiggle": "wiggle 1s ease-in-out infinite",
                "gradient": "gradient 6s ease infinite",
                "float": "float 6s ease-in-out infinite",
                "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                typing: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                'blink-caret': {
                    '0%, 100%': { borderColor: 'transparent' },
                    '50%': { borderColor: 'currentColor' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': 'linear-gradient(45deg, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}

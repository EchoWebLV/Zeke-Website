import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vault': {
          'primary': '#afaa71',      // Main tan/olive
          'secondary': '#6c6a39',    // Dark olive/army green
          'dark': '#4a4825',         // Darker shade
          'light': '#c9c48f',        // Lighter shade
          'cream': '#d4d0a8',        // Cream highlight
          'bg': '#1a1a14',           // Dark background (sepia-tinted black)
          'bg-light': '#252518',     // Lighter background
          'bg-card': '#2a2a1e',      // Card background
          'terminal': '#3d5c3d',     // Terminal green
          'terminal-light': '#5a8a5a', // Light terminal green
          'amber': '#f0a830',        // Pip-Boy amber
          'amber-dark': '#c88a20',   // Dark amber
          'danger': '#8b2500',       // Radiation red
        }
      },
      fontFamily: {
        'display': ['var(--font-display)', 'monospace'],
        'body': ['var(--font-body)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scan': 'scan 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'terminal-blink': 'terminal-blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(175, 170, 113, 0.3), inset 0 0 20px rgba(175, 170, 113, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(175, 170, 113, 0.5), inset 0 0 30px rgba(175, 170, 113, 0.2)' },
        },
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(1deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
      },
      boxShadow: {
        'vault': '0 0 30px rgba(175, 170, 113, 0.3), inset 0 0 60px rgba(0,0,0,0.5)',
        'terminal': '0 0 20px rgba(90, 138, 90, 0.4)',
        'amber': '0 0 20px rgba(240, 168, 48, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config

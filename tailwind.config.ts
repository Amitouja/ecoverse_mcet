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
        bg: '#f7f4ef',
        bg2: '#f0ebe2',
        ink: '#1a1a14',
        mid: '#4a4a3a',
        muted: '#8a8a78',
        sage: '#6b8c6b',
        fern: '#4a7c59',
        moss: '#2d5a3d',
        leaf: '#3d7a50',
        mint: '#a8c8a8',
        spark: '#5a8c3a',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        jost: ['var(--font-jost)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        pulse: 'pulse 2s ease infinite',
      },
    },
  },
  plugins: [],
}

export default config

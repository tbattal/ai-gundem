import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f6f3ec',
          2: '#efebe1',
          3: '#fafafa',
        },
        bone: '#ffffff',
        ink: {
          DEFAULT: '#131313',
          soft: '#555048',
          mute: '#8a8579',
          faint: '#b3aea3',
        },
        rule: {
          DEFAULT: '#e0dccf',
          soft: '#ece8dc',
        },
        olive: {
          DEFAULT: '#218c00',
          tint: '#e8f3e3',
        },
        coral: {
          DEFAULT: '#63fe13',
          ink: '#131313',
        },
        live: '#d6332a',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Times New Roman', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 1.5rem + 4vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 1.2rem + 3vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 1rem + 2vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        site: '1280px',
        prose: '68ch',
      },
      spacing: {
        'section': 'clamp(2.5rem, 1.5rem + 3vw, 5rem)',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['hidden', 'block', 'flex', 'md:flex', 'md:hidden', 'md:block'],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config

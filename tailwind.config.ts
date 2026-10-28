import type {Config} from 'tailwindcss';
export default {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{
  colors:{bg:'var(--bg)',surf:'var(--surf)',fg:'var(--fg)',mute:'var(--mute)',line:'var(--line)',ac:'var(--ac)'},
  fontFamily:{sans:['Manrope','ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Helvetica Neue','Arial','sans-serif'],display:['var(--font-display)']}
}},plugins:[]} satisfies Config;

import type { Config } from 'tailwindcss';

/**
 * Tokens de design da Kímika Motors.
 * Cores de marca saem da logo (preto + laranja). As cores semânticas de superfície
 * (fundo, superficie, linha, texto...) vêm de variáveis CSS em src/styles/global.css,
 * o que permite trocar uma seção inteira para o tema claro com a classe `tema-claro`.
 */
const semantica = (nome: string) => `rgb(var(--${nome}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        // Primária: o preto/grafite da logo, em escala quente
        carbono: {
          50: '#F6F4F1',
          100: '#ECE8E2',
          200: '#D6D1C8',
          300: '#B5AFA5',
          400: '#8F897F',
          500: '#6E6961',
          600: '#4E4A45',
          700: '#34322F',
          800: '#222120',
          900: '#161616',
          950: '#0B0B0C',
        },
        // Acento: o laranja da logo, reservado para ação e destaque
        laranja: {
          50: '#FFF4E8',
          100: '#FFE4C6',
          200: '#FFC88C',
          300: '#FFAA55',
          400: '#FA9535',
          500: '#F28A24',
          600: '#D96F0E',
          700: '#A34F05',
          800: '#7A3B06',
          900: '#4D2604',
        },
        sucesso: { DEFAULT: '#3FB97A', escuro: '#1E7A4C' },
        erro: { DEFAULT: '#F07067', escuro: '#B4322A' },
        aviso: { DEFAULT: '#F2B35E', escuro: '#8A5A0C' },

        fundo: semantica('fundo'),
        superficie: semantica('superficie'),
        'superficie-2': semantica('superficie-2'),
        linha: semantica('linha'),
        texto: semantica('texto'),
        'texto-suave': semantica('texto-suave'),
        'destaque-texto': semantica('destaque-texto'),
      },
      fontFamily: {
        display: ['"Saira Variable"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Manrope Variable"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica (títulos fluidos entre 360px e 1440px)
        'display-xl': [
          'clamp(2.75rem, 1.6rem + 5.2vw, 5.75rem)',
          { lineHeight: '0.92', letterSpacing: '-0.01em' },
        ],
        'display-lg': [
          'clamp(2.25rem, 1.5rem + 3.4vw, 4rem)',
          { lineHeight: '0.96', letterSpacing: '-0.005em' },
        ],
        'display-md': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.02' }],
        'display-sm': ['clamp(1.375rem, 1.15rem + 1vw, 1.875rem)', { lineHeight: '1.08' }],
        preco: [
          'clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)',
          { lineHeight: '1', letterSpacing: '-0.01em' },
        ],
        lead: ['1.125rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.6' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        rotulo: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      fontStretch: {
        condensado: '78%',
        normal: '100%',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '18px',
      },
      boxShadow: {
        cartao: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 18px 40px -24px rgb(0 0 0 / 0.55)',
        'cartao-hover':
          '0 1px 0 0 rgb(255 255 255 / 0.06) inset, 0 28px 56px -28px rgb(0 0 0 / 0.7)',
        laranja: '0 10px 30px -12px rgb(242 138 36 / 0.55)',
      },
      maxWidth: {
        conteudo: '1240px',
      },
      transitionTimingFunction: {
        suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        brilho: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        brilho: 'brilho 1.4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

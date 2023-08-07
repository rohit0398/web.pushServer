/* eslint-disable global-require */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Avoid overwriting default config, it make confusing to read tailwind doc, Add extras in extend

    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '3xl': '1920px',
      // => @media (min-width: 1920px) { ... }
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        'dark-purple': '#DE1368',
        'navy-blue': '#05063E',
        'medium-gray': '#4A4A4A',
        white: '#ffffff',
        gray: '#585858',
        'light-gray': '#979797',
        'stroke-gray': '#D8D8D8',
        'stroke-light-gray': '#F7F6F6',
        'light-blue': '#bffaff',
      },
      fontSize: {
        xxs: '.625rem',
        xxxs: '.5rem',
      },
      fontFamily: {
        'open-sans': [
          'Open Sans',
          'sans-serif',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      boxShadow: {
        inside: 'inset 0px 0px 2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
};

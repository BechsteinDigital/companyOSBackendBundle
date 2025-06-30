/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Resources/app/**/*.{vue,js,ts,jsx,tsx,hbs}",
    "./Resources/views/**/*.{twig,html}",
    "./public/**/*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Brand Colors - CompanyOS Design System
      colors: {
        // Primary Brand Colors
        brand: {
          25: '#f2f7ff',
          50: '#ecf3ff',
          100: '#dde9ff',
          200: '#c2d6ff',
          300: '#9cb9ff',
          400: '#7592ff',
          500: '#465fff',
          600: '#3641f5',
          700: '#2a31d8',
          800: '#252dae',
          900: '#262e89',
          950: '#161950',
        },
        
        // Semantic Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        success: {
          25: '#f6fef9',
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
          800: '#05603a',
          900: '#054f31',
          950: '#053321',
        },
        
        warning: {
          25: '#fffcf5',
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f79009',
          600: '#dc6803',
          700: '#b54708',
          800: '#93370d',
          900: '#7a2e0e',
          950: '#4e1d09',
        },
        
        danger: {
          25: '#fffbfa',
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda29b',
          400: '#f97066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
          950: '#55160c',
        },
        
        // Extended Gray Scale
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c111d',
        },
        
        // Module Colors (Shopware-inspired)
        module: {
          pink: {
            50: '#fef7f7',
            100: '#feeaea',
            200: '#fdd8d8',
            300: '#fab9b9',
            400: '#f58e8e',
            500: '#ee46bc',
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
          },
          blue: {
            50: '#edfafd',
            100: '#d2f3fb',
            200: '#b5ebf8',
            300: '#97e2f5',
            400: '#80dcf2',
            500: '#6ad6f0',
            600: '#62d1ee',
            700: '#57ccec',
            800: '#4dc6e9',
            900: '#3cbce5',
          },
          purple: {
            50: '#f4f2fd',
            100: '#e3defb',
            200: '#d0c9f8',
            300: '#bdb3f5',
            400: '#aea2f2',
            500: '#a092f0',
            600: '#988aee',
            700: '#8e7fec',
            800: '#8475e9',
            900: '#7363e5',
          },
          green: {
            50: '#ebfaf4',
            100: '#cdf4e3',
            200: '#abecd1',
            300: '#89e4bf',
            400: '#70dfb1',
            500: '#57d9a3',
            600: '#4fd59b',
            700: '#46cf91',
            800: '#3cca88',
            900: '#2cc077',
          },
        },
      },
      
      // Typography
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'Consolas',
          'monospace',
        ],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],   // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],   // 28px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1' }],            // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],         // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],          // 72px
      },
      
      // Extended Spacing
      spacing: {
        '18': '4.5rem',     // 72px
        '72': '18rem',      // 288px
        '80': '20rem',      // 320px
        '88': '22rem',      // 352px
        '96': '24rem',      // 384px
        '104': '26rem',     // 416px
        '112': '28rem',     // 448px
        '128': '32rem',     // 512px
        '144': '36rem',     // 576px
        '160': '40rem',     // 640px
      },
      
      // Enhanced Shadows
      boxShadow: {
        'xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
        '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
        '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
        'focus-ring': '0px 0px 0px 4px rgba(70, 95, 255, 0.12)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      
      // Enhanced Border Radius
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      
      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      // Z-Index Scale
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
        '900': '900',
        '1000': '1000',
        'auto': 'auto',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      // Extended Breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
    },
  },
  
  plugins: [
    // Essential Tailwind Plugins
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    
    // Custom Plugin für CompanyOS-spezifische Utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom Utilities
      addUtilities({
        // Scrollbar Utilities
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            'background-color': theme('colors.gray.100'),
            'border-radius': theme('borderRadius.full'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': theme('colors.gray.300'),
            'border-radius': theme('borderRadius.full'),
            '&:hover': {
              'background-color': theme('colors.gray.400'),
            },
          },
        },
        
        // Focus Utilities
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
            'box-shadow': theme('boxShadow.focus-ring'),
          },
        },
        
        // Text Utilities
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
      
      // Custom Components
      addComponents({
        // Button Components
        '.btn': {
          display: 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          gap: theme('spacing.2'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          'font-weight': theme('fontWeight.medium'),
          'border-radius': theme('borderRadius.lg'),
          'transition-property': 'all',
          'transition-duration': theme('transitionDuration.200'),
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            outline: 'none',
            'box-shadow': theme('boxShadow.focus-ring'),
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        
        '.btn-primary': {
          'background-color': theme('colors.brand.500'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            'background-color': theme('colors.brand.600'),
          },
          '&:active:not(:disabled)': {
            'background-color': theme('colors.brand.700'),
          },
        },
        
        '.btn-secondary': {
          'background-color': theme('colors.gray.100'),
          color: theme('colors.gray.900'),
          '&:hover:not(:disabled)': {
            'background-color': theme('colors.gray.200'),
          },
          '&:active:not(:disabled)': {
            'background-color': theme('colors.gray.300'),
          },
        },
        
        '.btn-outline': {
          'background-color': 'transparent',
          color: theme('colors.gray.700'),
          'border': `1px solid ${theme('colors.gray.300')}`,
          '&:hover:not(:disabled)': {
            'background-color': theme('colors.gray.50'),
            'border-color': theme('colors.gray.400'),
          },
        },
        
        // Card Components
        '.card': {
          'background-color': theme('colors.white'),
          'border-radius': theme('borderRadius.lg'),
          'box-shadow': theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.gray.200')}`,
          '.dark &': {
            'background-color': theme('colors.gray.800'),
            'border-color': theme('colors.gray.700'),
          },
        },
        
        '.card-header': {
          padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
          'border-bottom': `1px solid ${theme('colors.gray.200')}`,
          '.dark &': {
            'border-bottom-color': theme('colors.gray.700'),
          },
        },
        
        '.card-body': {
          padding: theme('spacing.6'),
        },
        
        '.card-footer': {
          padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
          'border-top': `1px solid ${theme('colors.gray.200')}`,
          'background-color': theme('colors.gray.50'),
          'border-bottom-left-radius': theme('borderRadius.lg'),
          'border-bottom-right-radius': theme('borderRadius.lg'),
          '.dark &': {
            'border-top-color': theme('colors.gray.700'),
            'background-color': theme('colors.gray.700/50'),
          },
        },
        
        // Form Components
        '.form-input': {
          display: 'block',
          width: '100%',
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          'font-size': theme('fontSize.sm[0]'),
          'line-height': theme('fontSize.sm[1].lineHeight'),
          color: theme('colors.gray.900'),
          'background-color': theme('colors.white'),
          'background-image': 'none',
          border: `1px solid ${theme('colors.gray.300')}`,
          'border-radius': theme('borderRadius.md'),
          'box-shadow': theme('boxShadow.xs'),
          'transition-property': 'border-color, box-shadow',
          'transition-duration': theme('transitionDuration.150'),
          '&:focus': {
            outline: 'none',
            'border-color': theme('colors.brand.500'),
            'box-shadow': theme('boxShadow.focus-ring'),
          },
          '&::placeholder': {
            color: theme('colors.gray.400'),
          },
          '.dark &': {
            color: theme('colors.white'),
            'background-color': theme('colors.gray.800'),
            'border-color': theme('colors.gray.600'),
            '&::placeholder': {
              color: theme('colors.gray.500'),
            },
          },
        },
      });
    },
  ],
} 
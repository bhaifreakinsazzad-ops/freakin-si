/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        sans:    ['Inter', '"Hind Siliguri"', 'sans-serif'],
        bangla:  ['"Hind Siliguri"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // Radix token pass-throughs
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Freakin SI brand tokens
        'fsi-gold':        '#FFB628',
        'fsi-gold-glow':   '#FFD460',
        'fsi-violet':      '#8B5CF6',
        'fsi-violet-glow': '#A78BFA',
        'fsi-green':       '#00E676',
        'fsi-pink':        '#EC4899',
        'fsi-blue':        '#3B82F6',
        'fsi-amber':       '#F59E0B',
        'fsi-void':        '#080B12',
        'fsi-surface':     '#0D1117',
        'fsi-surface-2':   '#161B22',
        'fsi-surface-3':   '#1C2333',
        'fsi-text':        '#F0F6FC',
        'fsi-muted':       '#8B949E',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'pulse-gold':    'pulse-glow-gold 2.5s infinite',
        'pulse-violet':  'pulse-glow-violet 2.5s infinite',
        'pulse-text':    'pulse-text-glow 3s infinite',
        'shimmer':       'shimmer 3s ease infinite',
        'gradient-x':    'gradient-x 4s ease infinite',
        'spin-slow':     'spin-slow 12s linear infinite',
        'cursor-blink':  'cursor-blink 0.8s ease infinite',
        'achievement':   'achievement-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float-y':       'float-y 6s ease-in-out infinite',
        'ring-rotate':   'ring-rotate 14s linear infinite',
        'ring-rotate-rev':'ring-rotate-rev 20s linear infinite',
      },
      keyframes: {
        fadeIn:           { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:          { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'pulse-glow-gold':{ '0%, 100%': { boxShadow: '0 0 20px rgba(255,182,40,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(255,182,40,0.6), 0 0 80px rgba(255,182,40,0.3)' } },
        'gradient-x':     { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'spin-slow':      { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'cursor-blink':   { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        'achievement-pop':{ '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' }, '60%': { transform: 'scale(1.2) rotate(3deg)', opacity: '1' }, '100%': { transform: 'scale(1) rotate(0)', opacity: '1' } },
        'float-y':        { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        'ring-rotate':    { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'ring-rotate-rev':{ from: { transform: 'rotate(360deg)' }, to: { transform: 'rotate(0deg)' } },
        shimmer:          { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        typingBounce:     { '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
        'pulse-text-glow':{ '0%, 100%': { textShadow: '0 0 10px rgba(255,182,40,0.5)' }, '50%': { textShadow: '0 0 20px rgba(255,182,40,0.9), 0 0 40px rgba(255,182,40,0.6)' } },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

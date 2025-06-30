module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // CSS Optimierungen für Production
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
} 
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'auto',
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
    },
  },
  persist: {
    key: 'theme-state',
    storage: localStorage,
    paths: ['theme'],
  },
}) 
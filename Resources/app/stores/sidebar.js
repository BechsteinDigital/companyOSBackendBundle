import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    sidebarVisible: false,
    sidebarUnfoldable: false,
  }),
  actions: {
    toggleVisible() {
      this.sidebarVisible = !this.sidebarVisible
    },
    toggleUnfoldable() {
      this.sidebarUnfoldable = !this.sidebarUnfoldable
    },
  },
  getters: {
    visible: (state) => state.sidebarVisible,
    unfoldable: (state) => state.sidebarUnfoldable,
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'sidebar-state',
        storage: localStorage,
        paths: ['sidebarVisible', 'sidebarUnfoldable'],
      },
    ],
  },
}) 
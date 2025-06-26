<template>
  <div>
    <AppSidebar v-if="showLayout" />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader v-if="showLayout" />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter v-if="showLayout" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const route = useRoute()
const auth = useAuthStore()
const showLayout = computed(() => route.path !== '/login')
</script>

<style lang="scss">
@use '../styles/style' as *;
</style> 
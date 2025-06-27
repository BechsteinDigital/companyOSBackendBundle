<template>
  <div>
    <!-- CSRF-Token Meta-Tag für zusätzliche Sicherheit -->
    <meta name="csrf-token" :content="csrfToken" />
    
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const route = useRoute()
const auth = useAuthStore()
const showLayout = computed(() => route.path !== '/login')

const csrfToken = computed(() => auth.csrfToken || '')

// CSRF-Token beim App-Start abrufen
onMounted(async () => {
  if (!auth.csrfToken) {
    await auth.fetchCsrfToken()
  }
})
</script>

<style lang="scss">
@use '../styles/style' as *;
</style> 

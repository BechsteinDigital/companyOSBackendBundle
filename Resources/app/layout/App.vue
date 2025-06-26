<template>
  <div v-if="isLoading">
    <div class="loading-screen">
      <div class="loading-spinner"></div>
    </div>
  </div>
  <div v-else-if="loggedIn">
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const isLoading = ref(true)
const loggedIn = ref(false)
const route = useRoute()

const checkAuth = () => {
  const token = localStorage.getItem('auth_token')
  loggedIn.value = !!token
}

onMounted(() => {
  checkAuth()
  isLoading.value = false
})

watch(() => route.path, () => {
  checkAuth()
})
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* CoreUI Custom Styles */
.c-sidebar {
  background: #3c4b64;
}

.c-sidebar .c-sidebar-nav-link {
  color: #fff;
}

.c-sidebar .c-sidebar-nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.c-sidebar .c-sidebar-nav-link.c-active {
  background: #321fdb;
}

.c-header {
  background: #fff;
  border-bottom: 1px solid #d8dbe0;
}

.c-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
}

.c-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Custom utility classes */
.text-medium-emphasis {
  color: #6c757d !important;
}

.min-vh-100 {
  min-height: 100vh;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #321fdb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => ({
    name: path.charAt(0).toUpperCase() + path.slice(1),
    to: '/' + paths.slice(0, index + 1).join('/'),
  }))
})
</script>

<template>
  <CBreadcrumb class="m-0 ms-2">
    <CBreadcrumbItem :to="{ path: '/' }"> Home </CBreadcrumbItem>
    <CBreadcrumbItem v-for="crumb in breadcrumbs" :key="crumb.to" :to="crumb.to">
      {{ crumb.name }}
    </CBreadcrumbItem>
  </CBreadcrumb>
</template> 
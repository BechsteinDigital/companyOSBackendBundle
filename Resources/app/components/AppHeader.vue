<script setup>
import { onMounted, ref, inject } from 'vue'
import { useColorModes } from '@coreui/vue'

import AppBreadcrumb from './AppBreadcrumb.vue'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt.vue'
import { useSidebarStore } from '../stores/sidebar.js'

const headerClassNames = ref('mb-4 p-0')
const { colorMode, setColorMode } = useColorModes('companyos-admin-theme')
const sidebar = useSidebarStore()
const icons = inject('icons', {})

onMounted(() => {
  document.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 0) {
      headerClassNames.value = 'mb-4 p-0 shadow-sm'
    } else {
      headerClassNames.value = 'mb-4 p-0'
    }
  })
})
</script>

<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler @click="sidebar.toggleVisible()" style="margin-inline-start: -14px">
        <CIcon :content="icons.cilMenu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex">
        <CNavItem>
          <CNavLink href="/dashboard"> Dashboard </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="/users">Benutzer</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="/plugins">Plugins</CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav class="ms-auto">
        <CNavItem>
          <CNavLink href="#">
            <CIcon :content="icons.cilBell" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon :content="icons.cilList" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon :content="icons.cilEnvelopeOpen" size="lg" />
          </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" :content="icons.cilMoon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" :content="icons.cilSun" size="lg" />
            <CIcon v-else :content="icons.cilContrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" :content="icons.cilSun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" :content="icons.cilMoon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" :content="icons.cilContrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CContainer class="px-4" fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template> 
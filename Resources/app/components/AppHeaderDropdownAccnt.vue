<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { inject } from 'vue'

const router = useRouter()
const auth = useAuthStore()
const icons = inject('icons', {})

const logout = () => {
  auth.logout()
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}
</script>

<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0 pe-0" :caret="false">
      <CAvatar size="md">
        <CIcon :content="icons.cilUser" />
      </CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader tag="h6" class="bg-light fw-semibold py-2">
        {{ auth.user?.fullName || auth.user?.email || 'Account' }}
      </CDropdownHeader>
      <CDropdownItem @click="goToProfile">
        <CIcon :content="icons.cilUser" class="me-2" />
        Profil
      </CDropdownItem>
      <CDropdownItem @click="goToSettings">
        <CIcon :content="icons.cilSettings" class="me-2" />
        Einstellungen
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="logout">
        <CIcon :content="icons.cilAccountLogout" class="me-2" />
        Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template> 
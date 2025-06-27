<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0 pe-0" :caret="false">
      <CAvatar size="md">
        <CIcon icon="cil-user" />
      </CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader tag="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-user" class="me-2" />
        Profile
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-settings" class="me-2" />
        Settings
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="logout">
        <CIcon icon="cil-account-logout" class="me-2" />
        Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template> 
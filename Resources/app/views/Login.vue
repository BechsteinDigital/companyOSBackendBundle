<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Melden Sie sich in Ihrem Account an</p>
                  
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.username"
                      placeholder="E-Mail"
                      autocomplete="username"
                      required
                    />
                  </CInputGroup>
                  
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.password"
                      type="password"
                      placeholder="Passwort"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>
                  
                  <CRow>
                    <CCol xs="6">
                      <CButton
                        type="submit"
                        color="primary"
                        class="px-4"
                        :disabled="loading"
                      >
                        <CSpinner v-if="loading" size="sm" class="me-2" />
                        {{ loading ? 'Anmelden...' : 'Anmelden' }}
                      </CButton>
                    </CCol>
                    <CCol xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Passwort vergessen?
                      </CButton>
                    </CCol>
                  </CRow>
                  
                  <div class="form-check mt-3">
                    <CFormCheck
                      v-model="form.remember"
                      type="checkbox"
                      id="remember"
                      label="Angemeldet bleiben"
                    />
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            
            <CCard class="text-white bg-primary py-5">
              <CCardBody class="text-center">
                <div>
                  <h2>CompanyOS Admin</h2>
                  <p>
                    Willkommen im CompanyOS Backend-System. 
                    Hier können Sie alle administrativen Aufgaben verwalten.
                  </p>
                  <CButton
                    color="primary"
                    class="mt-3"
                    active
                    tabindex="-1"
                  >
                    Registrieren!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
      
      <!-- Fehlermeldung -->
      <CAlert
        v-if="error"
        color="danger"
        class="mt-3"
        dismissible
        @close="error = null"
      >
        {{ error }}
      </CAlert>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  username: '',
  password: '',
  remember: false
})

const loading = computed(() => auth.loading)
const error = computed({
  get: () => auth.error,
  set: (value) => { auth.error = value }
})

const handleLogin = async () => {
  const success = await auth.login({
    username: form.value.username,
    password: form.value.password,
    remember: form.value.remember
  })
  
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.bg-light {
  background-color: #f8f9fa !important;
}

.min-vh-100 {
  min-height: 100vh;
}

.text-medium-emphasis {
  color: #6c757d;
}
</style> 
<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="onLogin">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Anmelden bei CompanyOS</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.email"
                      placeholder="E-Mail"
                      autocomplete="email"
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
                  <CInputGroup class="mb-3">
                    <CFormCheck v-model="form.remember" label="Angemeldet bleiben" />
                  </CInputGroup>
                  <CRow>
                    <CCol xs="6">
                      <CButton
                        type="submit"
                        color="primary"
                        class="px-4"
                        :disabled="auth.loading"
                      >
                        <CSpinner v-if="auth.loading" size="sm" class="me-2" />
                        {{ auth.loading ? 'Anmelden...' : 'Anmelden' }}
                      </CButton>
                    </CCol>
                  </CRow>
                  <CAlert
                    v-if="auth.error"
                    color="danger"
                    dismissible
                    @close="auth.error = ''"
                  >
                    {{ auth.error }}
                  </CAlert>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5">
              <CCardBody class="text-center">
                <div>
                  <h2>CompanyOS</h2>
                  <p>
                    Eine modulare Plattform basierend auf DDD, CQRS und Event-Driven Architecture.
                  </p>
                  <CButton
                    color="primary"
                    class="mt-3"
                    active
                    tabindex="-1"
                  >
                    Mehr erfahren
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const onLogin = async () => {
  const ok = await auth.login({ username: form.value.email, password: form.value.password, remember: form.value.remember })
  if (ok) {
    router.push('/dashboard')
  }
}
</script> 
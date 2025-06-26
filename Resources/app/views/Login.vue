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
                  </CRow>
                  <CAlert
                    v-if="error"
                    color="danger"
                    dismissible
                    @close="error = ''"
                  >
                    {{ error }}
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
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('/auth/login', {
      email: form.value.email,
      password: form.value.password
    })

    const { access_token, refresh_token, user } = response.data

    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user', JSON.stringify(user))

    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Anmeldung fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script> 
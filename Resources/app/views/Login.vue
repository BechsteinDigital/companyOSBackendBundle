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
                  
                  <!-- CSRF-Token für zusätzliche Sicherheit -->
                  <input type="hidden" name="_token" :value="csrfToken" />
                  
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.email"
                      placeholder="E-Mail"
                      autocomplete="email"
                      type="email"
                      required
                      :class="{ 'is-invalid': validationErrors.email }"
                      @input="validateEmail"
                    />
                    <div v-if="validationErrors.email" class="invalid-feedback">
                      {{ validationErrors.email }}
                    </div>
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
                      :class="{ 'is-invalid': validationErrors.password }"
                      @input="validatePassword"
                    />
                    <div v-if="validationErrors.password" class="invalid-feedback">
                      {{ validationErrors.password }}
                    </div>
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
                        :disabled="auth.loading || !isFormValid"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const validationErrors = ref({
  email: '',
  password: ''
})

const csrfToken = ref('')

// CSRF-Token beim Laden der Komponente abrufen
onMounted(async () => {
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'same-origin'
    })
    if (response.ok) {
      const data = await response.json()
      csrfToken.value = data.token
    }
  } catch (error) {
    console.warn('CSRF-Token konnte nicht abgerufen werden:', error)
  }
})

// E-Mail-Validierung
const validateEmail = () => {
  const email = form.value.email.trim()
  if (!email) {
    validationErrors.value.email = 'E-Mail ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    validationErrors.value.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  } else {
    validationErrors.value.email = ''
  }
}

// Passwort-Validierung
const validatePassword = () => {
  const password = form.value.password
  if (!password) {
    validationErrors.value.password = 'Passwort ist erforderlich'
  } else if (password.length < 8) {
    validationErrors.value.password = 'Passwort muss mindestens 8 Zeichen lang sein'
  } else {
    validationErrors.value.password = ''
  }
}

// Formular-Validität
const isFormValid = computed(() => {
  return form.value.email.trim() && 
         form.value.password && 
         !validationErrors.value.email && 
         !validationErrors.value.password
})

const onLogin = async () => {
  // Validierung vor dem Login
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    return
  }
  
  // Input-Sanitization
  const sanitizedEmail = form.value.email.trim().toLowerCase()
  const sanitizedPassword = form.value.password
  
  const ok = await auth.login({ 
    username: sanitizedEmail, 
    password: sanitizedPassword, 
    remember: form.value.remember 
  })
  
  if (ok) {
    router.push('/dashboard')
  }
}
</script> 
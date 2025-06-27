<template>
  <div>
    <CBreadcrumb class="my-3">
      <CBreadcrumbItem href="/dashboard">Dashboard</CBreadcrumbItem>
      <CBreadcrumbItem active>Profil</CBreadcrumbItem>
    </CBreadcrumb>

    <CRow>
      <CCol md="8">
        <CCard>
          <CCardHeader>
            <h4 class="card-title mb-0">Profil bearbeiten</h4>
          </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="updateProfile">
              <CRow>
                <CCol md="6">
                  <CFormInput
                    v-model="profile.firstName"
                    label="Vorname"
                    placeholder="Vorname eingeben"
                    required
                  />
                </CCol>
                <CCol md="6">
                  <CFormInput
                    v-model="profile.lastName"
                    label="Nachname"
                    placeholder="Nachname eingeben"
                    required
                  />
                </CCol>
              </CRow>
              
              <CFormInput
                v-model="profile.email"
                label="E-Mail"
                type="email"
                placeholder="E-Mail eingeben"
                required
                readonly
              />
              
              <CButton type="submit" color="primary" :disabled="loading">
                <CSpinner v-if="loading" size="sm" class="me-2" />
                {{ loading ? 'Speichern...' : 'Profil speichern' }}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol md="4">
        <CCard>
          <CCardHeader>
            <h5 class="card-title mb-0">Account-Informationen</h5>
          </CCardHeader>
          <CCardBody>
            <div class="mb-3">
              <strong>Rolle:</strong>
              <div class="mt-1">
                <CBadge v-if="auth.hasRole('ROLE_ADMIN')" color="danger">Administrator</CBadge>
                <CBadge v-else-if="auth.hasRole('ROLE_EMPLOYEE')" color="warning">Mitarbeiter</CBadge>
                <CBadge v-else-if="auth.hasRole('ROLE_CUSTOMER')" color="info">Kunde</CBadge>
                <CBadge v-else color="secondary">Unbekannt</CBadge>
              </div>
            </div>
            
            <div class="mb-3">
              <strong>Status:</strong>
              <div class="mt-1">
                <CBadge v-if="auth.user?.isActive" color="success">Aktiv</CBadge>
                <CBadge v-else color="danger">Inaktiv</CBadge>
              </div>
            </div>
            
            <div class="mb-3">
              <strong>Registriert seit:</strong>
              <div class="mt-1">{{ formatDate(auth.user?.createdAt) }}</div>
            </div>
            
            <div class="mb-3">
              <strong>Letzte Anmeldung:</strong>
              <div class="mt-1">{{ formatDate(auth.user?.lastLoginAt) || 'Noch nie' }}</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const loading = ref(false)

const profile = ref({
  firstName: '',
  lastName: '',
  email: ''
})

onMounted(() => {
  if (auth.user) {
    profile.value = {
      firstName: auth.user.firstName || '',
      lastName: auth.user.lastName || '',
      email: auth.user.email || ''
    }
  }
})

const updateProfile = async () => {
  loading.value = true
  try {
    // Hier würde die API-Anfrage zum Aktualisieren des Profils stehen
    // await axios.put('/api/users/profile', profile.value)
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Profil im Auth-Store aktualisieren
    if (auth.user) {
      auth.user.firstName = profile.value.firstName
      auth.user.lastName = profile.value.lastName
    }
    
    alert('Profil erfolgreich aktualisiert!')
  } catch (error) {
    alert('Fehler beim Aktualisieren des Profils: ' + error.message)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unbekannt'
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 
<template>
  <div>
    <CRow>
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>System-Einstellungen</strong>
            <div class="ms-auto">
              <CButton 
                color="primary" 
                @click="saveSettings"
                :disabled="loading || saveLoading"
              >
                <CSpinner v-if="saveLoading" size="sm" class="me-2" />
                <CIcon name="cilCheckCircle" class="me-2" />
                Speichern
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <!-- Loading Spinner -->
            <div v-if="loading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Lade Einstellungen...</p>
            </div>

            <!-- Error Message -->
            <CAlert v-if="error" color="danger" :visible="true">
              {{ error }}
            </CAlert>

            <!-- Success Message -->
            <CAlert v-if="successMessage" color="success" :visible="true">
              {{ successMessage }}
            </CAlert>

            <!-- Settings Form -->
            <div v-if="!loading">
              <!-- Navigation Tabs -->
              <CNav variant="tabs" class="mb-4">
                <CNavItem>
                  <CNavLink 
                    :active="activeTab === 'company'"
                    @click="activeTab = 'company'"
                    style="cursor: pointer"
                  >
                    <CIcon name="cilBuilding" class="me-2" />
                    Firma
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    :active="activeTab === 'email'"
                    @click="activeTab = 'email'"
                    style="cursor: pointer"
                  >
                    <CIcon name="cilEnvelopeClosed" class="me-2" />
                    E-Mail
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    :active="activeTab === 'system'"
                    @click="activeTab = 'system'"
                    style="cursor: pointer"
                  >
                    <CIcon name="cilSettings" class="me-2" />
                    System
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    :active="activeTab === 'regional'"
                    @click="activeTab = 'regional'"
                    style="cursor: pointer"
                  >
                    <CIcon name="cilGlobeAlt" class="me-2" />
                    Regional
                  </CNavLink>
                </CNavItem>
              </CNav>

              <!-- Company Settings Tab -->
              <div v-show="activeTab === 'company'">
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Firmenname</CFormLabel>
                      <CFormInput
                        v-model="settings.companyName"
                        placeholder="Firmenname eingeben"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Rechtlicher Name</CFormLabel>
                      <CFormInput
                        v-model="settings.legalName"
                        placeholder="Rechtlicher Firmenname"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Steuernummer</CFormLabel>
                      <CFormInput
                        v-model="settings.taxNumber"
                        placeholder="Steuernummer"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>USt-IdNr.</CFormLabel>
                      <CFormInput
                        v-model="settings.vatNumber"
                        placeholder="Umsatzsteuer-Identifikationsnummer"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="8">
                    <div class="mb-3">
                      <CFormLabel>Straße</CFormLabel>
                      <CFormInput
                        v-model="settings.street"
                        placeholder="Straßenname"
                      />
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Hausnummer</CFormLabel>
                      <CFormInput
                        v-model="settings.houseNumber"
                        placeholder="Nr."
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <div class="mb-3">
                      <CFormLabel>PLZ</CFormLabel>
                      <CFormInput
                        v-model="settings.postalCode"
                        placeholder="Postleitzahl"
                      />
                    </div>
                  </CCol>
                  <CCol md="5">
                    <div class="mb-3">
                      <CFormLabel>Stadt</CFormLabel>
                      <CFormInput
                        v-model="settings.city"
                        placeholder="Stadt"
                      />
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Land</CFormLabel>
                      <CFormInput
                        v-model="settings.country"
                        placeholder="Land"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>E-Mail</CFormLabel>
                      <CFormInput
                        v-model="settings.email"
                        type="email"
                        placeholder="kontakt@firma.de"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Telefon</CFormLabel>
                      <CFormInput
                        v-model="settings.phone"
                        placeholder="Telefonnummer"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Fax</CFormLabel>
                      <CFormInput
                        v-model="settings.fax"
                        placeholder="Faxnummer"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Website</CFormLabel>
                      <CFormInput
                        v-model="settings.website"
                        placeholder="https://www.firma.de"
                      />
                    </div>
                  </CCol>
                </CRow>
                <div class="mb-3">
                  <CFormLabel>Logo URL</CFormLabel>
                  <CFormInput
                    v-model="settings.logoUrl"
                    placeholder="https://www.firma.de/logo.png"
                  />
                </div>
              </div>

              <!-- Email Settings Tab -->
              <div v-show="activeTab === 'email'">
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>E-Mail Absender-Name</CFormLabel>
                      <CFormInput
                        v-model="settings.emailFromName"
                        placeholder="Ihr Firmenname"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>E-Mail Absender-Adresse</CFormLabel>
                      <CFormInput
                        v-model="settings.emailFromAddress"
                        type="email"
                        placeholder="noreply@firma.de"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Support E-Mail</CFormLabel>
                      <CFormInput
                        v-model="settings.supportEmail"
                        type="email"
                        placeholder="support@firma.de"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Reply-To E-Mail</CFormLabel>
                      <CFormInput
                        v-model="settings.emailReplyTo"
                        type="email"
                        placeholder="reply@firma.de"
                      />
                    </div>
                  </CCol>
                </CRow>
                <h6 class="mt-4 mb-3">SMTP-Konfiguration</h6>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>SMTP Host</CFormLabel>
                      <CFormInput
                        v-model="settings.smtpHost"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                  </CCol>
                  <CCol md="3">
                    <div class="mb-3">
                      <CFormLabel>SMTP Port</CFormLabel>
                      <CFormInput
                        v-model="settings.smtpPort"
                        type="number"
                        placeholder="587"
                      />
                    </div>
                  </CCol>
                  <CCol md="3">
                    <div class="mb-3">
                      <CFormLabel>Verschlüsselung</CFormLabel>
                      <CFormSelect v-model="settings.smtpEncryption">
                        <option value="">Keine</option>
                        <option value="ssl">SSL</option>
                        <option value="tls">TLS</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>SMTP Benutzername</CFormLabel>
                      <CFormInput
                        v-model="settings.smtpUsername"
                        placeholder="Benutzername"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>SMTP Passwort</CFormLabel>
                      <CFormInput
                        v-model="settings.smtpPassword"
                        type="password"
                        placeholder="Passwort"
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>

              <!-- System Settings Tab -->
              <div v-show="activeTab === 'system'">
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>System-Name</CFormLabel>
                      <CFormInput
                        v-model="settings.systemName"
                        placeholder="CompanyOS"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Standard Benutzerrolle</CFormLabel>
                      <CFormSelect v-model="settings.defaultUserRole">
                        <option value="">Auswählen...</option>
                        <option v-for="role in availableRoles" :key="role.id" :value="role.name">
                          {{ role.displayName }}
                        </option>
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Session-Timeout (Minuten)</CFormLabel>
                      <CFormInput
                        v-model="settings.sessionTimeout"
                        type="number"
                        placeholder="60"
                      />
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-3">
                      <CFormLabel>Wartungsmodus</CFormLabel>
                      <CFormCheck
                        v-model="settings.maintenanceMode"
                        label="System im Wartungsmodus"
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>

              <!-- Regional Settings Tab -->
              <div v-show="activeTab === 'regional'">
                <CRow>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Standard-Sprache</CFormLabel>
                      <CFormSelect v-model="settings.defaultLanguage">
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Standard-Währung</CFormLabel>
                      <CFormSelect v-model="settings.defaultCurrency">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="CHF">Swiss Franc (CHF)</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Zeitzone</CFormLabel>
                      <CFormSelect v-model="settings.timezone">
                        <option value="Europe/Berlin">Europe/Berlin</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Datumsformat</CFormLabel>
                      <CFormSelect v-model="settings.dateFormat">
                        <option value="d.m.Y">DD.MM.YYYY</option>
                        <option value="Y-m-d">YYYY-MM-DD</option>
                        <option value="m/d/Y">MM/DD/YYYY</option>
                        <option value="d/m/Y">DD/MM/YYYY</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Zeitformat</CFormLabel>
                      <CFormSelect v-model="settings.timeFormat">
                        <option value="H:i">24-Stunden (HH:MM)</option>
                        <option value="g:i A">12-Stunden (H:MM AM/PM)</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md="4">
                    <div class="mb-3">
                      <CFormLabel>Zahlenformat</CFormLabel>
                      <CFormSelect v-model="settings.numberFormat">
                        <option value="de">Deutsch (1.234,56)</option>
                        <option value="en">English (1,234.56)</option>
                        <option value="fr">Français (1 234,56)</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Salutations Section -->
    <CRow v-if="!loading">
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Anreden & Grußformeln</strong>
          </CCardHeader>
          <CCardBody>
            <div v-if="salutations && Object.keys(salutations).length > 0">
              <div v-for="(template, type) in salutations" :key="type" class="mb-3">
                <CFormLabel>{{ formatSalutationType(type) }}</CFormLabel>
                <CFormTextarea
                  :value="template"
                  rows="2"
                  readonly
                  class="bg-light"
                />
              </div>
            </div>
            <div v-else>
              <p class="text-muted">Keine Anreden konfiguriert.</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reactive data
const settings = ref({
  companyName: '',
  legalName: '',
  taxNumber: '',
  vatNumber: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  country: '',
  email: '',
  phone: '',
  fax: '',
  website: '',
  supportEmail: '',
  logoUrl: '',
  emailFromName: '',
  emailFromAddress: '',
  emailReplyTo: '',
  smtpHost: '',
  smtpPort: '',
  smtpEncryption: '',
  smtpUsername: '',
  smtpPassword: '',
  systemName: '',
  defaultUserRole: '',
  sessionTimeout: '',
  maintenanceMode: false,
  defaultLanguage: 'de',
  defaultCurrency: 'EUR', 
  timezone: 'Europe/Berlin',
  dateFormat: 'd.m.Y',
  timeFormat: 'H:i',
  numberFormat: 'de'
})

const salutations = ref({})
const availableRoles = ref([])
const loading = ref(false)
const saveLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const activeTab = ref('company')

// Methods
const loadSettings = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('/api/settings')
    
    if (response.data) {
      // Map response data to settings
      Object.keys(settings.value).forEach(key => {
        if (response.data[key] !== undefined) {
          settings.value[key] = response.data[key]
        }
      })
    }
  } catch (err) {
    if (err.response?.status === 404) {
      // Settings not initialized yet - that's okay
    } else {
      error.value = 'Fehler beim Laden der Einstellungen: ' + (err.response?.data?.message || err.message)
    }
  } finally {
    loading.value = false
  }
}

const loadSalutations = async () => {
  try {
    const response = await axios.get('/api/settings/salutations')
    
    if (response.data && response.data.salutations) {
      salutations.value = response.data.salutations
    }
  } catch (err) {
    console.error('Fehler beim Laden der Anreden:', err)
  }
}

const loadRoles = async () => {
  try {
    const response = await axios.get('/api/roles')
    
    if (response.data.success) {
      availableRoles.value = response.data.data.filter(role => !role.isSystemRole)
    }
  } catch (err) {
    console.error('Fehler beim Laden der Rollen:', err)
  }
}

const saveSettings = async () => {
  saveLoading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    // Convert maintenanceMode boolean to expected format
    const settingsData = { ...settings.value }
    
    // Remove empty values
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] === '' || settingsData[key] === null) {
        delete settingsData[key]
      }
    })
    
    const response = await axios.put('/api/settings', settingsData)
    
    if (response.status === 200) {
      successMessage.value = 'Einstellungen erfolgreich gespeichert!'
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (err) {
    if (err.response?.status === 404) {
      // Try to initialize settings first
      try {
        await initializeSettings()
      } catch (initErr) {
        error.value = 'Fehler beim Initialisieren der Einstellungen: ' + (initErr.response?.data?.message || initErr.message)
      }
    } else {
      error.value = 'Fehler beim Speichern der Einstellungen: ' + (err.response?.data?.message || err.message)
    }
  } finally {
    saveLoading.value = false
  }
}

const initializeSettings = async () => {
  const initData = {
    companyName: settings.value.companyName || 'Meine Firma',
    street: settings.value.street || '',
    houseNumber: settings.value.houseNumber || '',
    postalCode: settings.value.postalCode || '',
    city: settings.value.city || '',
    country: settings.value.country || 'Deutschland',
    email: settings.value.email || 'info@firma.de',
    smtpHost: settings.value.smtpHost || '',
    emailFromAddress: settings.value.emailFromAddress || 'noreply@firma.de',
    emailFromName: settings.value.emailFromName || 'Meine Firma'
  }
  
  const response = await axios.post('/api/settings/initialize', initData)
  
  if (response.status === 201) {
    // Now try to save the full settings
    await saveSettings()
  }
}

const formatSalutationType = (type) => {
  const types = {
    'formal': 'Förmliche Anrede',
    'informal': 'Informelle Anrede', 
    'business': 'Geschäftliche Anrede',
    'closing': 'Grußformel'
  }
  return types[type] || type
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadSettings(),
    loadSalutations(),
    loadRoles()
  ])
})
</script>

<style scoped>
.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.nav-tabs .nav-link.active {
  color: var(--cui-nav-tabs-link-active-color);
  background-color: var(--cui-nav-tabs-link-active-bg);
  border-color: var(--cui-nav-tabs-link-active-border-color);
}
</style> 
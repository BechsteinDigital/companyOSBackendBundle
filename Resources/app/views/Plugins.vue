<template>
  <div>
    <CRow>
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Plugin-Verwaltung</strong>
            <div class="ms-auto">
              <CButton 
                color="primary" 
                @click="showInstallModal = true"
                :disabled="loading"
              >
                <CIcon name="cilPlus" class="me-2" />
                Plugin installieren
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <!-- Filter & Search -->
            <CRow class="mb-3">
              <CCol md="6">
                <CFormInput
                  v-model="searchTerm"
                  placeholder="Plugins suchen..."
                  @input="handleSearch"
                />
              </CCol>
              <CCol md="3">
                <CFormCheck
                  v-model="activeOnly"
                  label="Nur aktive Plugins"
                  @change="loadPlugins"
                />
              </CCol>
              <CCol md="3">
                <CButton color="secondary" @click="resetFilters" variant="outline">
                  Filter zurücksetzen
                </CButton>
              </CCol>
            </CRow>

            <!-- Loading Spinner -->
            <div v-if="loading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Lade Plugins...</p>
            </div>

            <!-- Error Message -->
            <CAlert v-if="error" color="danger" :visible="true">
              {{ error }}
            </CAlert>

            <!-- Success Message -->
            <CAlert v-if="successMessage" color="success" :visible="true">
              {{ successMessage }}
            </CAlert>

            <!-- Plugins Grid -->
            <div v-if="!loading && plugins.length > 0">
              <CRow>
                <CCol md="6" lg="4" v-for="plugin in filteredPlugins" :key="plugin.id" class="mb-4">
                  <CCard class="h-100">
                    <CCardHeader class="d-flex justify-content-between align-items-center">
                      <strong>{{ plugin.name }}</strong>
                      <CBadge :color="plugin.active ? 'success' : 'secondary'">
                        {{ plugin.active ? 'Aktiv' : 'Inaktiv' }}
                      </CBadge>
                    </CCardHeader>
                    <CCardBody>
                      <h6>{{ plugin.displayName }}</h6>
                      <p class="text-muted small">{{ plugin.description || 'Keine Beschreibung verfügbar' }}</p>
                      
                      <div class="mb-2">
                        <small class="text-muted">Version:</small>
                        <strong class="ms-1">{{ plugin.version }}</strong>
                      </div>
                      
                      <div class="mb-2" v-if="plugin.author">
                        <small class="text-muted">Autor:</small>
                        <span class="ms-1">{{ plugin.author }}</span>
                      </div>
                      
                      <div class="mb-2" v-if="plugin.homepage">
                        <small class="text-muted">Homepage:</small>
                        <a :href="plugin.homepage" target="_blank" class="ms-1 small">
                          {{ plugin.homepage }}
                        </a>
                      </div>
                      
                      <div class="mb-2" v-if="plugin.installedAt">
                        <small class="text-muted">Installiert:</small>
                        <span class="ms-1 small">{{ formatDate(plugin.installedAt) }}</span>
                      </div>
                    </CCardBody>
                    <CCardFooter>
                      <CButtonGroup class="w-100">
                        <CButton 
                          :color="plugin.active ? 'warning' : 'success'"
                          size="sm"
                          @click="togglePlugin(plugin)"
                          :disabled="actionLoading[plugin.id]"
                        >
                          <CSpinner v-if="actionLoading[plugin.id]" size="sm" class="me-2" />
                          <CIcon :name="plugin.active ? 'cilMediaPause' : 'cilMediaPlay'" class="me-2" />
                          {{ plugin.active ? 'Deaktivieren' : 'Aktivieren' }}
                        </CButton>
                        <CButton 
                          color="info"
                          size="sm"
                          @click="showPluginDetails(plugin)"
                        >
                          <CIcon name="cilInfo" />
                        </CButton>
                        <CButton 
                          color="danger"
                          size="sm"
                          @click="deletePlugin(plugin)"
                          :disabled="actionLoading[plugin.id]"
                        >
                          <CIcon name="cilTrash" />
                        </CButton>
                      </CButtonGroup>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            </div>

            <!-- No Plugins Message -->
            <div v-if="!loading && plugins.length === 0" class="text-center py-4">
              <p class="text-muted">Keine Plugins installiert.</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Loaded Plugins Info -->
    <CRow v-if="loadedPlugins.length > 0">
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Aktuell geladene Plugins</strong>
            <CBadge color="info" class="ms-2">{{ loadedPlugins.length }}</CBadge>
          </CCardHeader>
          <CCardBody>
            <div class="d-flex flex-wrap gap-2">
              <CBadge 
                v-for="plugin in loadedPlugins" 
                :key="plugin.name"
                color="success"
                size="lg"
              >
                {{ plugin.name }} v{{ plugin.version }}
              </CBadge>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Install Plugin Modal -->
    <CModal 
      v-model="showInstallModal" 
      title="Plugin installieren"
      size="lg"
    >
      <div>
        <div class="mb-3">
          <CFormLabel>Plugin-Datei (.tar.gz)</CFormLabel>
          <CFormInput
            type="file"
            @change="handleFileSelect"
            accept=".tar.gz,.tgz"
            ref="fileInput"
          />
          <small class="text-muted">
            Wählen Sie eine Plugin-Archive-Datei (.tar.gz oder .tgz)
          </small>
        </div>
        
        <div class="mb-3">
          <CFormLabel>Plugin-Name</CFormLabel>
          <CFormInput
            v-model="installData.name"
            placeholder="Plugin-Name"
            required
          />
        </div>
        
        <div class="mb-3">
          <CFormLabel>Version</CFormLabel>
          <CFormInput
            v-model="installData.version"
            placeholder="1.0.0"
            required
          />
        </div>
        
        <div class="mb-3">
          <CFormLabel>Beschreibung</CFormLabel>
          <CFormTextarea
            v-model="installData.description"
            placeholder="Plugin-Beschreibung..."
            rows="3"
          />
        </div>
      </div>
      <template #footer>
        <CButton color="secondary" @click="showInstallModal = false">
          Abbrechen
        </CButton>
        <CButton 
          color="primary" 
          @click="installPlugin" 
          :disabled="installLoading || !selectedFile"
        >
          <CSpinner v-if="installLoading" size="sm" class="me-2" />
          Installieren
        </CButton>
      </template>
    </CModal>

    <!-- Plugin Details Modal -->
    <CModal 
      v-model="showDetailsModal" 
      title="Plugin-Details"
      size="lg"
    >
      <div v-if="selectedPlugin">
        <CRow>
          <CCol md="6">
            <strong>Name:</strong>
            <p>{{ selectedPlugin.displayName || selectedPlugin.name }}</p>
          </CCol>
          <CCol md="6">
            <strong>Version:</strong>
            <p>{{ selectedPlugin.version }}</p>
          </CCol>
        </CRow>
        
        <CRow>
          <CCol md="6">
            <strong>Autor:</strong>
            <p>{{ selectedPlugin.author || '-' }}</p>
          </CCol>
          <CCol md="6">
            <strong>Status:</strong>
            <p>
              <CBadge :color="selectedPlugin.active ? 'success' : 'secondary'">
                {{ selectedPlugin.active ? 'Aktiv' : 'Inaktiv' }}
              </CBadge>
            </p>
          </CCol>
        </CRow>
        
        <div class="mb-3">
          <strong>Beschreibung:</strong>
          <p>{{ selectedPlugin.description || 'Keine Beschreibung verfügbar' }}</p>
        </div>
        
        <div class="mb-3" v-if="selectedPlugin.homepage">
          <strong>Homepage:</strong>
          <p>
            <a :href="selectedPlugin.homepage" target="_blank">
              {{ selectedPlugin.homepage }}
            </a>
          </p>
        </div>
        
        <div class="mb-3" v-if="selectedPlugin.dependencies && selectedPlugin.dependencies.length > 0">
          <strong>Abhängigkeiten:</strong>
          <div class="mt-2">
            <CBadge 
              v-for="dep in selectedPlugin.dependencies" 
              :key="dep"
              color="info"
              class="me-2 mb-2"
            >
              {{ dep }}
            </CBadge>
          </div>
        </div>
        
        <div class="mb-3" v-if="selectedPlugin.permissions && selectedPlugin.permissions.length > 0">
          <strong>Berechtigungen:</strong>
          <div class="mt-2">
            <CBadge 
              v-for="permission in selectedPlugin.permissions" 
              :key="permission"
              color="warning"
              class="me-2 mb-2"
            >
              {{ permission }}
            </CBadge>
          </div>
        </div>
        
        <CRow>
          <CCol md="6" v-if="selectedPlugin.installedAt">
            <strong>Installiert am:</strong>
            <p>{{ formatDate(selectedPlugin.installedAt) }}</p>
          </CCol>
          <CCol md="6" v-if="selectedPlugin.updatedAt">
            <strong>Zuletzt aktualisiert:</strong>
            <p>{{ formatDate(selectedPlugin.updatedAt) }}</p>
          </CCol>
        </CRow>
      </div>
      <template #footer>
        <CButton color="secondary" @click="showDetailsModal = false">
          Schließen
        </CButton>
        <CButton 
          v-if="selectedPlugin"
          :color="selectedPlugin.active ? 'warning' : 'success'"
          @click="togglePlugin(selectedPlugin); showDetailsModal = false"
          :disabled="actionLoading[selectedPlugin.id]"
        >
          <CIcon :name="selectedPlugin.active ? 'cilMediaPause' : 'cilMediaPlay'" class="me-2" />
          {{ selectedPlugin.active ? 'Deaktivieren' : 'Aktivieren' }}
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Reactive data
const plugins = ref([])
const loadedPlugins = ref([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const searchTerm = ref('')
const activeOnly = ref(false)

// Modals
const showInstallModal = ref(false)
const showDetailsModal = ref(false)

// Form data
const installData = ref({
  name: '',
  version: '',
  description: ''
})

const selectedFile = ref(null)
const selectedPlugin = ref(null)

// Loading states
const installLoading = ref(false)
const actionLoading = ref({})

// File input ref
const fileInput = ref(null)

// Computed
const filteredPlugins = computed(() => {
  if (!searchTerm.value) return plugins.value
  
  return plugins.value.filter(plugin => 
    plugin.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    plugin.displayName?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    plugin.description?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Methods
const loadPlugins = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {}
    if (activeOnly.value) params.active_only = true
    
    const response = await axios.get('/api/plugins', { params })
    
    if (response.data.success) {
      plugins.value = response.data.data
    } else {
      error.value = response.data.message || 'Fehler beim Laden der Plugins'
    }
  } catch (err) {
    error.value = 'Fehler beim Laden der Plugins: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const loadLoadedPlugins = async () => {
  try {
    const response = await axios.get('/api/plugins/loaded')
    
    if (response.data.success) {
      loadedPlugins.value = response.data.data
    }
  } catch (err) {
    console.error('Fehler beim Laden der geladenen Plugins:', err)
  }
}

const handleSearch = () => {
  // Search is handled by computed property
}

const resetFilters = () => {
  searchTerm.value = ''
  activeOnly.value = false
  loadPlugins()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // Try to extract plugin name from filename
    const filename = file.name.replace(/\.(tar\.gz|tgz)$/, '')
    if (!installData.value.name) {
      installData.value.name = filename
    }
  } else {
    selectedFile.value = null
  }
}

const installPlugin = async () => {
  if (!selectedFile.value) {
    error.value = 'Bitte wählen Sie eine Plugin-Datei aus'
    return
  }
  
  installLoading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const formData = new FormData()
    formData.append('plugin_file', selectedFile.value)
    formData.append('name', installData.value.name)
    formData.append('version', installData.value.version)
    formData.append('description', installData.value.description)
    
    const response = await axios.post('/api/plugins', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      successMessage.value = 'Plugin erfolgreich installiert!'
      showInstallModal.value = false
      resetInstallForm()
      loadPlugins()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      error.value = response.data.message || 'Fehler bei der Plugin-Installation'
    }
  } catch (err) {
    error.value = 'Fehler bei der Plugin-Installation: ' + (err.response?.data?.message || err.message)
  } finally {
    installLoading.value = false
  }
}

const togglePlugin = async (plugin) => {
  actionLoading.value[plugin.id] = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const action = plugin.active ? 'deactivate' : 'activate'
    const response = await axios.post(`/api/plugins/${plugin.id}/${action}`)
    
    if (response.data.success) {
      successMessage.value = `Plugin ${plugin.active ? 'deaktiviert' : 'aktiviert'}!`
      loadPlugins()
      loadLoadedPlugins()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      error.value = response.data.message || `Fehler beim ${plugin.active ? 'Deaktivieren' : 'Aktivieren'} des Plugins`
    }
  } catch (err) {
    error.value = `Fehler beim ${plugin.active ? 'Deaktivieren' : 'Aktivieren'} des Plugins: ` + (err.response?.data?.message || err.message)
  } finally {
    actionLoading.value[plugin.id] = false
  }
}

const deletePlugin = async (plugin) => {
  if (confirm(`Möchten Sie das Plugin "${plugin.displayName || plugin.name}" wirklich löschen?`)) {
    actionLoading.value[plugin.id] = true
    error.value = ''
    successMessage.value = ''
    
    try {
      const response = await axios.delete(`/api/plugins/${plugin.id}`)
      
      if (response.data.success) {
        successMessage.value = 'Plugin erfolgreich gelöscht!'
        loadPlugins()
        loadLoadedPlugins()
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } else {
        error.value = response.data.message || 'Fehler beim Löschen des Plugins'
      }
    } catch (err) {
      error.value = 'Fehler beim Löschen des Plugins: ' + (err.response?.data?.message || err.message)
    } finally {
      actionLoading.value[plugin.id] = false
    }
  }
}

const showPluginDetails = (plugin) => {
  selectedPlugin.value = plugin
  showDetailsModal.value = true
}

const resetInstallForm = () => {
  installData.value = {
    name: '',
    version: '',
    description: ''
  }
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadPlugins(),
    loadLoadedPlugins()
  ])
})
</script>

<style scoped>
.card {
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.75em;
}

.btn-group .btn {
  flex: 1;
}
</style> 
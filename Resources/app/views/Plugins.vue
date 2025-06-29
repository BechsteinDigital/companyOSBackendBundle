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
                @click="showUploadModal = true"
                :disabled="loading"
              >
                <CIcon name="cilPlus" class="me-2" />
                Plugin hochladen
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

    <!-- Plugin Upload Modal -->
    <CModal 
      v-model="showUploadModal" 
      title="Plugin hochladen"
      size="lg"
      :backdrop="false"
    >
      <CModalBody>
        <!-- Upload Area -->
        <div 
          class="upload-area"
          :class="{ 
            'drag-over': isDragOver, 
            'has-file': selectedFile,
            'uploading': uploadLoading 
          }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @click="triggerFileInput"
        >
          <div class="upload-content" v-if="!selectedFile">
            <CIcon name="cilCloudUpload" size="3xl" class="upload-icon mb-3" />
            <h5>Plugin-Datei hier ablegen</h5>
            <p class="text-muted">oder klicken Sie, um eine Datei auszuwählen</p>
            <p class="text-muted small">
              Unterstützte Formate: .zip, .tar.gz, .tgz
            </p>
          </div>
          
          <div class="file-info" v-else>
            <CIcon name="cilFile" size="2xl" class="file-icon mb-2" />
            <h6>{{ selectedFile.name }}</h6>
            <p class="text-muted small">
              Größe: {{ formatFileSize(selectedFile.size) }}
            </p>
            <CButton 
              color="danger" 
              size="sm" 
              variant="outline"
              @click.stop="removeFile"
            >
              <CIcon name="cilTrash" class="me-1" />
              Datei entfernen
            </CButton>
          </div>
          
          <!-- Upload Progress -->
          <div v-if="uploadLoading" class="upload-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <p class="text-center mt-2">{{ uploadProgress }}% hochgeladen</p>
          </div>
        </div>
        
        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          accept=".zip,.tar.gz,.tgz"
          @change="handleFileSelect"
          style="display: none"
        />
        
        <!-- Plugin Information (if file is selected) -->
        <div v-if="selectedFile && !uploadLoading" class="mt-4">
          <h6>Plugin-Informationen</h6>
          <CRow>
            <CCol md="6">
              <CFormLabel>Plugin-Name</CFormLabel>
              <CFormInput
                v-model="pluginInfo.name"
                placeholder="Plugin-Name"
                :disabled="uploadLoading"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel>Version</CFormLabel>
              <CFormInput
                v-model="pluginInfo.version"
                placeholder="1.0.0"
                :disabled="uploadLoading"
              />
            </CCol>
          </CRow>
          <div class="mt-3">
            <CFormLabel>Beschreibung</CFormLabel>
            <CFormTextarea
              v-model="pluginInfo.description"
              placeholder="Plugin-Beschreibung..."
              rows="3"
              :disabled="uploadLoading"
            />
          </div>
        </div>
        
        <!-- Error Message -->
        <CAlert v-if="uploadError" color="danger" :visible="true" class="mt-3">
          {{ uploadError }}
        </CAlert>
      </CModalBody>
      
      <CModalFooter>
        <CButton color="secondary" @click="closeUploadModal" :disabled="uploadLoading">
          Abbrechen
        </CButton>
        <CButton 
          color="primary" 
          @click="uploadPlugin" 
          :disabled="!selectedFile || uploadLoading"
        >
          <CSpinner v-if="uploadLoading" size="sm" class="me-2" />
          <CIcon v-else name="cilCloudUpload" class="me-2" />
          {{ uploadLoading ? 'Wird hochgeladen...' : 'Plugin installieren' }}
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- Plugin Details Modal -->
    <CModal 
      v-model="showDetailsModal" 
      title="Plugin-Details"
      size="lg"
    >
      <CModalBody v-if="selectedPlugin">
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
      </CModalBody>
      <CModalFooter>
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
      </CModalFooter>
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
const showUploadModal = ref(false)
const showDetailsModal = ref(false)

// Upload state
const selectedFile = ref(null)
const isDragOver = ref(false)
const uploadLoading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')

// Plugin info
const pluginInfo = ref({
  name: '',
  version: '',
  description: ''
})

const selectedPlugin = ref(null)

// Loading states
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

// Upload methods
const triggerFileInput = () => {
  if (!uploadLoading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const validateAndSetFile = (file) => {
  uploadError.value = ''
  
  // Check file type
  const allowedTypes = ['.zip', '.tar.gz', '.tgz']
  const fileExtension = file.name.toLowerCase()
  const isValidType = allowedTypes.some(type => fileExtension.endsWith(type))
  
  if (!isValidType) {
    uploadError.value = 'Nur .zip, .tar.gz oder .tgz Dateien sind erlaubt'
    return
  }
  
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    uploadError.value = 'Datei ist zu groß. Maximale Größe: 50MB'
    return
  }
  
  selectedFile.value = file
  
  // Try to extract plugin name from filename
  const filename = file.name.replace(/\.(zip|tar\.gz|tgz)$/, '')
  if (!pluginInfo.value.name) {
    pluginInfo.value.name = filename
  }
}

const removeFile = () => {
  selectedFile.value = null
  uploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadPlugin = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'Bitte wählen Sie eine Plugin-Datei aus'
    return
  }
  
  uploadLoading.value = true
  uploadProgress.value = 0
  uploadError.value = ''
  error.value = ''
  successMessage.value = ''
  
  try {
    const formData = new FormData()
    formData.append('plugin_file', selectedFile.value)
    formData.append('name', pluginInfo.value.name)
    formData.append('version', pluginInfo.value.version)
    formData.append('description', pluginInfo.value.description)
    
    const response = await axios.post('/api/plugins', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })
    
    if (response.data.success) {
      successMessage.value = 'Plugin erfolgreich installiert!'
      closeUploadModal()
      loadPlugins()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      uploadError.value = response.data.message || 'Fehler bei der Plugin-Installation'
    }
  } catch (err) {
    uploadError.value = 'Fehler bei der Plugin-Installation: ' + (err.response?.data?.message || err.message)
  } finally {
    uploadLoading.value = false
    uploadProgress.value = 0
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadError.value = ''
  uploadProgress.value = 0
  pluginInfo.value = {
    name: '',
    version: '',
    description: ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
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

/* Upload Area Styles */
.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-area:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.upload-area.drag-over {
  border-color: #007bff;
  background: #e3f2fd;
  transform: scale(1.02);
}

.upload-area.has-file {
  border-color: #28a745;
  background: #f8fff9;
}

.upload-area.uploading {
  pointer-events: none;
  opacity: 0.7;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  color: #6c757d;
  font-size: 3rem;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-icon {
  color: #28a745;
  font-size: 2rem;
}

.upload-progress {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #28a745);
  transition: width 0.3s ease;
  border-radius: 4px;
}

/* Modal improvements */
.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
}
</style> 
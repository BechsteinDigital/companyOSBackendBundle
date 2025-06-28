<template>
  <div>
    <CRow>
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Webhook-Verwaltung</strong>
            <div class="ms-auto">
              <CButton 
                color="primary" 
                @click="showCreateModal = true"
                :disabled="loading"
              >
                <CIcon name="cilPlus" class="me-2" />
                Neuer Webhook
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <!-- Filter & Search -->
            <CRow class="mb-3">
              <CCol md="4">
                <CFormInput
                  v-model="searchTerm"
                  placeholder="Webhooks suchen..."
                  @input="handleSearch"
                />
              </CCol>
              <CCol md="3">
                <CFormSelect v-model="eventTypeFilter" @change="loadWebhooks">
                  <option value="">Alle Event-Types</option>
                  <option v-for="eventType in availableEventTypes" :key="eventType" :value="eventType">
                    {{ eventType }}
                  </option>
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <CFormCheck
                  v-model="activeOnly"
                  label="Nur aktive"
                  @change="loadWebhooks"
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
              <p class="mt-2">Lade Webhooks...</p>
            </div>

            <!-- Error Message -->
            <CAlert v-if="error" color="danger" :visible="true">
              {{ error }}
            </CAlert>

            <!-- Success Message -->
            <CAlert v-if="successMessage" color="success" :visible="true">
              {{ successMessage }}
            </CAlert>

            <!-- Webhooks Table -->
            <div v-if="!loading && webhooks.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Event-Types</th>
                    <th>Status</th>
                    <th>Letzte Ausführung</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="webhook in webhooks" :key="webhook.id">
                    <td>
                      <strong>{{ webhook.name }}</strong>
                      <br>
                      <small class="text-muted">{{ webhook.description || '-' }}</small>
                    </td>
                    <td>
                      <a :href="webhook.url" target="_blank" class="text-decoration-none">
                        {{ webhook.url }}
                      </a>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-1">
                        <CBadge 
                          v-for="eventType in webhook.eventTypes" 
                          :key="eventType" 
                          color="info" 
                          class="small"
                        >
                          {{ eventType }}
                        </CBadge>
                      </div>
                    </td>
                    <td>
                      <CBadge :color="webhook.active ? 'success' : 'secondary'">
                        {{ webhook.active ? 'Aktiv' : 'Inaktiv' }}
                      </CBadge>
                      <br>
                      <CBadge 
                        v-if="webhook.lastResponse"
                        :color="getStatusColor(webhook.lastResponse.status)"
                        class="mt-1"
                      >
                        {{ webhook.lastResponse.status }}
                      </CBadge>
                    </td>
                    <td>
                      <small>{{ formatDate(webhook.lastTriggered) }}</small>
                      <br>
                      <small class="text-muted" v-if="webhook.lastResponse">
                        {{ webhook.lastResponse.responseTime }}ms
                      </small>
                    </td>
                    <td>
                      <CButton 
                        color="info" 
                        size="sm" 
                        @click="testWebhook(webhook)"
                        class="me-2"
                        :disabled="actionLoading[webhook.id]"
                      >
                        <CSpinner v-if="actionLoading[webhook.id]" size="sm" class="me-1" />
                        <CIcon name="cilMediaPlay" />
                      </CButton>
                      <CButton 
                        color="primary" 
                        size="sm" 
                        @click="editWebhook(webhook)"
                        class="me-2"
                      >
                        <CIcon name="cilPencil" />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm" 
                        @click="deleteWebhook(webhook)"
                        :disabled="actionLoading[webhook.id]"
                      >
                        <CIcon name="cilTrash" />
                      </CButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- No Webhooks Message -->
            <div v-if="!loading && webhooks.length === 0" class="text-center py-4">
              <p class="text-muted">Keine Webhooks konfiguriert.</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Create Webhook Modal -->
    <CModal 
      v-model="showCreateModal" 
      title="Neuen Webhook erstellen"
      size="xl"
    >
      <CForm @submit.prevent="createWebhook">
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                v-model="newWebhook.name"
                required
                placeholder="Webhook-Name"
              />
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>URL</CFormLabel>
              <CFormInput
                v-model="newWebhook.url"
                type="url"
                required
                placeholder="https://example.com/webhook"
              />
            </div>
          </CCol>
        </CRow>
        
        <div class="mb-3">
          <CFormLabel>Beschreibung</CFormLabel>
          <CFormTextarea
            v-model="newWebhook.description"
            placeholder="Beschreibung des Webhooks..."
            rows="2"
          />
        </div>
        
        <div class="mb-3">
          <CFormLabel>Event-Types</CFormLabel>
          <div class="border p-3 rounded">
            <div class="row">
              <div class="col-md-6" v-for="eventType in availableEventTypes" :key="eventType">
                <CFormCheck
                  :value="eventType"
                  v-model="newWebhook.eventTypes"
                  :label="eventType"
                  :id="`event-${eventType}`"
                />
              </div>
            </div>
          </div>
        </div>
        
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>HTTP-Methode</CFormLabel>
              <CFormSelect v-model="newWebhook.method">
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </CFormSelect>
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Content-Type</CFormLabel>
              <CFormSelect v-model="newWebhook.contentType">
                <option value="application/json">application/json</option>
                <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                <option value="text/plain">text/plain</option>
              </CFormSelect>
            </div>
          </CCol>
        </CRow>
        
        <div class="mb-3">
          <CFormLabel>Headers (JSON)</CFormLabel>
          <CFormTextarea
            v-model="newWebhook.headersJson"
            placeholder='{"Authorization": "Bearer token", "X-API-Key": "key"}'
            rows="3"
          />
          <small class="text-muted">Optionale HTTP-Headers als JSON-Objekt</small>
        </div>
        
        <CRow>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Timeout (Sekunden)</CFormLabel>
              <CFormInput
                v-model="newWebhook.timeout"
                type="number"
                min="1"
                max="60"
                placeholder="30"
              />
            </div>
          </CCol>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Retry-Versuche</CFormLabel>
              <CFormInput
                v-model="newWebhook.retryAttempts"
                type="number"
                min="0"
                max="5"
                placeholder="3"
              />
            </div>
          </CCol>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Status</CFormLabel>
              <CFormCheck
                v-model="newWebhook.active"
                label="Webhook ist aktiv"
              />
            </div>
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showCreateModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="createWebhook" :disabled="createLoading">
          <CSpinner v-if="createLoading" size="sm" class="me-2" />
          Erstellen
        </CButton>
      </template>
    </CModal>

    <!-- Edit Webhook Modal -->
    <CModal 
      v-model="showEditModal" 
      title="Webhook bearbeiten"
      size="xl"
    >
      <CForm @submit.prevent="updateWebhook" v-if="editingWebhook">
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                v-model="editingWebhook.name"
                required
                placeholder="Webhook-Name"
              />
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>URL</CFormLabel>
              <CFormInput
                v-model="editingWebhook.url"
                type="url"
                required
                placeholder="https://example.com/webhook"
              />
            </div>
          </CCol>
        </CRow>
        
        <div class="mb-3">
          <CFormLabel>Beschreibung</CFormLabel>
          <CFormTextarea
            v-model="editingWebhook.description"
            placeholder="Beschreibung des Webhooks..."
            rows="2"
          />
        </div>
        
        <div class="mb-3">
          <CFormLabel>Event-Types</CFormLabel>
          <div class="border p-3 rounded">
            <div class="row">
              <div class="col-md-6" v-for="eventType in availableEventTypes" :key="eventType">
                <CFormCheck
                  :value="eventType"
                  v-model="editingWebhook.eventTypes"
                  :label="eventType"
                  :id="`edit-event-${eventType}`"
                />
              </div>
            </div>
          </div>
        </div>
        
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>HTTP-Methode</CFormLabel>
              <CFormSelect v-model="editingWebhook.method">
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </CFormSelect>
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Content-Type</CFormLabel>
              <CFormSelect v-model="editingWebhook.contentType">
                <option value="application/json">application/json</option>
                <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                <option value="text/plain">text/plain</option>
              </CFormSelect>
            </div>
          </CCol>
        </CRow>
        
        <div class="mb-3">
          <CFormLabel>Headers (JSON)</CFormLabel>
          <CFormTextarea
            v-model="editingWebhook.headersJson"
            placeholder='{"Authorization": "Bearer token", "X-API-Key": "key"}'
            rows="3"
          />
          <small class="text-muted">Optionale HTTP-Headers als JSON-Objekt</small>
        </div>
        
        <CRow>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Timeout (Sekunden)</CFormLabel>
              <CFormInput
                v-model="editingWebhook.timeout"
                type="number"
                min="1"
                max="60"
                placeholder="30"
              />
            </div>
          </CCol>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Retry-Versuche</CFormLabel>
              <CFormInput
                v-model="editingWebhook.retryAttempts"
                type="number"
                min="0"
                max="5"
                placeholder="3"
              />
            </div>
          </CCol>
          <CCol md="4">
            <div class="mb-3">
              <CFormLabel>Status</CFormLabel>
              <CFormCheck
                v-model="editingWebhook.active"
                label="Webhook ist aktiv"
              />
            </div>
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showEditModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="updateWebhook" :disabled="updateLoading">
          <CSpinner v-if="updateLoading" size="sm" class="me-2" />
          Speichern
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reactive data
const webhooks = ref([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const searchTerm = ref('')
const eventTypeFilter = ref('')
const activeOnly = ref(false)

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)

// Form data
const newWebhook = ref({
  name: '',
  url: '',
  description: '',
  eventTypes: [],
  method: 'POST',
  contentType: 'application/json',
  headersJson: '',
  timeout: 30,
  retryAttempts: 3,
  active: true
})

const editingWebhook = ref(null)

// Loading states
const createLoading = ref(false)
const updateLoading = ref(false)
const actionLoading = ref({})

// Available event types
const availableEventTypes = ref([
  'user.created',
  'user.updated',
  'user.deleted',
  'role.created',
  'role.updated',
  'role.deleted',
  'plugin.installed',
  'plugin.activated',
  'plugin.deactivated',
  'settings.updated',
  'system.maintenance.started',
  'system.maintenance.ended'
])

// Methods
const loadWebhooks = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {}
    if (activeOnly.value) params.active_only = true
    if (eventTypeFilter.value) params.event_type = eventTypeFilter.value
    if (searchTerm.value) params.search = searchTerm.value
    
    const response = await axios.get('/api/webhooks', { params })
    
    if (response.data.success) {
      webhooks.value = response.data.data
    } else {
      error.value = response.data.message || 'Fehler beim Laden der Webhooks'
    }
  } catch (err) {
    error.value = 'Fehler beim Laden der Webhooks: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadWebhooks()
}

const resetFilters = () => {
  searchTerm.value = ''
  eventTypeFilter.value = ''
  activeOnly.value = false
  loadWebhooks()
}

const createWebhook = async () => {
  createLoading.value = true
  error.value = ''
  
  try {
    const webhookData = { ...newWebhook.value }
    
    // Parse headers JSON
    if (webhookData.headersJson) {
      try {
        webhookData.headers = JSON.parse(webhookData.headersJson)
      } catch (e) {
        error.value = 'Ungültiges JSON-Format für Headers'
        createLoading.value = false
        return
      }
    }
    delete webhookData.headersJson
    
    const response = await axios.post('/api/webhooks', webhookData)
    
    if (response.data.success) {
      successMessage.value = 'Webhook erfolgreich erstellt!'
      showCreateModal.value = false
      resetNewWebhook()
      loadWebhooks()
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      error.value = response.data.message || 'Fehler beim Erstellen des Webhooks'
    }
  } catch (err) {
    error.value = 'Fehler beim Erstellen des Webhooks: ' + (err.response?.data?.message || err.message)
  } finally {
    createLoading.value = false
  }
}

const editWebhook = (webhook) => {
  editingWebhook.value = { ...webhook }
  editingWebhook.value.headersJson = webhook.headers ? JSON.stringify(webhook.headers, null, 2) : ''
  showEditModal.value = true
}

const updateWebhook = async () => {
  updateLoading.value = true
  error.value = ''
  
  try {
    const webhookData = { ...editingWebhook.value }
    
    // Parse headers JSON
    if (webhookData.headersJson) {
      try {
        webhookData.headers = JSON.parse(webhookData.headersJson)
      } catch (e) {
        error.value = 'Ungültiges JSON-Format für Headers'
        updateLoading.value = false
        return
      }
    }
    delete webhookData.headersJson
    
    const response = await axios.put(`/api/webhooks/${editingWebhook.value.id}`, webhookData)
    
    if (response.data.success) {
      successMessage.value = 'Webhook erfolgreich aktualisiert!'
      showEditModal.value = false
      loadWebhooks()
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      error.value = response.data.message || 'Fehler beim Aktualisieren des Webhooks'
    }
  } catch (err) {
    error.value = 'Fehler beim Aktualisieren des Webhooks: ' + (err.response?.data?.message || err.message)
  } finally {
    updateLoading.value = false
  }
}

const deleteWebhook = async (webhook) => {
  if (confirm(`Möchten Sie den Webhook "${webhook.name}" wirklich löschen?`)) {
    actionLoading.value[webhook.id] = true
    error.value = ''
    
    try {
      const response = await axios.delete(`/api/webhooks/${webhook.id}`)
      
      if (response.data.success) {
        successMessage.value = 'Webhook erfolgreich gelöscht!'
        loadWebhooks()
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } else {
        error.value = response.data.message || 'Fehler beim Löschen des Webhooks'
      }
    } catch (err) {
      error.value = 'Fehler beim Löschen des Webhooks: ' + (err.response?.data?.message || err.message)
    } finally {
      actionLoading.value[webhook.id] = false
    }
  }
}

const testWebhook = async (webhook) => {
  actionLoading.value[webhook.id] = true
  error.value = ''
  
  try {
    // Simulate a test webhook call
    const testPayload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook call'
      }
    }
    
    const response = await axios.post(webhook.url, testPayload, {
      headers: webhook.headers || {},
      timeout: (webhook.timeout || 30) * 1000
    })
    
    successMessage.value = `Webhook erfolgreich getestet! Status: ${response.status}`
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = `Webhook-Test fehlgeschlagen: ${err.response?.status || err.message}`
  } finally {
    actionLoading.value[webhook.id] = false
  }
}

const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500) return 'danger'
  return 'secondary'
}

const resetNewWebhook = () => {
  newWebhook.value = {
    name: '',
    url: '',
    description: '',
    eventTypes: [],
    method: 'POST',
    contentType: 'application/json',
    headersJson: '',
    timeout: 30,
    retryAttempts: 3,
    active: true
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
onMounted(() => {
  loadWebhooks()
})
</script> 

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.75em;
}

.small {
  font-size: 0.7em;
}
</style> 
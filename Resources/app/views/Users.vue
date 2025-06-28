<template>
  <div>
    <CRow>
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Benutzer-Verwaltung</strong>
            <div class="ms-auto">
              <CButton 
                color="primary" 
                @click="showCreateModal = true"
                :disabled="loading"
              >
                <CIcon name="cilPlus" class="me-2" />
                Neuer Benutzer
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <!-- Filter & Search -->
            <CRow class="mb-3">
              <CCol md="6">
                <CFormInput
                  v-model="searchTerm"
                  placeholder="Benutzer suchen..."
                  @input="handleSearch"
                />
              </CCol>
              <CCol md="3">
                <CFormSelect v-model="statusFilter" @change="loadUsers">
                  <option value="">Alle Status</option>
                  <option value="active">Aktiv</option>
                  <option value="inactive">Inaktiv</option>
                </CFormSelect>
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
              <p class="mt-2">Lade Benutzer...</p>
            </div>

            <!-- Error Message -->
            <CAlert v-if="error" color="danger" :visible="true">
              {{ error }}
            </CAlert>

            <!-- Users Table -->
            <div v-if="!loading && users.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Rollen</th>
                    <th>Status</th>
                    <th>Erstellt</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>
                      <strong>{{ user.fullName }}</strong>
                      <br>
                      <small class="text-muted">{{ user.firstName }} {{ user.lastName }}</small>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <CBadge 
                        v-for="role in user.roles" 
                        :key="role" 
                        color="info" 
                        class="me-1"
                      >
                        {{ role }}
                      </CBadge>
                    </td>
                    <td>
                      <CBadge :color="user.isActive ? 'success' : 'danger'">
                        {{ user.isActive ? 'Aktiv' : 'Inaktiv' }}
                      </CBadge>
                    </td>
                    <td>
                      <small>{{ formatDate(user.createdAt) }}</small>
                    </td>
                    <td>
                      <CButton 
                        color="primary" 
                        size="sm" 
                        @click="editUser(user)"
                        class="me-2"
                      >
                        <CIcon name="cilPencil" />
                      </CButton>
                      <CButton 
                        color="info" 
                        size="sm" 
                        @click="viewPermissions(user)"
                        class="me-2"
                      >
                        <CIcon name="cilShieldAlt" />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm" 
                        @click="deleteUser(user)"
                        :disabled="user.id === currentUser?.id"
                      >
                        <CIcon name="cilTrash" />
                      </CButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- No Users Message -->
            <div v-if="!loading && users.length === 0" class="text-center py-4">
              <p class="text-muted">Keine Benutzer gefunden.</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Create User Modal -->
    <CModal 
      v-model="showCreateModal" 
      title="Neuen Benutzer erstellen"
      size="lg"
    >
      <CForm @submit.prevent="createUser">
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Vorname</CFormLabel>
              <CFormInput
                v-model="newUser.firstName"
                required
                placeholder="Vorname eingeben"
              />
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Nachname</CFormLabel>
              <CFormInput
                v-model="newUser.lastName"
                required
                placeholder="Nachname eingeben"
              />
            </div>
          </CCol>
        </CRow>
        <div class="mb-3">
          <CFormLabel>E-Mail</CFormLabel>
          <CFormInput
            v-model="newUser.email"
            type="email"
            required
            placeholder="E-Mail eingeben"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Passwort</CFormLabel>
          <CFormInput
            v-model="newUser.password"
            type="password"
            required
            placeholder="Passwort eingeben"
          />
        </div>
        <div class="mb-3">
          <CFormCheck
            v-model="newUser.isActive"
            label="Benutzer ist aktiv"
          />
        </div>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showCreateModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="createUser" :disabled="createLoading">
          <CSpinner v-if="createLoading" size="sm" class="me-2" />
          Erstellen
        </CButton>
      </template>
    </CModal>

    <!-- Edit User Modal -->
    <CModal 
      v-model="showEditModal" 
      title="Benutzer bearbeiten"
      size="lg"
    >
      <CForm @submit.prevent="updateUser" v-if="editingUser">
        <CRow>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Vorname</CFormLabel>
              <CFormInput
                v-model="editingUser.firstName"
                required
                placeholder="Vorname eingeben"
              />
            </div>
          </CCol>
          <CCol md="6">
            <div class="mb-3">
              <CFormLabel>Nachname</CFormLabel>
              <CFormInput
                v-model="editingUser.lastName"
                required
                placeholder="Nachname eingeben"
              />
            </div>
          </CCol>
        </CRow>
        <div class="mb-3">
          <CFormLabel>E-Mail</CFormLabel>
          <CFormInput
            v-model="editingUser.email"
            type="email"
            required
            placeholder="E-Mail eingeben"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Neues Passwort (optional)</CFormLabel>
          <CFormInput
            v-model="editingUser.password"
            type="password"
            placeholder="Leer lassen, um Passwort nicht zu ändern"
          />
        </div>
        <div class="mb-3">
          <CFormCheck
            v-model="editingUser.isActive"
            label="Benutzer ist aktiv"
          />
        </div>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showEditModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="updateUser" :disabled="updateLoading">
          <CSpinner v-if="updateLoading" size="sm" class="me-2" />
          Speichern
        </CButton>
      </template>
    </CModal>

    <!-- Permissions Modal -->
    <CModal 
      v-model="showPermissionsModal" 
      title="Benutzer-Berechtigungen"
      size="lg"
    >
      <div v-if="selectedUserPermissions">
        <h6>Rollen:</h6>
        <div class="mb-3">
          <CBadge 
            v-for="role in selectedUserPermissions.roles" 
            :key="role" 
            color="info" 
            class="me-2 mb-2"
          >
            {{ role }}
          </CBadge>
        </div>
        
        <h6>Berechtigungen:</h6>
        <div>
          <CBadge 
            v-for="permission in selectedUserPermissions.permissions" 
            :key="permission" 
            color="success" 
            class="me-2 mb-2"
          >
            {{ permission }}
          </CBadge>
        </div>
      </div>
      <template #footer>
        <CButton color="secondary" @click="showPermissionsModal = false">
          Schließen
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import axios from 'axios'

// Stores
const authStore = useAuthStore()

// Reactive data
const users = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const statusFilter = ref('')

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionsModal = ref(false)

// Form data
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isActive: true
})

const editingUser = ref(null)
const selectedUserPermissions = ref(null)

// Loading states
const createLoading = ref(false)
const updateLoading = ref(false)

// Computed
const currentUser = computed(() => authStore.user)

// Methods
const loadUsers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {}
    if (statusFilter.value === 'active') params.active_only = true
    if (statusFilter.value === 'inactive') params.active_only = false
    
    const response = await axios.get('/api/users', { params })
    
    if (response.data.success) {
      users.value = response.data.data
    } else {
      error.value = response.data.message || 'Fehler beim Laden der Benutzer'
    }
  } catch (err) {
    error.value = 'Fehler beim Laden der Benutzer: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Implement search functionality
  loadUsers()
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  loadUsers()
}

const createUser = async () => {
  createLoading.value = true
  
  try {
    const response = await axios.post('/api/users', newUser.value)
    
    if (response.data.success) {
      showCreateModal.value = false
      resetNewUser()
      loadUsers()
    } else {
      error.value = response.data.message || 'Fehler beim Erstellen des Benutzers'
    }
  } catch (err) {
    error.value = 'Fehler beim Erstellen des Benutzers: ' + (err.response?.data?.message || err.message)
  } finally {
    createLoading.value = false
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  editingUser.value.password = '' // Don't pre-fill password
  showEditModal.value = true
}

const updateUser = async () => {
  updateLoading.value = true
  
  try {
    const userData = { ...editingUser.value }
    if (!userData.password) {
      delete userData.password // Don't send empty password
    }
    
    const response = await axios.put(`/api/users/${editingUser.value.id}`, userData)
    
    if (response.data.success) {
      showEditModal.value = false
      loadUsers()
    } else {
      error.value = response.data.message || 'Fehler beim Aktualisieren des Benutzers'
    }
  } catch (err) {
    error.value = 'Fehler beim Aktualisieren des Benutzers: ' + (err.response?.data?.message || err.message)
  } finally {
    updateLoading.value = false
  }
}

const deleteUser = async (user) => {
  if (confirm(`Möchten Sie den Benutzer "${user.fullName}" wirklich löschen?`)) {
    try {
      const response = await axios.delete(`/api/users/${user.id}`)
      
      if (response.data.success) {
        loadUsers()
      } else {
        error.value = response.data.message || 'Fehler beim Löschen des Benutzers'
      }
    } catch (err) {
      error.value = 'Fehler beim Löschen des Benutzers: ' + (err.response?.data?.message || err.message)
    }
  }
}

const viewPermissions = async (user) => {
  try {
    const response = await axios.get(`/api/user-permissions/list/${user.id}`)
    
    if (response.data.success) {
      selectedUserPermissions.value = {
        roles: user.roles,
        permissions: response.data.permissions
      }
      showPermissionsModal.value = true
    } else {
      error.value = response.data.message || 'Fehler beim Laden der Berechtigungen'
    }
  } catch (err) {
    error.value = 'Fehler beim Laden der Berechtigungen: ' + (err.response?.data?.message || err.message)
  }
}

const resetNewUser = () => {
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isActive: true
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('de-DE')
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.75em;
}
</style> 
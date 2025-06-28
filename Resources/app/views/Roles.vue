<template>
  <div>
    <CRow>
      <CCol xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Rollen-Verwaltung</strong>
            <div class="ms-auto">
              <CButton 
                color="primary" 
                @click="showCreateModal = true"
                :disabled="loading"
              >
                <CIcon name="cilPlus" class="me-2" />
                Neue Rolle
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <!-- Filter & Search -->
            <CRow class="mb-3">
              <CCol md="6">
                <CFormInput
                  v-model="searchTerm"
                  placeholder="Rollen suchen..."
                  @input="handleSearch"
                />
              </CCol>
              <CCol md="3">
                <CFormCheck
                  v-model="includeSystemRoles"
                  label="System-Rollen anzeigen"
                  @change="loadRoles"
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
              <p class="mt-2">Lade Rollen...</p>
            </div>

            <!-- Error Message -->
            <CAlert v-if="error" color="danger" :visible="true">
              {{ error }}
            </CAlert>

            <!-- Roles Table -->
            <div v-if="!loading && roles.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Anzeigename</th>
                    <th>Beschreibung</th>
                    <th>Berechtigungen</th>
                    <th>Typ</th>
                    <th>Benutzer</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="role in roles" :key="role.id">
                    <td>
                      <strong>{{ role.name }}</strong>
                    </td>
                    <td>{{ role.displayName }}</td>
                    <td>
                      <small class="text-muted">{{ role.description || '-' }}</small>
                    </td>
                    <td>
                      <CBadge color="success">
                        {{ role.permissions?.length || 0 }} Berechtigungen
                      </CBadge>
                    </td>
                    <td>
                      <CBadge :color="role.isSystemRole ? 'warning' : 'info'">
                        {{ role.isSystemRole ? 'System' : 'Benutzer' }}
                      </CBadge>
                    </td>
                    <td>
                      <CBadge color="primary">
                        {{ role.userCount || 0 }} Benutzer
                      </CBadge>
                    </td>
                    <td>
                      <CButton 
                        color="info" 
                        size="sm" 
                        @click="viewPermissions(role)"
                        class="me-2"
                      >
                        <CIcon name="cilShieldAlt" />
                      </CButton>
                      <CButton 
                        color="primary" 
                        size="sm" 
                        @click="editRole(role)"
                        class="me-2"
                        :disabled="role.isSystemRole"
                      >
                        <CIcon name="cilPencil" />
                      </CButton>
                      <CButton 
                        color="success" 
                        size="sm" 
                        @click="manageUsers(role)"
                        class="me-2"
                      >
                        <CIcon name="cilPeople" />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm" 
                        @click="deleteRole(role)"
                        :disabled="role.isSystemRole"
                      >
                        <CIcon name="cilTrash" />
                      </CButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- No Roles Message -->
            <div v-if="!loading && roles.length === 0" class="text-center py-4">
              <p class="text-muted">Keine Rollen gefunden.</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Create Role Modal -->
    <CModal 
      v-model="showCreateModal" 
      title="Neue Rolle erstellen"
      size="lg"
    >
      <CForm @submit.prevent="createRole">
        <div class="mb-3">
          <CFormLabel>Rollen-Name</CFormLabel>
          <CFormInput
            v-model="newRole.name"
            required
            placeholder="z.B. manager"
            :pattern="'^[a-zA-Z0-9_-]+$'"
          />
          <small class="text-muted">Nur Buchstaben, Zahlen, _ und - erlaubt</small>
        </div>
        <div class="mb-3">
          <CFormLabel>Anzeigename</CFormLabel>
          <CFormInput
            v-model="newRole.displayName"
            required
            placeholder="z.B. Manager"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Beschreibung</CFormLabel>
          <CFormTextarea
            v-model="newRole.description"
            placeholder="Beschreibung der Rolle..."
            rows="3"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Berechtigungen</CFormLabel>
          <div class="border p-3 rounded">
            <div v-for="permission in availablePermissions" :key="permission" class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :value="permission"
                v-model="newRole.permissions"
                :id="`perm-${permission}`"
              >
              <label class="form-check-label" :for="`perm-${permission}`">
                {{ permission }}
              </label>
            </div>
          </div>
        </div>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showCreateModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="createRole" :disabled="createLoading">
          <CSpinner v-if="createLoading" size="sm" class="me-2" />
          Erstellen
        </CButton>
      </template>
    </CModal>

    <!-- Edit Role Modal -->
    <CModal 
      v-model="showEditModal" 
      title="Rolle bearbeiten"
      size="lg"
    >
      <CForm @submit.prevent="updateRole" v-if="editingRole">
        <div class="mb-3">
          <CFormLabel>Rollen-Name</CFormLabel>
          <CFormInput
            v-model="editingRole.name"
            required
            placeholder="z.B. manager"
            :pattern="'^[a-zA-Z0-9_-]+$'"
          />
          <small class="text-muted">Nur Buchstaben, Zahlen, _ und - erlaubt</small>
        </div>
        <div class="mb-3">
          <CFormLabel>Anzeigename</CFormLabel>
          <CFormInput
            v-model="editingRole.displayName"
            required
            placeholder="z.B. Manager"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Beschreibung</CFormLabel>
          <CFormTextarea
            v-model="editingRole.description"
            placeholder="Beschreibung der Rolle..."
            rows="3"
          />
        </div>
        <div class="mb-3">
          <CFormLabel>Berechtigungen</CFormLabel>
          <div class="border p-3 rounded">
            <div v-for="permission in availablePermissions" :key="permission" class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :value="permission"
                v-model="editingRole.permissions"
                :id="`edit-perm-${permission}`"
              >
              <label class="form-check-label" :for="`edit-perm-${permission}`">
                {{ permission }}
              </label>
            </div>
          </div>
        </div>
      </CForm>
      <template #footer>
        <CButton color="secondary" @click="showEditModal = false">
          Abbrechen
        </CButton>
        <CButton color="primary" @click="updateRole" :disabled="updateLoading">
          <CSpinner v-if="updateLoading" size="sm" class="me-2" />
          Speichern
        </CButton>
      </template>
    </CModal>

    <!-- Permissions Modal -->
    <CModal 
      v-model="showPermissionsModal" 
      title="Rollen-Berechtigungen"
      size="lg"
    >
      <div v-if="selectedRole">
        <h6>Rolle: {{ selectedRole.displayName }}</h6>
        <p class="text-muted">{{ selectedRole.description }}</p>
        
        <h6>Berechtigungen:</h6>
        <div v-if="selectedRole.permissions && selectedRole.permissions.length > 0">
          <CBadge 
            v-for="permission in selectedRole.permissions" 
            :key="permission" 
            color="success" 
            class="me-2 mb-2"
          >
            {{ permission }}
          </CBadge>
        </div>
        <div v-else>
          <p class="text-muted">Keine Berechtigungen zugewiesen.</p>
        </div>
      </div>
      <template #footer>
        <CButton color="secondary" @click="showPermissionsModal = false">
          Schließen
        </CButton>
      </template>
    </CModal>

    <!-- Users Management Modal -->
    <CModal 
      v-model="showUsersModal" 
      title="Benutzer-Zuweisungen"
      size="xl"
    >
      <div v-if="selectedRole">
        <h6>Rolle: {{ selectedRole.displayName }}</h6>
        
        <!-- Current Users -->
        <div class="mb-4">
          <h6>Zugewiesene Benutzer:</h6>
          <div v-if="roleUsers.length > 0">
            <div v-for="user in roleUsers" :key="user.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <strong>{{ user.fullName }}</strong>
                <br>
                <small class="text-muted">{{ user.email }}</small>
              </div>
              <CButton 
                color="danger" 
                size="sm" 
                @click="removeUserFromRole(user.id)"
              >
                <CIcon name="cilMinus" />
              </CButton>
            </div>
          </div>
          <div v-else>
            <p class="text-muted">Keine Benutzer zugewiesen.</p>
          </div>
        </div>

        <!-- Available Users -->
        <div>
          <h6>Verfügbare Benutzer:</h6>
          <div v-if="availableUsers.length > 0">
            <div v-for="user in availableUsers" :key="user.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <strong>{{ user.fullName }}</strong>
                <br>
                <small class="text-muted">{{ user.email }}</small>
              </div>
              <CButton 
                color="success" 
                size="sm" 
                @click="assignUserToRole(user.id)"
              >
                <CIcon name="cilPlus" />
              </CButton>
            </div>
          </div>
          <div v-else>
            <p class="text-muted">Alle Benutzer bereits zugewiesen.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <CButton color="secondary" @click="showUsersModal = false">
          Schließen
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reactive data
const roles = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const includeSystemRoles = ref(true)

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionsModal = ref(false)
const showUsersModal = ref(false)

// Form data
const newRole = ref({
  name: '',
  displayName: '',
  description: '',
  permissions: []
})

const editingRole = ref(null)
const selectedRole = ref(null)

// Users management
const roleUsers = ref([])
const availableUsers = ref([])

// Loading states
const createLoading = ref(false)
const updateLoading = ref(false)

// Available permissions (diese könnten auch von einer API geladen werden)
const availablePermissions = ref([
  'user.create',
  'user.read',
  'user.update',
  'user.delete',
  'role.create',
  'role.read',
  'role.update',
  'role.delete',
  'settings.read',
  'settings.update',
  'plugin.read',
  'plugin.manage',
  'webhook.read',
  'webhook.manage',
  'system.admin'
])

// Methods
const loadRoles = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      include_system: includeSystemRoles.value
    }
    if (searchTerm.value) {
      params.search = searchTerm.value
    }
    
    const response = await axios.get('/api/roles', { params })
    
    if (response.data.success) {
      roles.value = response.data.data
    } else {
      error.value = response.data.message || 'Fehler beim Laden der Rollen'
    }
  } catch (err) {
    error.value = 'Fehler beim Laden der Rollen: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadRoles()
}

const resetFilters = () => {
  searchTerm.value = ''
  includeSystemRoles.value = true
  loadRoles()
}

const createRole = async () => {
  createLoading.value = true
  
  try {
    const response = await axios.post('/api/roles', newRole.value)
    
    if (response.data.success) {
      showCreateModal.value = false
      resetNewRole()
      loadRoles()
    } else {
      error.value = response.data.message || 'Fehler beim Erstellen der Rolle'
    }
  } catch (err) {
    error.value = 'Fehler beim Erstellen der Rolle: ' + (err.response?.data?.message || err.message)
  } finally {
    createLoading.value = false
  }
}

const editRole = (role) => {
  editingRole.value = { ...role }
  if (!editingRole.value.permissions) {
    editingRole.value.permissions = []
  }
  showEditModal.value = true
}

const updateRole = async () => {
  updateLoading.value = true
  
  try {
    const response = await axios.put(`/api/roles/${editingRole.value.id}`, editingRole.value)
    
    if (response.data.success) {
      showEditModal.value = false
      loadRoles()
    } else {
      error.value = response.data.message || 'Fehler beim Aktualisieren der Rolle'
    }
  } catch (err) {
    error.value = 'Fehler beim Aktualisieren der Rolle: ' + (err.response?.data?.message || err.message)
  } finally {
    updateLoading.value = false
  }
}

const deleteRole = async (role) => {
  if (confirm(`Möchten Sie die Rolle "${role.displayName}" wirklich löschen?`)) {
    try {
      const response = await axios.delete(`/api/roles/${role.id}`)
      
      if (response.data.success) {
        loadRoles()
      } else {
        error.value = response.data.message || 'Fehler beim Löschen der Rolle'
      }
    } catch (err) {
      error.value = 'Fehler beim Löschen der Rolle: ' + (err.response?.data?.message || err.message)
    }
  }
}

const viewPermissions = (role) => {
  selectedRole.value = role
  showPermissionsModal.value = true
}

const manageUsers = async (role) => {
  selectedRole.value = role
  
  try {
    // Load users with this role
    const roleUsersResponse = await axios.get(`/api/roles/user/${role.id}`)
    if (roleUsersResponse.data.success) {
      roleUsers.value = roleUsersResponse.data.data
    }
    
    // Load all users to show available users
    const allUsersResponse = await axios.get('/api/users')
    if (allUsersResponse.data.success) {
      const allUsers = allUsersResponse.data.data
      // Filter out users that already have this role
      const roleUserIds = roleUsers.value.map(u => u.id)
      availableUsers.value = allUsers.filter(u => !roleUserIds.includes(u.id))
    }
    
    showUsersModal.value = true
  } catch (err) {
    error.value = 'Fehler beim Laden der Benutzer: ' + (err.response?.data?.message || err.message)
  }
}

const assignUserToRole = async (userId) => {
  try {
    const response = await axios.post(`/api/roles/${selectedRole.value.id}/assign/${userId}`)
    
    if (response.data.success) {
      // Reload users for this role
      manageUsers(selectedRole.value)
    } else {
      error.value = response.data.message || 'Fehler beim Zuweisen der Rolle'
    }
  } catch (err) {
    error.value = 'Fehler beim Zuweisen der Rolle: ' + (err.response?.data?.message || err.message)
  }
}

const removeUserFromRole = async (userId) => {
  try {
    const response = await axios.delete(`/api/roles/${selectedRole.value.id}/remove/${userId}`)
    
    if (response.data.success) {
      // Reload users for this role
      manageUsers(selectedRole.value)
    } else {
      error.value = response.data.message || 'Fehler beim Entfernen der Rolle'
    }
  } catch (err) {
    error.value = 'Fehler beim Entfernen der Rolle: ' + (err.response?.data?.message || err.message)
  }
}

const resetNewRole = () => {
  newRole.value = {
    name: '',
    displayName: '',
    description: '',
    permissions: []
  }
}

// Lifecycle
onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.75em;
}

.form-check {
  margin-bottom: 0.5rem;
}
</style> 
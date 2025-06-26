<template>
  <div class="permissions-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Berechtigungsverwaltung</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="showCreateModal = true">
          <i class="cil-plus"></i> Neue Berechtigung
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Schlüssel</th>
            <th>Beschreibung</th>
            <th>Modul</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in permissions" :key="permission.id">
            <td>{{ permission.id }}</td>
            <td>{{ permission.name }}</td>
            <td><code>{{ permission.key }}</code></td>
            <td>{{ permission.description }}</td>
            <td>{{ permission.module }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="editPermission(permission)">
                <i class="cil-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deletePermission(permission.id)">
                <i class="cil-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" :style="{ display: showCreateModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingPermission ? 'Berechtigung bearbeiten' : 'Neue Berechtigung erstellen' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePermission">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="permissionForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Schlüssel</label>
                <input type="text" class="form-control" v-model="permissionForm.key" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Beschreibung</label>
                <textarea class="form-control" v-model="permissionForm.description" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Modul</label>
                <select class="form-select" v-model="permissionForm.module" required>
                  <option value="">Modul auswählen</option>
                  <option value="users">Benutzer</option>
                  <option value="roles">Rollen</option>
                  <option value="permissions">Berechtigungen</option>
                  <option value="plugins">Plugins</option>
                  <option value="settings">Einstellungen</option>
                  <option value="system">System</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Abbrechen</button>
            <button type="button" class="btn btn-primary" @click="savePermission">Speichern</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showCreateModal"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const permissions = ref([
  { id: 1, name: 'Benutzer anzeigen', key: 'users.view', description: 'Benutzerliste anzeigen', module: 'users' },
  { id: 2, name: 'Benutzer erstellen', key: 'users.create', description: 'Neue Benutzer erstellen', module: 'users' },
  { id: 3, name: 'Benutzer bearbeiten', key: 'users.edit', description: 'Benutzerdaten bearbeiten', module: 'users' },
  { id: 4, name: 'Benutzer löschen', key: 'users.delete', description: 'Benutzer löschen', module: 'users' },
  { id: 5, name: 'Rollen verwalten', key: 'roles.manage', description: 'Rollen erstellen und bearbeiten', module: 'roles' },
  { id: 6, name: 'Berechtigungen verwalten', key: 'permissions.manage', description: 'Berechtigungen verwalten', module: 'permissions' },
  { id: 7, name: 'Plugins verwalten', key: 'plugins.manage', description: 'Plugins installieren und konfigurieren', module: 'plugins' },
  { id: 8, name: 'Systemeinstellungen', key: 'settings.system', description: 'Systemeinstellungen ändern', module: 'settings' }
])

const showCreateModal = ref(false)
const editingPermission = ref(null)
const permissionForm = reactive({
  name: '',
  key: '',
  description: '',
  module: ''
})

const editPermission = (permission) => {
  editingPermission.value = permission
  permissionForm.name = permission.name
  permissionForm.key = permission.key
  permissionForm.description = permission.description
  permissionForm.module = permission.module
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingPermission.value = null
  permissionForm.name = ''
  permissionForm.key = ''
  permissionForm.description = ''
  permissionForm.module = ''
}

const savePermission = () => {
  if (editingPermission.value) {
    // Update existing permission
    const index = permissions.value.findIndex(p => p.id === editingPermission.value.id)
    permissions.value[index] = { ...editingPermission.value, ...permissionForm }
  } else {
    // Create new permission
    const newPermission = {
      id: Math.max(...permissions.value.map(p => p.id)) + 1,
      ...permissionForm
    }
    permissions.value.push(newPermission)
  }
  closeModal()
}

const deletePermission = (id) => {
  if (confirm('Sind Sie sicher, dass Sie diese Berechtigung löschen möchten?')) {
    permissions.value = permissions.value.filter(p => p.id !== id)
  }
}
</script>

<style scoped>
.permissions-page {
  padding: 20px;
}
</style> 
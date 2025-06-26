<template>
  <div class="roles-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Rollenverwaltung</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="showCreateModal = true">
          <i class="cil-plus"></i> Neue Rolle
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Beschreibung</th>
            <th>Berechtigungen</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>{{ role.permissions.length }} Berechtigungen</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="editRole(role)">
                <i class="cil-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteRole(role.id)">
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
            <h5 class="modal-title">{{ editingRole ? 'Rolle bearbeiten' : 'Neue Rolle erstellen' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRole">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="roleForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Beschreibung</label>
                <textarea class="form-control" v-model="roleForm.description" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Abbrechen</button>
            <button type="button" class="btn btn-primary" @click="saveRole">Speichern</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showCreateModal"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const roles = ref([
  { id: 1, name: 'Administrator', description: 'Vollzugriff auf alle Funktionen', permissions: ['all'] },
  { id: 2, name: 'Manager', description: 'Verwaltung von Benutzern und Inhalten', permissions: ['users', 'content'] },
  { id: 3, name: 'Editor', description: 'Bearbeitung von Inhalten', permissions: ['content'] }
])

const showCreateModal = ref(false)
const editingRole = ref(null)
const roleForm = reactive({
  name: '',
  description: ''
})

const editRole = (role) => {
  editingRole.value = role
  roleForm.name = role.name
  roleForm.description = role.description
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingRole.value = null
  roleForm.name = ''
  roleForm.description = ''
}

const saveRole = () => {
  if (editingRole.value) {
    // Update existing role
    const index = roles.value.findIndex(r => r.id === editingRole.value.id)
    roles.value[index] = { ...editingRole.value, ...roleForm }
  } else {
    // Create new role
    const newRole = {
      id: Math.max(...roles.value.map(r => r.id)) + 1,
      ...roleForm,
      permissions: []
    }
    roles.value.push(newRole)
  }
  closeModal()
}

const deleteRole = (id) => {
  if (confirm('Sind Sie sicher, dass Sie diese Rolle löschen möchten?')) {
    roles.value = roles.value.filter(r => r.id !== id)
  }
}
</script>

<style scoped>
.roles-page {
  padding: 20px;
}
</style> 
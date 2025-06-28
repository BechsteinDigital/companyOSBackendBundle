<template>
  <div class="user-list-hybrid">
    <h2>User-Verwaltung (Hybrid Permissions)</h2>
    
    <div class="user-grid">
      <div 
        v-for="user in users" 
        :key="user.id"
        class="user-card"
      >
        <div class="user-info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p>{{ user.email }}</p>
          <p>Abteilung: {{ user.department || 'Keine' }}</p>
        </div>
        
        <div class="user-actions">
          <!-- Basis RBAC: Hat user.read Permission? -->
          <button 
            v-if="auth.hasPermission('user.read')"
            @click="viewUser(user)"
            class="btn-primary"
          >
            👁️ Anzeigen
          </button>
          
          <!-- Hybrid Check: Kann diesen spezifischen User bearbeiten? -->
          <button 
            v-if="canEditUser(user)"
            @click="editUser(user)"
            class="btn-secondary"
          >
            ✏️ Bearbeiten
          </button>
          
          <!-- Hybrid Check: Kann User löschen (Zeit + Department-Regeln)? -->
          <button 
            v-if="canDeleteUser(user)"
            @click="deleteUser(user)"
            class="btn-danger"
          >
            🗑️ Löschen
          </button>
          
          <!-- Admin-Überschreibung: Admin sieht immer alle Buttons -->
          <button 
            v-if="auth.hasRole('ROLE_ADMIN')"
            @click="forceAction(user)"
            class="btn-admin"
          >
            🔧 Admin-Aktion
          </button>
        </div>
        
        <!-- Permission-Debug (nur in Development) -->
        <div v-if="isDevelopment" class="permission-debug">
          <details>
            <summary>🐛 Permission Debug</summary>
            <pre>{{ getUserPermissionDebug(user) }}</pre>
          </details>
        </div>
      </div>
    </div>
    
    <!-- Batch-Permission Result -->
    <div v-if="batchPermissions" class="batch-permissions">
      <h3>Batch-Permission Check Result:</h3>
      <pre>{{ JSON.stringify(batchPermissions, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const users = ref([])
const batchPermissions = ref(null)
const isDevelopment = process.env.NODE_ENV === 'development'

// Hybrid Permission Checks
const canEditUser = (user) => {
  return auth.hasHybridPermission('user.update', {
    resource: {
      owner_id: user.id,
      department: user.department
    }
  })
}

const canDeleteUser = (user) => {
  return auth.hasHybridPermission('user.delete', {
    resource: {
      owner_id: user.id,
      department: user.department
    }
  })
}

// Permission Debug für Development
const getUserPermissionDebug = (user) => {
  if (!isDevelopment) return null
  
  const context = {
    resource: {
      owner_id: user.id,
      department: user.department
    }
  }
  
  return {
    user_id: user.id,
    current_user: auth.user?.id,
    permissions: {
      'user.read': auth.hasPermission('user.read'),
      'user.update': auth.hasPermission('user.update'),
      'user.delete': auth.hasPermission('user.delete'),
    },
    hybrid_permissions: {
      'user.update': canEditUser(user),
      'user.delete': canDeleteUser(user),
    },
    context,
    abac_rules: {
      is_own_profile: user.id === auth.user?.id,
      same_department: user.department === auth.user?.department,
      working_hours: new Date().getHours() >= 9 && new Date().getHours() <= 17,
    }
  }
}

// Batch Permission Check
const checkBatchPermissions = async () => {
  const permissions = ['user.read', 'user.update', 'user.delete']
  const context = {
    action: 'bulk_operation',
    source: 'user_list'
  }
  
  batchPermissions.value = await auth.checkBatchPermissions(permissions, context)
}

// Actions
const viewUser = (user) => {
  console.log('Viewing user:', user)
  // Navigation zu User-Detail
}

const editUser = (user) => {
  console.log('Editing user:', user)
  // Navigation zu User-Edit
}

const deleteUser = (user) => {
  if (confirm(`User ${user.firstName} ${user.lastName} wirklich löschen?`)) {
    console.log('Deleting user:', user)
    // Delete API Call
  }
}

const forceAction = (user) => {
  console.log('Admin force action on user:', user)
  // Admin-spezifische Aktionen
}

// Lifecycle
onMounted(async () => {
  // Dummy Users für Beispiel
  users.value = [
    {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      department: 'IT'
    },
    {
      id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna@example.com',
      department: 'HR'
    },
    {
      id: auth.user?.id, // Eigener User
      firstName: 'Ich',
      lastName: 'Selbst',
      email: auth.user?.email,
      department: auth.user?.department
    }
  ]
  
  // Batch Permission Check
  await checkBatchPermissions()
})
</script>

<style scoped>
.user-list-hybrid {
  padding: 1rem;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.user-info p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.user-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-danger { background: #dc3545; color: white; }
.btn-admin { background: #28a745; color: white; }

.permission-debug {
  margin-top: 1rem;
  font-size: 0.8rem;
}

.permission-debug details {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
}

.permission-debug pre {
  margin: 0.5rem 0;
  font-size: 0.7rem;
  white-space: pre-wrap;
}

.batch-permissions {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.batch-permissions pre {
  font-size: 0.8rem;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style> 
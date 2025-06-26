<template>
  <div class="plugins-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Plugin-Verwaltung</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="showUploadModal = true">
          <i class="cil-plus"></i> Plugin hochladen
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>Plugin</th>
                <th>Version</th>
                <th>Status</th>
                <th>Autor</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plugin in plugins" :key="plugin.id">
                <td>
                  <strong>{{ plugin.name }}</strong>
                  <br>
                  <small class="text-muted">{{ plugin.description }}</small>
                </td>
                <td>{{ plugin.version }}</td>
                <td>
                  <span :class="getStatusClass(plugin.status)">
                    {{ getStatusText(plugin.status) }}
                  </span>
                </td>
                <td>{{ plugin.author }}</td>
                <td>
                  <button 
                    v-if="plugin.status === 'inactive'" 
                    class="btn btn-sm btn-outline-success me-1" 
                    @click="activatePlugin(plugin.id)"
                  >
                    <i class="cil-check"></i> Aktivieren
                  </button>
                  <button 
                    v-if="plugin.status === 'active'" 
                    class="btn btn-sm btn-outline-warning me-1" 
                    @click="deactivatePlugin(plugin.id)"
                  >
                    <i class="cil-ban"></i> Deaktivieren
                  </button>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="configurePlugin(plugin)">
                    <i class="cil-cog"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="uninstallPlugin(plugin.id)">
                    <i class="cil-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Plugin-Statistiken</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>Aktiv:</span>
              <span class="badge bg-success">{{ activePlugins }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Inaktiv:</span>
              <span class="badge bg-secondary">{{ inactivePlugins }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Fehlerhaft:</span>
              <span class="badge bg-danger">{{ errorPlugins }}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
              <span>Gesamt:</span>
              <span class="badge bg-primary">{{ plugins.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div class="modal fade" :class="{ show: showUploadModal }" :style="{ display: showUploadModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Plugin hochladen</h5>
            <button type="button" class="btn-close" @click="closeUploadModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Plugin-Datei (.zip)</label>
              <input type="file" class="form-control" accept=".zip" @change="handleFileUpload">
            </div>
            <div class="alert alert-info">
              <i class="cil-info"></i>
              Laden Sie eine gültige Plugin-Datei im ZIP-Format hoch. Die Datei sollte eine plugin.json Konfigurationsdatei enthalten.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeUploadModal">Abbrechen</button>
            <button type="button" class="btn btn-primary" @click="uploadPlugin" :disabled="!selectedFile">
              Hochladen
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showUploadModal"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const plugins = ref([
  { 
    id: 1, 
    name: 'User Management', 
    description: 'Erweiterte Benutzerverwaltung mit Rollen und Berechtigungen',
    version: '1.2.0',
    status: 'active',
    author: 'CompanyOS Team'
  },
  { 
    id: 2, 
    name: 'API Documentation', 
    description: 'Automatische API-Dokumentation mit Swagger UI',
    version: '2.1.0',
    status: 'active',
    author: 'CompanyOS Team'
  },
  { 
    id: 3, 
    name: 'System Monitor', 
    description: 'Systemüberwachung und Performance-Monitoring',
    version: '1.0.5',
    status: 'inactive',
    author: 'Third Party'
  },
  { 
    id: 4, 
    name: 'Backup Manager', 
    description: 'Automatische Backups und Wiederherstellung',
    version: '1.1.2',
    status: 'error',
    author: 'CompanyOS Team'
  }
])

const showUploadModal = ref(false)
const selectedFile = ref(null)

const activePlugins = computed(() => plugins.value.filter(p => p.status === 'active').length)
const inactivePlugins = computed(() => plugins.value.filter(p => p.status === 'inactive').length)
const errorPlugins = computed(() => plugins.value.filter(p => p.status === 'error').length)

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'badge bg-success'
    case 'inactive': return 'badge bg-secondary'
    case 'error': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Aktiv'
    case 'inactive': return 'Inaktiv'
    case 'error': return 'Fehler'
    default: return 'Unbekannt'
  }
}

const activatePlugin = (id) => {
  const plugin = plugins.value.find(p => p.id === id)
  if (plugin) {
    plugin.status = 'active'
  }
}

const deactivatePlugin = (id) => {
  const plugin = plugins.value.find(p => p.id === id)
  if (plugin) {
    plugin.status = 'inactive'
  }
}

const configurePlugin = (plugin) => {
  alert(`Konfiguration für Plugin: ${plugin.name}`)
}

const uninstallPlugin = (id) => {
  if (confirm('Sind Sie sicher, dass Sie dieses Plugin deinstallieren möchten?')) {
    plugins.value = plugins.value.filter(p => p.id !== id)
  }
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
}

const uploadPlugin = () => {
  if (selectedFile.value) {
    // Simulate upload
    alert('Plugin wird hochgeladen...')
    closeUploadModal()
  }
}
</script>

<style scoped>
.plugins-page {
  padding: 20px;
}
</style> 
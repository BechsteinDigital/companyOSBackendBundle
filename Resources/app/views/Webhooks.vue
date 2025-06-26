<template>
  <div class="webhooks-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Webhook-Verwaltung</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="showCreateModal = true">
          <i class="cil-plus"></i> Neuer Webhook
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Events</th>
                <th>Status</th>
                <th>Letzter Aufruf</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="webhook in webhooks" :key="webhook.id">
                <td>
                  <strong>{{ webhook.name }}</strong>
                  <br>
                  <small class="text-muted">{{ webhook.description }}</small>
                </td>
                <td>
                  <code class="text-truncate d-inline-block" style="max-width: 200px;">{{ webhook.url }}</code>
                </td>
                <td>
                  <span v-for="event in webhook.events" :key="event" class="badge bg-info me-1">
                    {{ event }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusClass(webhook.status)">
                    {{ getStatusText(webhook.status) }}
                  </span>
                </td>
                <td>
                  <small>{{ webhook.lastCall || 'Nie' }}</small>
                </td>
                <td>
                  <button 
                    v-if="webhook.status === 'inactive'" 
                    class="btn btn-sm btn-outline-success me-1" 
                    @click="activateWebhook(webhook.id)"
                  >
                    <i class="cil-check"></i>
                  </button>
                  <button 
                    v-if="webhook.status === 'active'" 
                    class="btn btn-sm btn-outline-warning me-1" 
                    @click="deactivateWebhook(webhook.id)"
                  >
                    <i class="cil-ban"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editWebhook(webhook)">
                    <i class="cil-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info me-1" @click="testWebhook(webhook.id)">
                    <i class="cil-send"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteWebhook(webhook.id)">
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
            <h5 class="card-title mb-0">Webhook-Statistiken</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>Aktiv:</span>
              <span class="badge bg-success">{{ activeWebhooks }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Inaktiv:</span>
              <span class="badge bg-secondary">{{ inactiveWebhooks }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Fehlerhaft:</span>
              <span class="badge bg-danger">{{ errorWebhooks }}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
              <span>Gesamt:</span>
              <span class="badge bg-primary">{{ webhooks.length }}</span>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Verfügbare Events</h5>
          </div>
          <div class="card-body">
            <div v-for="event in availableEvents" :key="event.key" class="mb-2">
              <strong>{{ event.name }}</strong>
              <br>
              <small class="text-muted">{{ event.description }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" :style="{ display: showCreateModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingWebhook ? 'Webhook bearbeiten' : 'Neuer Webhook' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveWebhook">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="webhookForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Beschreibung</label>
                <textarea class="form-control" v-model="webhookForm.description" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">URL</label>
                <input type="url" class="form-control" v-model="webhookForm.url" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Events</label>
                <div class="row">
                  <div v-for="event in availableEvents" :key="event.key" class="col-md-6">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :value="event.key"
                        v-model="webhookForm.events"
                        :id="'event-' + event.key"
                      >
                      <label class="form-check-label" :for="'event-' + event.key">
                        {{ event.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Secret Key (optional)</label>
                <input type="text" class="form-control" v-model="webhookForm.secret" placeholder="Für HMAC-Signatur">
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="webhookForm.retryOnFailure">
                  <label class="form-check-label">
                    Bei Fehlern wiederholen
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Abbrechen</button>
            <button type="button" class="btn btn-primary" @click="saveWebhook">Speichern</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showCreateModal"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const webhooks = ref([
  { 
    id: 1, 
    name: 'User Registration', 
    description: 'Benachrichtigung bei neuer Benutzerregistrierung',
    url: 'https://api.example.com/webhooks/user-registration',
    events: ['user.created'],
    status: 'active',
    lastCall: '2024-01-15 14:30:00'
  },
  { 
    id: 2, 
    name: 'Order Processing', 
    description: 'Bestellungen an ERP-System weiterleiten',
    url: 'https://erp.example.com/webhooks/orders',
    events: ['order.created', 'order.updated'],
    status: 'active',
    lastCall: '2024-01-15 13:45:00'
  },
  { 
    id: 3, 
    name: 'System Alerts', 
    description: 'Systemwarnungen an Monitoring-Service',
    url: 'https://monitoring.example.com/alerts',
    events: ['system.error', 'system.warning'],
    status: 'inactive',
    lastCall: null
  }
])

const availableEvents = [
  { key: 'user.created', name: 'Benutzer erstellt', description: 'Wenn ein neuer Benutzer registriert wird' },
  { key: 'user.updated', name: 'Benutzer aktualisiert', description: 'Wenn Benutzerdaten geändert werden' },
  { key: 'user.deleted', name: 'Benutzer gelöscht', description: 'Wenn ein Benutzer gelöscht wird' },
  { key: 'order.created', name: 'Bestellung erstellt', description: 'Wenn eine neue Bestellung erstellt wird' },
  { key: 'order.updated', name: 'Bestellung aktualisiert', description: 'Wenn eine Bestellung geändert wird' },
  { key: 'order.cancelled', name: 'Bestellung storniert', description: 'Wenn eine Bestellung storniert wird' },
  { key: 'system.error', name: 'Systemfehler', description: 'Bei kritischen Systemfehlern' },
  { key: 'system.warning', name: 'Systemwarnung', description: 'Bei Systemwarnungen' }
]

const showCreateModal = ref(false)
const editingWebhook = ref(null)
const webhookForm = reactive({
  name: '',
  description: '',
  url: '',
  events: [],
  secret: '',
  retryOnFailure: true
})

const activeWebhooks = computed(() => webhooks.value.filter(w => w.status === 'active').length)
const inactiveWebhooks = computed(() => webhooks.value.filter(w => w.status === 'inactive').length)
const errorWebhooks = computed(() => webhooks.value.filter(w => w.status === 'error').length)

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

const editWebhook = (webhook) => {
  editingWebhook.value = webhook
  webhookForm.name = webhook.name
  webhookForm.description = webhook.description
  webhookForm.url = webhook.url
  webhookForm.events = [...webhook.events]
  webhookForm.secret = webhook.secret || ''
  webhookForm.retryOnFailure = webhook.retryOnFailure !== false
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingWebhook.value = null
  webhookForm.name = ''
  webhookForm.description = ''
  webhookForm.url = ''
  webhookForm.events = []
  webhookForm.secret = ''
  webhookForm.retryOnFailure = true
}

const saveWebhook = () => {
  if (editingWebhook.value) {
    // Update existing webhook
    const index = webhooks.value.findIndex(w => w.id === editingWebhook.value.id)
    webhooks.value[index] = { ...editingWebhook.value, ...webhookForm }
  } else {
    // Create new webhook
    const newWebhook = {
      id: Math.max(...webhooks.value.map(w => w.id)) + 1,
      ...webhookForm,
      status: 'inactive',
      lastCall: null
    }
    webhooks.value.push(newWebhook)
  }
  closeModal()
}

const activateWebhook = (id) => {
  const webhook = webhooks.value.find(w => w.id === id)
  if (webhook) {
    webhook.status = 'active'
  }
}

const deactivateWebhook = (id) => {
  const webhook = webhooks.value.find(w => w.id === id)
  if (webhook) {
    webhook.status = 'inactive'
  }
}

const testWebhook = (id) => {
  alert('Webhook wird getestet...')
}

const deleteWebhook = (id) => {
  if (confirm('Sind Sie sicher, dass Sie diesen Webhook löschen möchten?')) {
    webhooks.value = webhooks.value.filter(w => w.id !== id)
  }
}
</script>

<style scoped>
.webhooks-page {
  padding: 20px;
}
</style> 
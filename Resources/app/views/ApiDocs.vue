<template>
  <div class="api-docs-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">API-Dokumentation</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="downloadSpec">
          <i class="cil-download"></i> OpenAPI Spec herunterladen
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">API-Endpunkte</h5>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <a 
                v-for="endpoint in endpoints" 
                :key="endpoint.path"
                href="#" 
                class="list-group-item list-group-item-action"
                :class="{ active: selectedEndpoint === endpoint.path }"
                @click="selectEndpoint(endpoint.path)"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge" :class="getMethodClass(endpoint.method)">
                    {{ endpoint.method }}
                  </span>
                  <small>{{ endpoint.path }}</small>
                </div>
                <div class="mt-1">
                  <small>{{ endpoint.description }}</small>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div v-if="selectedEndpoint" class="card">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <span class="badge me-2" :class="getMethodClass(currentEndpoint.method)">
                  {{ currentEndpoint.method }}
                </span>
                {{ currentEndpoint.path }}
              </h5>
              <button class="btn btn-sm btn-outline-primary" @click="testEndpoint">
                <i class="cil-send"></i> Testen
              </button>
            </div>
          </div>
          <div class="card-body">
            <p class="text-muted">{{ currentEndpoint.description }}</p>
            
            <div v-if="currentEndpoint.parameters && currentEndpoint.parameters.length > 0">
              <h6>Parameter</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Typ</th>
                      <th>Erforderlich</th>
                      <th>Beschreibung</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="param in currentEndpoint.parameters" :key="param.name">
                      <td><code>{{ param.name }}</code></td>
                      <td>{{ param.type }}</td>
                      <td>
                        <span v-if="param.required" class="badge bg-danger">Ja</span>
                        <span v-else class="badge bg-secondary">Nein</span>
                      </td>
                      <td>{{ param.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="currentEndpoint.requestBody">
              <h6>Request Body</h6>
              <pre class="bg-light p-3 rounded"><code>{{ currentEndpoint.requestBody }}</code></pre>
            </div>

            <div v-if="currentEndpoint.responses">
              <h6>Antworten</h6>
              <div v-for="(response, code) in currentEndpoint.responses" :key="code" class="mb-3">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge me-2" :class="getResponseClass(code)">{{ code }}</span>
                  <strong>{{ response.description }}</strong>
                </div>
                <pre v-if="response.example" class="bg-light p-3 rounded"><code>{{ response.example }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card">
          <div class="card-body text-center">
            <i class="cil-info" style="font-size: 3rem; color: #6c757d;"></i>
            <h5 class="mt-3">API-Dokumentation</h5>
            <p class="text-muted">Wählen Sie einen Endpunkt aus der linken Liste aus, um die Details anzuzeigen.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Modal -->
    <div class="modal fade" :class="{ show: showTestModal }" :style="{ display: showTestModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">API-Endpunkt testen</h5>
            <button type="button" class="btn-close" @click="closeTestModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">URL</label>
              <input type="text" class="form-control" v-model="testUrl" readonly>
            </div>
            <div v-if="currentEndpoint.parameters && currentEndpoint.parameters.length > 0" class="mb-3">
              <label class="form-label">Parameter</label>
              <div v-for="param in currentEndpoint.parameters" :key="param.name" class="mb-2">
                <label class="form-label">{{ param.name }}</label>
                <input type="text" class="form-control" v-model="testParams[param.name]" :placeholder="param.description">
              </div>
            </div>
            <div v-if="currentEndpoint.requestBody" class="mb-3">
              <label class="form-label">Request Body</label>
              <textarea class="form-control" v-model="testBody" rows="5" placeholder="JSON Request Body"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Headers</label>
              <textarea class="form-control" v-model="testHeaders" rows="3" placeholder="Content-Type: application/json&#10;Authorization: Bearer YOUR_TOKEN"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeTestModal">Abbrechen</button>
            <button type="button" class="btn btn-primary" @click="executeTest">Test ausführen</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showTestModal"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const endpoints = [
  {
    path: '/api/users',
    method: 'GET',
    description: 'Alle Benutzer abrufen'
  },
  {
    path: '/api/users/{id}',
    method: 'GET',
    description: 'Einen bestimmten Benutzer abrufen',
    parameters: [
      { name: 'id', type: 'integer', required: true, description: 'Benutzer-ID' }
    ]
  },
  {
    path: '/api/users',
    method: 'POST',
    description: 'Neuen Benutzer erstellen',
    requestBody: `{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe"
}`,
    responses: {
      '201': {
        description: 'Benutzer erfolgreich erstellt',
        example: `{
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-15T14:30:00Z"
}`
      },
      '400': {
        description: 'Ungültige Eingabedaten'
      }
    }
  },
  {
    path: '/api/users/{id}',
    method: 'PUT',
    description: 'Benutzer aktualisieren',
    parameters: [
      { name: 'id', type: 'integer', required: true, description: 'Benutzer-ID' }
    ],
    requestBody: `{
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "firstName": "John",
  "lastName": "Doe Updated"
}`,
    responses: {
      '200': {
        description: 'Benutzer erfolgreich aktualisiert'
      },
      '404': {
        description: 'Benutzer nicht gefunden'
      }
    }
  },
  {
    path: '/api/users/{id}',
    method: 'DELETE',
    description: 'Benutzer löschen',
    parameters: [
      { name: 'id', type: 'integer', required: true, description: 'Benutzer-ID' }
    ],
    responses: {
      '204': {
        description: 'Benutzer erfolgreich gelöscht'
      },
      '404': {
        description: 'Benutzer nicht gefunden'
      }
    }
  },
  {
    path: '/api/auth/login',
    method: 'POST',
    description: 'Benutzer anmelden',
    requestBody: `{
  "username": "john_doe",
  "password": "secure_password"
}`,
    responses: {
      '200': {
        description: 'Erfolgreiche Anmeldung',
        example: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "john@example.com"
  }
}`
      },
      '401': {
        description: 'Ungültige Anmeldedaten'
      }
    }
  }
]

const selectedEndpoint = ref('')
const showTestModal = ref(false)
const testUrl = ref('')
const testParams = ref({})
const testBody = ref('')
const testHeaders = ref('Content-Type: application/json')

const currentEndpoint = computed(() => {
  return endpoints.find(e => e.path === selectedEndpoint.value) || {}
})

const getMethodClass = (method) => {
  switch (method) {
    case 'GET': return 'bg-success'
    case 'POST': return 'bg-primary'
    case 'PUT': return 'bg-warning'
    case 'DELETE': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const getResponseClass = (code) => {
  if (code.startsWith('2')) return 'bg-success'
  if (code.startsWith('4')) return 'bg-warning'
  if (code.startsWith('5')) return 'bg-danger'
  return 'bg-secondary'
}

const selectEndpoint = (path) => {
  selectedEndpoint.value = path
}

const downloadSpec = () => {
  alert('OpenAPI-Spezifikation wird heruntergeladen...')
}

const testEndpoint = () => {
  testUrl.value = `https://api.example.com${currentEndpoint.value.path}`
  testParams.value = {}
  testBody.value = currentEndpoint.value.requestBody || ''
  testHeaders.value = 'Content-Type: application/json'
  showTestModal.value = true
}

const closeTestModal = () => {
  showTestModal.value = false
}

const executeTest = () => {
  alert('API-Test wird ausgeführt...')
  closeTestModal()
}
</script>

<style scoped>
.api-docs-page {
  padding: 20px;
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}
</style> 
<template>
  <div class="system-status-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Systemstatus</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="refreshStatus">
          <i class="cil-reload"></i> Aktualisieren
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <!-- System Health -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">System-Gesundheit</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="service in systemServices" :key="service.name" class="col-md-6 mb-3">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i :class="getStatusIcon(service.status)" :style="{ fontSize: '1.5rem', color: getStatusColor(service.status) }"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ service.name }}</h6>
                    <small class="text-muted">{{ service.description }}</small>
                    <div class="mt-1">
                      <span :class="getStatusBadgeClass(service.status)">
                        {{ getStatusText(service.status) }}
                      </span>
                      <small class="text-muted ms-2">{{ service.responseTime }}ms</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Performance-Metriken</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>CPU-Auslastung</h6>
                <div class="progress mb-3">
                  <div class="progress-bar" :class="getCpuClass()" :style="{ width: systemMetrics.cpu + '%' }">
                    {{ systemMetrics.cpu }}%
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Arbeitsspeicher</h6>
                <div class="progress mb-3">
                  <div class="progress-bar" :class="getMemoryClass()" :style="{ width: systemMetrics.memory + '%' }">
                    {{ systemMetrics.memory }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <h6>Festplattenspeicher</h6>
                <div class="progress mb-3">
                  <div class="progress-bar" :class="getDiskClass()" :style="{ width: systemMetrics.disk + '%' }">
                    {{ systemMetrics.disk }}%
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Netzwerk-Auslastung</h6>
                <div class="progress mb-3">
                  <div class="progress-bar" :class="getNetworkClass()" :style="{ width: systemMetrics.network + '%' }">
                    {{ systemMetrics.network }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Logs -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Aktuelle Logs</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Zeitstempel</th>
                    <th>Level</th>
                    <th>Nachricht</th>
                    <th>Quelle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in recentLogs" :key="log.id">
                    <td><small>{{ log.timestamp }}</small></td>
                    <td>
                      <span :class="getLogLevelClass(log.level)">
                        {{ log.level }}
                      </span>
                    </td>
                    <td>{{ log.message }}</td>
                    <td><small>{{ log.source }}</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <!-- System Info -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">System-Informationen</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Betriebssystem:</strong>
              <span class="float-end">{{ systemInfo.os }}</span>
            </div>
            <div class="mb-3">
              <strong>PHP-Version:</strong>
              <span class="float-end">{{ systemInfo.phpVersion }}</span>
            </div>
            <div class="mb-3">
              <strong>Symfony-Version:</strong>
              <span class="float-end">{{ systemInfo.symfonyVersion }}</span>
            </div>
            <div class="mb-3">
              <strong>Datenbank:</strong>
              <span class="float-end">{{ systemInfo.database }}</span>
            </div>
            <div class="mb-3">
              <strong>Uptime:</strong>
              <span class="float-end">{{ systemInfo.uptime }}</span>
            </div>
            <div class="mb-3">
              <strong>Letzter Neustart:</strong>
              <span class="float-end">{{ systemInfo.lastRestart }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Schnellaktionen</h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary w-100 mb-2" @click="clearCache">
              <i class="cil-reload"></i> Cache leeren
            </button>
            <button class="btn btn-outline-warning w-100 mb-2" @click="restartServices">
              <i class="cil-power-standby"></i> Services neu starten
            </button>
            <button class="btn btn-outline-info w-100 mb-2" @click="downloadLogs">
              <i class="cil-download"></i> Logs herunterladen
            </button>
            <button class="btn btn-outline-danger w-100" @click="emergencyMode">
              <i class="cil-warning"></i> Notfallmodus
            </button>
          </div>
        </div>

        <!-- Alerts -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Aktive Warnungen</h5>
          </div>
          <div class="card-body">
            <div v-if="activeAlerts.length === 0" class="text-center text-muted">
              <i class="cil-check-circle" style="font-size: 2rem;"></i>
              <p class="mt-2">Keine aktiven Warnungen</p>
            </div>
            <div v-else>
              <div v-for="alert in activeAlerts" :key="alert.id" class="alert alert-warning alert-sm mb-2">
                <strong>{{ alert.title }}</strong>
                <br>
                <small>{{ alert.message }}</small>
                <br>
                <small class="text-muted">{{ alert.timestamp }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const systemServices = ref([
  { name: 'Web Server', description: 'Apache/Nginx', status: 'healthy', responseTime: 45 },
  { name: 'Database', description: 'MySQL/PostgreSQL', status: 'healthy', responseTime: 12 },
  { name: 'Cache', description: 'Redis/Memcached', status: 'warning', responseTime: 89 },
  { name: 'Queue', description: 'Message Queue', status: 'healthy', responseTime: 23 },
  { name: 'File Storage', description: 'Local/Cloud', status: 'healthy', responseTime: 67 },
  { name: 'External API', description: 'Third-party Services', status: 'error', responseTime: 1500 }
])

const systemMetrics = reactive({
  cpu: 45,
  memory: 72,
  disk: 38,
  network: 15
})

const systemInfo = reactive({
  os: 'Ubuntu 22.04 LTS',
  phpVersion: '8.2.0',
  symfonyVersion: '6.4.0',
  database: 'MySQL 8.0',
  uptime: '15 Tage, 8 Stunden',
  lastRestart: '2024-01-01 00:00:00'
})

const recentLogs = ref([
  { id: 1, timestamp: '2024-01-15 14:30:15', level: 'INFO', message: 'User login successful', source: 'AuthService' },
  { id: 2, timestamp: '2024-01-15 14:29:45', level: 'WARNING', message: 'High memory usage detected', source: 'SystemMonitor' },
  { id: 3, timestamp: '2024-01-15 14:29:12', level: 'ERROR', message: 'External API timeout', source: 'ApiService' },
  { id: 4, timestamp: '2024-01-15 14:28:33', level: 'INFO', message: 'Cache cleared successfully', source: 'CacheService' },
  { id: 5, timestamp: '2024-01-15 14:27:58', level: 'INFO', message: 'Database backup completed', source: 'BackupService' }
])

const activeAlerts = ref([
  { id: 1, title: 'Hohe CPU-Auslastung', message: 'CPU-Auslastung über 80% für mehr als 5 Minuten', timestamp: '2024-01-15 14:25:00' },
  { id: 2, title: 'Externe API nicht erreichbar', message: 'Timeout bei API-Aufrufen', timestamp: '2024-01-15 14:20:00' }
])

const getStatusIcon = (status) => {
  switch (status) {
    case 'healthy': return 'cil-check-circle'
    case 'warning': return 'cil-warning'
    case 'error': return 'cil-x-circle'
    default: return 'cil-question-circle'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'healthy': return '#28a745'
    case 'warning': return '#ffc107'
    case 'error': return '#dc3545'
    default: return '#6c757d'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'healthy': return 'badge bg-success'
    case 'warning': return 'badge bg-warning'
    case 'error': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'healthy': return 'Gesund'
    case 'warning': return 'Warnung'
    case 'error': return 'Fehler'
    default: return 'Unbekannt'
  }
}

const getCpuClass = () => {
  if (systemMetrics.cpu > 80) return 'bg-danger'
  if (systemMetrics.cpu > 60) return 'bg-warning'
  return 'bg-success'
}

const getMemoryClass = () => {
  if (systemMetrics.memory > 80) return 'bg-danger'
  if (systemMetrics.memory > 60) return 'bg-warning'
  return 'bg-success'
}

const getDiskClass = () => {
  if (systemMetrics.disk > 80) return 'bg-danger'
  if (systemMetrics.disk > 60) return 'bg-warning'
  return 'bg-success'
}

const getNetworkClass = () => {
  if (systemMetrics.network > 80) return 'bg-danger'
  if (systemMetrics.network > 60) return 'bg-warning'
  return 'bg-success'
}

const getLogLevelClass = (level) => {
  switch (level) {
    case 'ERROR': return 'badge bg-danger'
    case 'WARNING': return 'badge bg-warning'
    case 'INFO': return 'badge bg-info'
    default: return 'badge bg-secondary'
  }
}

const refreshStatus = () => {
  // Simulate refreshing status
  alert('Systemstatus wird aktualisiert...')
}

const clearCache = () => {
  if (confirm('Möchten Sie wirklich den Cache leeren?')) {
    alert('Cache wurde geleert!')
  }
}

const restartServices = () => {
  if (confirm('Möchten Sie wirklich alle Services neu starten?')) {
    alert('Services werden neu gestartet...')
  }
}

const downloadLogs = () => {
  alert('Logs werden heruntergeladen...')
}

const emergencyMode = () => {
  if (confirm('Möchten Sie wirklich den Notfallmodus aktivieren?')) {
    alert('Notfallmodus wurde aktiviert!')
  }
}
</script>

<style scoped>
.system-status-page {
  padding: 20px;
}

.alert-sm {
  padding: 0.5rem;
  font-size: 0.875rem;
}
</style> 
<template>
  <div class="settings-page">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Systemeinstellungen</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-primary" @click="saveSettings">
          <i class="cil-save"></i> Einstellungen speichern
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Allgemeine Einstellungen</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Systemname</label>
              <input type="text" class="form-control" v-model="settings.systemName">
            </div>
            <div class="mb-3">
              <label class="form-label">Systembeschreibung</label>
              <textarea class="form-control" v-model="settings.systemDescription" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Zeitzone</label>
              <select class="form-select" v-model="settings.timezone">
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Sprache</label>
              <select class="form-select" v-model="settings.language">
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">E-Mail-Einstellungen</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">SMTP-Host</label>
              <input type="text" class="form-control" v-model="settings.smtp.host">
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">SMTP-Port</label>
                  <input type="number" class="form-control" v-model="settings.smtp.port">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Verschlüsselung</label>
                  <select class="form-select" v-model="settings.smtp.encryption">
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">Keine</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">E-Mail-Adresse</label>
              <input type="email" class="form-control" v-model="settings.smtp.username">
            </div>
            <div class="mb-3">
              <label class="form-label">Passwort</label>
              <input type="password" class="form-control" v-model="settings.smtp.password">
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Sicherheitseinstellungen</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Session-Timeout (Minuten)</label>
              <input type="number" class="form-control" v-model="settings.security.sessionTimeout">
            </div>
            <div class="mb-3">
              <label class="form-label">Maximale Login-Versuche</label>
              <input type="number" class="form-control" v-model="settings.security.maxLoginAttempts">
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="settings.security.requireTwoFactor">
                <label class="form-check-label">
                  Zwei-Faktor-Authentifizierung erforderlich
                </label>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="settings.security.forcePasswordChange">
                <label class="form-check-label">
                  Passwort-Änderung bei erstem Login erzwingen
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">System-Informationen</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Version:</strong>
              <span class="float-end">{{ systemInfo.version }}</span>
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
              <strong>Speicherplatz:</strong>
              <span class="float-end">{{ systemInfo.diskUsage }}</span>
            </div>
            <div class="mb-3">
              <strong>Arbeitsspeicher:</strong>
              <span class="float-end">{{ systemInfo.memoryUsage }}</span>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Schnellaktionen</h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary w-100 mb-2" @click="clearCache">
              <i class="cil-reload"></i> Cache leeren
            </button>
            <button class="btn btn-outline-warning w-100 mb-2" @click="backupDatabase">
              <i class="cil-save"></i> Datenbank sichern
            </button>
            <button class="btn btn-outline-info w-100 mb-2" @click="checkUpdates">
              <i class="cil-update"></i> Updates prüfen
            </button>
            <button class="btn btn-outline-danger w-100" @click="maintenanceMode">
              <i class="cil-warning"></i> Wartungsmodus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const settings = reactive({
  systemName: 'CompanyOS Backend',
  systemDescription: 'Modulares Backend-System für moderne Webanwendungen',
  timezone: 'Europe/Berlin',
  language: 'de',
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    encryption: 'tls',
    username: '',
    password: ''
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    forcePasswordChange: true
  }
})

const systemInfo = reactive({
  version: '1.0.0',
  phpVersion: '8.2.0',
  symfonyVersion: '6.4.0',
  database: 'MySQL 8.0',
  diskUsage: '2.5 GB / 50 GB',
  memoryUsage: '256 MB / 1 GB'
})

const saveSettings = () => {
  // Simulate saving settings
  alert('Einstellungen wurden gespeichert!')
}

const clearCache = () => {
  if (confirm('Möchten Sie wirklich den Cache leeren?')) {
    alert('Cache wurde geleert!')
  }
}

const backupDatabase = () => {
  alert('Datenbank-Backup wird erstellt...')
}

const checkUpdates = () => {
  alert('Updates werden geprüft...')
}

const maintenanceMode = () => {
  if (confirm('Möchten Sie den Wartungsmodus aktivieren?')) {
    alert('Wartungsmodus wurde aktiviert!')
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
}
</style> 
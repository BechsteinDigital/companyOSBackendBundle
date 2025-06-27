<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="dashboard-actions">
        <button class="btn btn-primary" @click="refreshData">
          <i class="fas fa-sync-alt"></i>
          Aktualisieren
        </button>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Welcome Card -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Willkommen</h3>
        </div>
        <div class="card-body">
          <p>Hallo {{ user?.name || 'Benutzer' }}!</p>
          <p>Willkommen im CompanyOS Backend.</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Schnellstatistiken</h3>
        </div>
        <div class="card-body">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.users || 0 }}</div>
              <div class="stat-label">Benutzer</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.plugins || 0 }}</div>
              <div class="stat-label">Plugins</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.roles || 0 }}</div>
              <div class="stat-label">Rollen</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Aktuelle Aktivitäten</h3>
        </div>
        <div class="card-body">
          <div v-if="recentActivity.length === 0" class="no-activity">
            <p>Keine aktuellen Aktivitäten</p>
          </div>
          <div v-else class="activity-list">
            <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

export default {
  name: 'Dashboard',
  setup() {
    const auth = useAuthStore()
    const loading = ref(false)
    const stats = ref({
      users: 0,
      plugins: 0,
      roles: 0
    })
    const recentActivity = ref([])

    const user = computed(() => auth.user)
    const canAccess = computed(() => auth.canAccess)

    const formatDate = (dateString) => {
      if (!dateString) return 'Gerade eben'
      return new Date(dateString).toLocaleString('de-DE')
    }

    const loadDashboardData = async () => {
      loading.value = true
      try {
        // Load dashboard statistics
        const statsResponse = await axios.get('/api/dashboard/stats')
        stats.value = statsResponse.data

        // Load recent activity
        const activityResponse = await axios.get('/api/dashboard/activity')
        recentActivity.value = activityResponse.data
      } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error)
      } finally {
        loading.value = false
      }
    }

    const refreshData = () => {
      loadDashboardData()
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      user,
      canAccess,
      loading,
      stats,
      recentActivity,
      formatDate,
      refreshData
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
}

.dashboard-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  color: #495057;
  font-size: 18px;
}

.card-body {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #495057;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  color: #6c757d;
}

.no-activity {
  text-align: center;
  color: #6c757d;
  padding: 20px;
}
</style> 
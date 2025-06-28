<template>
  <div class="access-control-debugger">
    <div class="card">
      <div class="card-header">
        <h3>🔐 Access Control Debugger</h3>
        <span class="badge" :class="accessResult.allowed ? 'bg-success' : 'bg-danger'">
          {{ accessResult.allowed ? 'ZUGRIFF GEWÄHRT' : 'ZUGRIFF VERWEIGERT' }}
        </span>
      </div>

      <div class="card-body">
        <!-- Test Input -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label>Permission testen:</label>
            <select v-model="testPermission" class="form-select">
              <option value="document.read">document.read</option>
              <option value="document.write">document.write</option>
              <option value="document.delete">document.delete</option>
              <option value="user.manage">user.manage</option>
            </select>
          </div>
          <div class="col-md-6">
            <label>Resource ID:</label>
            <input v-model="resourceId" class="form-control" placeholder="UUID">
          </div>
        </div>

        <button @click="testAccess" class="btn btn-primary mb-4">
          🧪 Test Access Control
        </button>

        <!-- Layer Results -->
        <div class="access-layers">
          <h4>Access Control Layers:</h4>
          
          <!-- ACL Layer -->
          <div class="layer-card layer-acl">
            <div class="layer-header">
              <h5>Layer 1: ACL</h5>
              <span class="badge bg-info">Object-Level</span>
            </div>
            <div class="layer-content">
              <strong>Zweck:</strong> Direkte Resource-Permissions (Files, Docs)<br>
              <strong>Status:</strong> {{ getLayerStatus('acl') }}<br>
              <strong>Beispiele:</strong> Owner-Rights, Share-Permissions
            </div>
          </div>

          <!-- RBAC Layer -->
          <div class="layer-card layer-rbac">
            <div class="layer-header">
              <h5>Layer 2: RBAC</h5>
              <span class="badge bg-success">Role-Based</span>
            </div>
            <div class="layer-content">
              <strong>Zweck:</strong> Feature-Level über Rollen<br>
              <strong>Status:</strong> {{ getLayerStatus('rbac') }}<br>
              <strong>User Roles:</strong> {{ userRoles.join(', ') }}
            </div>
          </div>

          <!-- ABAC Layer -->
          <div class="layer-card layer-abac">
            <div class="layer-header">
              <h5>Layer 3: ABAC</h5>
              <span class="badge bg-warning">Context-Based</span>
            </div>
            <div class="layer-content">
              <strong>Zweck:</strong> Kontext-sensitive Regeln<br>
              <strong>Status:</strong> {{ getLayerStatus('abac') }}<br>
              <strong>Context:</strong> Zeit: {{ contextChecks.workingHours ? '✅' : '❌' }}, 
              Department: {{ contextChecks.department ? '✅' : '❌' }}
            </div>
          </div>
        </div>

        <!-- Decision -->
        <div class="final-decision mt-4">
          <div class="alert" :class="accessResult.allowed ? 'alert-success' : 'alert-danger'">
            <h4>🎯 Final Decision: {{ accessResult.allowed ? 'GRANTED' : 'DENIED' }}</h4>
            <p><strong>Grund:</strong> {{ accessResult.reason }}</p>
            <p><strong>Entschieden durch:</strong> {{ accessResult.source }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessControlDebugger',
  data() {
    return {
      testPermission: 'document.read',
      resourceId: '',
      accessResult: {
        allowed: false,
        reason: 'Noch nicht getestet',
        source: '',
        layers: {}
      },
      userRoles: ['ROLE_USER', 'ROLE_EMPLOYEE'],
      contextChecks: {
        workingHours: true,
        department: true
      }
    }
  },
  
  methods: {
    async testAccess() {
      // Simulate access check
      this.accessResult = {
        allowed: Math.random() > 0.3,
        reason: 'ACL: Owner permissions',
        source: 'ownership',
        layers: {
          acl: { decision: 'allow' },
          rbac: { decision: 'neutral' },
          abac: { decision: 'neutral' }
        }
      };
    },
    
    getLayerStatus(layer) {
      const layerData = this.accessResult.layers?.[layer];
      if (!layerData) return 'NEUTRAL';
      return layerData.decision?.toUpperCase() || 'NEUTRAL';
    }
  }
}
</script>

<style scoped>
.layer-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 
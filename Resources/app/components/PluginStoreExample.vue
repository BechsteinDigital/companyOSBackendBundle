<template>
  <div class="plugin-store">
    <h2>🏪 Plugin Store (PBAC-protected)</h2>
    
    <div class="plugin-grid">
      <div 
        v-for="plugin in plugins" 
        :key="plugin.id"
        class="plugin-card"
        :class="getPluginCardClass(plugin)"
      >
        <div class="plugin-header">
          <h3>{{ plugin.name }}</h3>
          <div class="plugin-badges">
            <span v-if="plugin.verified" class="badge verified">✅ Verified</span>
            <span v-if="plugin.official" class="badge official">🏢 Official</span>
            <span :class="'badge risk-' + plugin.riskLevel">
              {{ getRiskLabel(plugin.riskLevel) }}
            </span>
          </div>
        </div>
        
        <div class="plugin-info">
          <p>{{ plugin.description }}</p>
          <p><strong>Category:</strong> {{ plugin.category }}</p>
          <p><strong>Downloads:</strong> {{ plugin.downloads.toLocaleString() }}</p>
          <p><strong>Rating:</strong> ⭐ {{ plugin.rating }}/5</p>
          <p><strong>Price:</strong> {{ plugin.price > 0 ? `€${plugin.price}` : 'Free' }}</p>
        </div>
        
        <div class="plugin-permissions">
          <h4>🔐 Required Permissions:</h4>
          <ul>
            <li v-for="permission in plugin.permissions" :key="permission">
              {{ getPermissionLabel(permission) }}
            </li>
          </ul>
        </div>
        
        <div class="plugin-compliance" v-if="plugin.compliance">
          <h4>📋 Compliance:</h4>
          <span v-if="plugin.compliance.gdpr" class="compliance-badge">GDPR</span>
          <span v-if="plugin.compliance.sox" class="compliance-badge">SOX</span>
          <span v-if="plugin.compliance.pci_dss" class="compliance-badge">PCI-DSS</span>
        </div>
        
        <!-- PBAC Decision Display -->
        <div class="pbac-decision">
          <div v-if="getPluginDecision(plugin).loading" class="loading">
            🔄 Checking permissions...
          </div>
          
          <div v-else-if="getPluginDecision(plugin).allowed" class="decision-allow">
            ✅ <strong>Installation allowed</strong>
            <div v-if="getPluginDecision(plugin).warnings.length" class="warnings">
              <h5>⚠️ Warnings:</h5>
              <ul>
                <li v-for="warning in getPluginDecision(plugin).warnings" :key="warning">
                  {{ warning }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-else-if="getPluginDecision(plugin).approval_required" class="decision-approval">
            ⏳ <strong>Approval required</strong>
            <p>Approval Level: {{ getPluginDecision(plugin).approval_level }}/3</p>
            <div class="requirements">
              <h5>📋 Requirements:</h5>
              <ul>
                <li v-for="req in getPluginDecision(plugin).requirements" :key="req">
                  {{ req }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-else class="decision-deny">
            ❌ <strong>Installation blocked</strong>
            <div class="reasons">
              <h5>🚫 Reasons:</h5>
              <ul>
                <li v-for="reason in getPluginDecision(plugin).reason" :key="reason">
                  {{ reason }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="plugin-actions">
          <button 
            v-if="getPluginDecision(plugin).allowed"
            @click="installPlugin(plugin)"
            class="btn-install"
          >
            📦 Install Plugin
          </button>
          
          <button 
            v-else-if="getPluginDecision(plugin).approval_required"
            @click="requestApproval(plugin)"
            class="btn-approval"
          >
            📝 Request Approval
          </button>
          
          <button 
            v-else
            disabled
            class="btn-blocked"
          >
            🚫 Blocked by Policy
          </button>
          
          <button @click="showDetails(plugin)" class="btn-details">
            ℹ️ Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const plugins = ref([])
const pluginDecisions = reactive({})

// Mock Plugin Data
const mockPlugins = [
  {
    id: 'analytics-pro',
    name: 'Analytics Pro',
    description: 'Advanced website analytics and reporting',
    category: 'analytics',
    verified: true,
    official: true,
    riskLevel: 2,
    downloads: 15000,
    rating: 4.8,
    price: 0,
    permissions: ['database', 'network'],
    compliance: { gdpr: true, sox: true }
  },
  {
    id: 'payment-gateway',
    name: 'Stripe Payment Gateway',
    description: 'Secure payment processing with Stripe',
    category: 'payment',
    verified: true,
    official: false,
    riskLevel: 4,
    downloads: 8500,
    rating: 4.6,
    price: 29.99,
    permissions: ['database', 'network', 'admin'],
    compliance: { gdpr: true, pci_dss: true }
  },
  {
    id: 'file-manager',
    name: 'Advanced File Manager',
    description: 'Complete file system management',
    category: 'utility',
    verified: false,
    official: false,
    riskLevel: 5,
    downloads: 250,
    rating: 3.2,
    price: 0,
    permissions: ['filesystem', 'admin'],
    compliance: {}
  }
]

// PBAC Checks
const checkPluginPermissions = async (plugin) => {
  try {
    pluginDecisions[plugin.id] = { loading: true }
    
    const response = await fetch('/api/plugins/pbac-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        plugin_id: plugin.id,
        store_url: 'https://plugins.companyos.io',
        plugin_data: plugin
      })
    })
    
    if (!response.ok) throw new Error('PBAC check failed')
    
    const decision = await response.json()
    pluginDecisions[plugin.id] = decision
    
  } catch (error) {
    console.error('PBAC check failed:', error)
    pluginDecisions[plugin.id] = {
      allowed: false,
      decision: 'deny',
      reason: ['Permission check failed'],
      warnings: [],
      requirements: []
    }
  }
}

// Getters
const getPluginDecision = (plugin) => {
  return pluginDecisions[plugin.id] || { loading: true }
}

const getPluginCardClass = (plugin) => {
  const decision = getPluginDecision(plugin)
  if (decision.loading) return 'loading'
  if (decision.allowed) return 'allowed'
  if (decision.approval_required) return 'approval-required'
  return 'blocked'
}

const getRiskLabel = (level) => {
  const labels = {
    1: '🟢 Low Risk',
    2: '🟡 Low Risk', 
    3: '🟠 Medium Risk',
    4: '🔴 High Risk',
    5: '⚫ Critical Risk'
  }
  return labels[level] || 'Unknown'
}

const getPermissionLabel = (permission) => {
  const labels = {
    'database': '🗄️ Database Access',
    'filesystem': '📁 File System Access',
    'network': '🌐 Network Access',
    'admin': '🔧 Admin Privileges'
  }
  return labels[permission] || permission
}

// Actions
const installPlugin = async (plugin) => {
  console.log('Installing plugin:', plugin.name)
  // Installation logic
}

const requestApproval = async (plugin) => {
  console.log('Requesting approval for:', plugin.name)
  // Approval workflow logic
}

const showDetails = (plugin) => {
  console.log('Showing details for:', plugin.name)
  // Plugin details modal
}

// Lifecycle
onMounted(async () => {
  plugins.value = mockPlugins
  
  // Check permissions for all plugins
  for (const plugin of plugins.value) {
    await checkPluginPermissions(plugin)
  }
})
</script>

<style scoped>
.plugin-store {
  padding: 1rem;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;
}

.plugin-card {
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  transition: all 0.3s ease;
}

.plugin-card.allowed { border-color: #28a745; background: #f8fff9; }
.plugin-card.approval-required { border-color: #ffc107; background: #fffdf5; }
.plugin-card.blocked { border-color: #dc3545; background: #fff5f5; }
.plugin-card.loading { border-color: #6c757d; background: #f8f9fa; }

.plugin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.plugin-header h3 {
  margin: 0;
  color: #333;
}

.plugin-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
}

.badge.verified { background: #d4edda; color: #155724; }
.badge.official { background: #cce5ff; color: #004085; }
.badge.risk-1, .badge.risk-2 { background: #d4edda; color: #155724; }
.badge.risk-3 { background: #fff3cd; color: #856404; }
.badge.risk-4, .badge.risk-5 { background: #f8d7da; color: #721c24; }

.plugin-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.plugin-permissions, .plugin-compliance {
  margin: 1rem 0;
}

.plugin-permissions h4, .plugin-compliance h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
}

.plugin-permissions ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.8rem;
}

.compliance-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem 0.25rem 0 0;
  background: #e7f3ff;
  color: #0056b3;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.pbac-decision {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.decision-allow { background: #d4edda; color: #155724; }
.decision-approval { background: #fff3cd; color: #856404; }
.decision-deny { background: #f8d7da; color: #721c24; }
.loading { background: #e2e3e5; color: #495057; }

.warnings h5, .requirements h5, .reasons h5 {
  margin: 0.5rem 0 0.25rem 0;
  font-size: 0.8rem;
}

.warnings ul, .requirements ul, .reasons ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.8rem;
}

.plugin-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.plugin-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  flex: 1;
}

.btn-install { background: #28a745; color: white; }
.btn-approval { background: #ffc107; color: #212529; }
.btn-blocked { background: #6c757d; color: white; cursor: not-allowed; }
.btn-details { background: #007bff; color: white; }

.plugin-actions button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style> 
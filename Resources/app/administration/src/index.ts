import { createApp } from 'vue'
import './styles/index.scss'

console.log('Vue.js Script wird geladen...')

// Sehr einfache Debug-Komponente ohne Router/Pinia
const SimpleApp = {
  template: `
    <div style="padding: 20px; background: #f0f0f0; border: 2px solid #007bff;">
      <h1 style="color: #007bff;">✅ Vue.js funktioniert!</h1>
      <p>Timestamp: {{ timestamp }}</p>
      <button @click="increment" style="padding: 10px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 4px;">
        Klicks: {{ count }}
      </button>
    </div>
  `,
  data() {
    return {
      count: 0,
      timestamp: new Date().toLocaleString()
    }
  },
  methods: {
    increment() {
      this.count++
      console.log('Button geklickt:', this.count)
    }
  },
  mounted() {
    console.log('Vue.js Komponente erfolgreich gemountet!')
  }
}

// Element prüfen
const element = document.getElementById('companyos-admin')
console.log('Mount-Element gefunden:', element)

if (element) {
  console.log('Element HTML vor Mount:', element.innerHTML)
  
  // Vue App erstellen und mounten
  const app = createApp(SimpleApp)
  
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue.js Fehler:', err, info)
  }
  
  try {
    app.mount('#companyos-admin')
    console.log('Vue.js App erfolgreich gemountet!')
  } catch (error) {
    console.error('Fehler beim Mounten:', error)
  }
} else {
  console.error('Element #companyos-admin nicht gefunden!')
}

// Global für Debugging
window.CompanyOS = {
  app: SimpleApp
} 
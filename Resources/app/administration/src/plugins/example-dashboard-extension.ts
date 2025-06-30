import type { CompanyOSPlugin } from '../core/companyos'
import TemplateRenderer from '../core/template-renderer'

const ExampleDashboardExtension: CompanyOSPlugin = {
  name: 'example-dashboard-extension',
  version: '1.0.0',
  install: (companyOS) => {
    const templateRenderer = TemplateRenderer.getInstance()
    
    // Dashboard Header erweitern
    templateRenderer.extendTemplate('co-dashboard-index', [
      {
        name: 'dashboard_header',
        content: `
          <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center">
              <i class="icon icon-info text-blue-600 dark:text-blue-400 mr-2"></i>
              <span class="text-blue-800 dark:text-blue-200 text-sm">
                🔧 Plugin "Example Dashboard Extension" ist aktiv
              </span>
            </div>
          </div>
        `,
        priority: 10 // Höhere Priorität = wird zuerst gerendert
      }
    ])

    // Dashboard Stats erweitern
    templateRenderer.extendTemplate('co-dashboard-index', [
      {
        name: 'dashboard_stats',
        content: `
          <div class="mb-6">
            <div class="co-card">
              <div class="co-card-header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Plugin-Statistiken
                </h3>
              </div>
              <div class="co-card-body">
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">5</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Aktive Plugins</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">12</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Plugin-Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        priority: 5
      }
    ])

    // Dashboard Extensions Block erweitern
    templateRenderer.extendTemplate('co-dashboard-index', [
      {
        name: 'dashboard_extensions',
        content: `
          <div class="mt-8">
            <div class="co-card">
              <div class="co-card-header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Beispiel-Plugin Erweiterung
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Diese Inhalte wurden durch ein Plugin hinzugefügt
                </p>
              </div>
              <div class="co-card-body">
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-gray-100">Benutzerdefinierte Funktion</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Beschreibung der Plugin-Funktion</p>
                    </div>
                    <button class="btn btn-sm btn-primary">
                      Ausführen
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-gray-100">Erweiterte Einstellungen</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Zusätzliche Konfigurationsoptionen</p>
                    </div>
                    <button class="btn btn-sm btn-outline">
                      Konfigurieren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        priority: 1
      }
    ])

    console.log('Example Dashboard Extension Plugin installed successfully')
  }
}

export default ExampleDashboardExtension 
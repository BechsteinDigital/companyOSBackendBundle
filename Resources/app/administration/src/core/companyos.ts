import type { App } from 'vue'

export interface CompanyOSModule {
  name: string
  routes?: any[]
  components?: Record<string, any>
  services?: Record<string, any>
  init?: () => void
}

export interface CompanyOSPlugin {
  name: string
  version: string
  install: (companyOS: CompanyOS) => void
}

class CompanyOS {
  private modules: Map<string, CompanyOSModule> = new Map()
  private plugins: Map<string, CompanyOSPlugin> = new Map()
  private app: App | null = null

  constructor() {
    this.init()
  }

  private init(): void {
    // Initialize core services
    this.registerCoreServices()
  }

  private registerCoreServices(): void {
    // Core services will be registered here
  }

  public registerModule(module: CompanyOSModule): void {
    if (this.modules.has(module.name)) {
      console.warn(`Module ${module.name} is already registered`)
      return
    }

    this.modules.set(module.name, module)
    
    if (module.init) {
      module.init()
    }

    console.log(`Module ${module.name} registered successfully`)
  }

  public registerPlugin(plugin: CompanyOSPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`)
      return
    }

    this.plugins.set(plugin.name, plugin)
    plugin.install(this)

    console.log(`Plugin ${plugin.name} v${plugin.version} registered successfully`)
  }

  public getModule(name: string): CompanyOSModule | undefined {
    return this.modules.get(name)
  }

  public getPlugin(name: string): CompanyOSPlugin | undefined {
    return this.plugins.get(name)
  }

  public getAllModules(): CompanyOSModule[] {
    return Array.from(this.modules.values())
  }

  public getAllPlugins(): CompanyOSPlugin[] {
    return Array.from(this.plugins.values())
  }

  public setApp(app: App): void {
    this.app = app
  }

  public getApp(): App | null {
    return this.app
  }

  // Template extension system
  public extendTemplate(templateName: string, extension: string): void {
    // Template extension logic will be implemented here
    console.log(`Template ${templateName} extended with: ${extension}`)
  }

  // Component extension system
  public extendComponent(componentName: string, extension: any): void {
    if (!this.app) {
      console.error('Vue app not initialized')
      return
    }

    // Component extension logic
    this.app.component(componentName, extension)
  }

  // Service extension system
  public extendService(serviceName: string, service: any): void {
    // Service extension logic will be implemented here
    console.log(`Service ${serviceName} extended`)
  }
}

export default CompanyOS 
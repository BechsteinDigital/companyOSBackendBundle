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

export interface TemplateBlock {
  name: string
  content: string
  priority?: number
}

export interface TemplateExtension {
  templateName: string
  blocks: TemplateBlock[]
}

class CompanyOS {
  private modules: Map<string, CompanyOSModule> = new Map()
  private plugins: Map<string, CompanyOSPlugin> = new Map()
  private templateExtensions: Map<string, TemplateBlock[]> = new Map()
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

  // Template extension system with blocks
  public extendTemplate(templateName: string, extension: TemplateExtension): void {
    if (!this.templateExtensions.has(templateName)) {
      this.templateExtensions.set(templateName, [])
    }

    const blocks = this.templateExtensions.get(templateName)!
    blocks.push(...extension.blocks)
    
    // Sort blocks by priority (higher priority first)
    blocks.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    console.log(`Template ${templateName} extended with ${extension.blocks.length} blocks`)
  }

  public getTemplateBlocks(templateName: string, blockName: string): TemplateBlock[] {
    const extensions = this.templateExtensions.get(templateName) || []
    return extensions.filter(block => block.name === blockName)
  }

  public renderTemplateBlock(templateName: string, blockName: string): string {
    const blocks = this.getTemplateBlocks(templateName, blockName)
    return blocks.map(block => block.content).join('\n')
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

  // Block rendering helper for templates
  public renderBlock(blockName: string): string {
    // This will be called from templates to render blocks
    return `<!-- BLOCK:${blockName} -->`
  }
}

export default CompanyOS 
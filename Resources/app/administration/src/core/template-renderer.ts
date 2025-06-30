export interface TemplateBlock {
  name: string
  content: string
  priority?: number
}

export class TemplateRenderer {
  private static instance: TemplateRenderer
  private templateExtensions: Map<string, TemplateBlock[]> = new Map()

  private constructor() {}

  public static getInstance(): TemplateRenderer {
    if (!TemplateRenderer.instance) {
      TemplateRenderer.instance = new TemplateRenderer()
    }
    return TemplateRenderer.instance
  }

  public extendTemplate(templateName: string, blocks: TemplateBlock[]): void {
    if (!this.templateExtensions.has(templateName)) {
      this.templateExtensions.set(templateName, [])
    }

    const existingBlocks = this.templateExtensions.get(templateName)!
    existingBlocks.push(...blocks)
    
    // Sort blocks by priority (higher priority first)
    existingBlocks.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  public getTemplateBlocks(templateName: string, blockName: string): TemplateBlock[] {
    const extensions = this.templateExtensions.get(templateName) || []
    return extensions.filter(block => block.name === blockName)
  }

  public renderBlock(templateName: string, blockName: string): string {
    const blocks = this.getTemplateBlocks(templateName, blockName)
    return blocks.map(block => block.content).join('\n')
  }

  public renderTemplate(template: string, templateName: string): string {
    // Replace block placeholders with actual content
    return template.replace(/\{\{\s*BLOCK:(\w+)\s*\}\}/g, (match, blockName) => {
      return this.renderBlock(templateName, blockName)
    })
  }
}

export default TemplateRenderer 
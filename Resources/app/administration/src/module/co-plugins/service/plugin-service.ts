export default class PluginService {
    private apiClient: any

    constructor(apiClient: any) {
        this.apiClient = apiClient
    }

    async getPlugins() {
        try {
            const response = await this.apiClient.get('/api/plugins')
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Plugins:', error)
            return []
        }s
    }

    async installPlugin(pluginId: string) {
        try {
            const response = await this.apiClient.post(`/api/plugins/${pluginId}/install`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Installieren des Plugins:', error)
            throw error
        }
    }

    async uninstallPlugin(pluginId: string) {
        try {
            const response = await this.apiClient.delete(`/api/plugins/${pluginId}`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Deinstallieren des Plugins:', error)
            throw error
        }
    }

    async activatePlugin(pluginId: string) {
        try {
            const response = await this.apiClient.post(`/api/plugins/${pluginId}/activate`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Aktivieren des Plugins:', error)
            throw error
        }
    }

    async deactivatePlugin(pluginId: string) {
        try {
            const response = await this.apiClient.post(`/api/plugins/${pluginId}/deactivate`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Deaktivieren des Plugins:', error)
            throw error
        }
    }

    async updatePlugin(pluginId: string) {
        try {
            const response = await this.apiClient.post(`/api/plugins/${pluginId}/update`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Updaten des Plugins:', error)
            throw error
        }
    }

    async getPluginConfig(pluginId: string) {
        try {
            const response = await this.apiClient.get(`/api/plugins/${pluginId}/config`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Plugin-Konfiguration:', error)
            return {}
        }
    }

    async savePluginConfig(pluginId: string, config: any) {
        try {
            const response = await this.apiClient.post(`/api/plugins/${pluginId}/config`, config)
            return response.data
        } catch (error) {
            console.error('Fehler beim Speichern der Plugin-Konfiguration:', error)
            throw error
        }
    }
} 
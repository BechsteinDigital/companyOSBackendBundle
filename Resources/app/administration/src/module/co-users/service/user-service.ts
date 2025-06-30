export default class UserService {
    private apiClient: any

    constructor(apiClient: any) {
        this.apiClient = apiClient
    }

    async getUsers(params: any = {}) {
        try {
            const response = await this.apiClient.get('/api/users', { params })
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Benutzer:', error)
            return []
        }
    }

    async getUser(id: string) {
        try {
            const response = await this.apiClient.get(`/api/users/${id}`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden des Benutzers:', error)
            throw error
        }
    }

    async createUser(userData: any) {
        try {
            const response = await this.apiClient.post('/api/users', userData)
            return response.data
        } catch (error) {
            console.error('Fehler beim Erstellen des Benutzers:', error)
            throw error
        }
    }

    async updateUser(id: string, userData: any) {
        try {
            const response = await this.apiClient.put(`/api/users/${id}`, userData)
            return response.data
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Benutzers:', error)
            throw error
        }
    }

    async deleteUser(id: string) {
        try {
            const response = await this.apiClient.delete(`/api/users/${id}`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Löschen des Benutzers:', error)
            throw error
        }
    }

    async activateUser(id: string) {
        try {
            const response = await this.apiClient.post(`/api/users/${id}/activate`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Aktivieren des Benutzers:', error)
            throw error
        }
    }

    async deactivateUser(id: string) {
        try {
            const response = await this.apiClient.post(`/api/users/${id}/deactivate`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Deaktivieren des Benutzers:', error)
            throw error
        }
    }

    async bulkActivateUsers(userIds: string[]) {
        try {
            const response = await this.apiClient.post('/api/users/bulk/activate', { userIds })
            return response.data
        } catch (error) {
            console.error('Fehler bei der Bulk-Aktivierung:', error)
            throw error
        }
    }

    async bulkDeactivateUsers(userIds: string[]) {
        try {
            const response = await this.apiClient.post('/api/users/bulk/deactivate', { userIds })
            return response.data
        } catch (error) {
            console.error('Fehler bei der Bulk-Deaktivierung:', error)
            throw error
        }
    }

    async bulkDeleteUsers(userIds: string[]) {
        try {
            const response = await this.apiClient.post('/api/users/bulk/delete', { userIds })
            return response.data
        } catch (error) {
            console.error('Fehler bei der Bulk-Löschung:', error)
            throw error
        }
    }

    async searchUsers(query: string) {
        try {
            const response = await this.apiClient.get('/api/users/search', { 
                params: { q: query } 
            })
            return response.data
        } catch (error) {
            console.error('Fehler bei der Benutzer-Suche:', error)
            return []
        }
    }

    async getUserRoles() {
        try {
            const response = await this.apiClient.get('/api/users/roles')
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Benutzer-Rollen:', error)
            return []
        }
    }

    async getUserStats() {
        try {
            const response = await this.apiClient.get('/api/users/stats')
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Benutzer-Statistiken:', error)
            return {}
        }
    }
} 
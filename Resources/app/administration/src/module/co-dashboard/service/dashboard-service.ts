export default class DashboardService {
    private apiClient: any

    constructor(apiClient: any) {
        this.apiClient = apiClient
    }

    async getStats() {
        try {
            const response = await this.apiClient.get('/api/dashboard/stats')
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Dashboard-Statistiken:', error)
            return {
                totalUsers: 0,
                totalApps: 0,
                totalOrders: 0,
                revenue: '0 €'
            }
        }
    }

    async getChartData(period: number = 30) {
        try {
            const response = await this.apiClient.get(`/api/dashboard/chart?period=${period}`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Chart-Daten:', error)
            return []
        }
    }

    async getRecentActivities(limit: number = 10) {
        try {
            const response = await this.apiClient.get(`/api/dashboard/activities?limit=${limit}`)
            return response.data
        } catch (error) {
            console.error('Fehler beim Laden der Aktivitäten:', error)
            return []
        }
    }
} 
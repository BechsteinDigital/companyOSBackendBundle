import template from './co-dashboard-stats.hba'
import './co-dashboard-stats.scss'

export default {
    template,
    name: 'co-dashboard-stats',
    props: {
        stats: {
            type: Object,
            required: true,
            default: () => ({
                totalUsers: 0,
                totalApps: 0,
                totalOrders: 0,
                revenue: '0 €'
            })
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async refreshStats() {
            this.loading = true
            try {
                // Hier würde der API-Call stehen
                await this.$nextTick()
            } catch (error) {
                console.error('Fehler beim Laden der Statistiken:', error)
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        this.refreshStats()
    }
} 
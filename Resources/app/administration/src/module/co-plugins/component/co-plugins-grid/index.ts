import template from './co-plugins-grid.hba'
import './co-plugins-grid.scss'

export default {
    template,
    name: 'co-plugins-grid',
    props: {
        plugins: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async refreshPlugins() {
            this.loading = true
            try {
                // Hier würde der API-Call stehen
                await this.$nextTick()
            } catch (error) {
                console.error('Fehler beim Laden der Plugins:', error)
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        this.refreshPlugins()
    }
} 
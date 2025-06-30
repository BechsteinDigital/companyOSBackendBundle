import template from './co-dashboard-chart.hba'
import './co-dashboard-chart.scss'

export default {
    template,
    name: 'co-dashboard-chart',
    data() {
        return {
            selectedPeriod: '30',
            chart: null
        }
    },
    methods: {
        updateChart() {
            // Hier würde die Chart-Logik stehen
            console.log('Chart updated for period:', this.selectedPeriod)
        }
    },
    mounted() {
        this.updateChart()
    }
} 
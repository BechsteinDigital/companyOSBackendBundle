import type { CompanyOSModule } from '../../core/companyos'

const DashboardModule: CompanyOSModule = {
  name: 'co-dashboard',
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./page/co-dashboard-index.ts')
    }
  ],
  components: {
    'co-dashboard-stats': () => import('./component/co-dashboard-stats/index'),
    'co-dashboard-chart': () => import('./component/co-dashboard-chart/index'),
    'co-dashboard-recent-activity': () => import('./component/co-dashboard-recent-activity/index')
  },
  services: {
    'dashboardService': () => import('./service/dashboard-service')
  },
  init() {
    console.log('Dashboard module initialized')
  }
}

export default DashboardModule 
import type { CompanyOSModule } from '../../core/companyos'

const DashboardModule: CompanyOSModule = {
  name: 'co-dashboard',
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./page/co-dashboard-index')
    }
  ],
  components: {
    'co-dashboard-stats': () => import('./component/co-dashboard-stats'),
    'co-dashboard-chart': () => import('./component/co-dashboard-chart'),
    'co-dashboard-recent-activity': () => import('./component/co-dashboard-recent-activity')
  },
  services: {
    'dashboardService': () => import('./service/dashboard-service')
  },
  init() {
    console.log('Dashboard module initialized')
  }
}

export default DashboardModule 
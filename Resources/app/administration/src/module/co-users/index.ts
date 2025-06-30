import type { CompanyOSModule } from '../../core/companyos'

const UsersModule: CompanyOSModule = {
  name: 'co-users',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: () => import('./page/co-users-list')
    }
  ],
  components: {
    'co-users-table': () => import('./component/co-users-table'),
    'co-user-form': () => import('./component/co-user-form')
  },
  services: {
    'userService': () => import('./service/user-service')
  },
  init() {
    console.log('Users module initialized')
  }
}

export default UsersModule 
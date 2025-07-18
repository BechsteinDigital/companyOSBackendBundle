import type { CompanyOSModule } from '../../core/companyos'

const UsersModule: CompanyOSModule = {
  name: 'co-users',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: () => import('./page/co-users-list.ts')
    }
  ],
  components: {
    'co-users-table': () => import('./component/co-users-table/index'),
    'co-user-form': () => import('./component/co-user-form/index')
  },
  services: {
    'userService': () => import('./service/user-service')
  },
  init() {
    console.log('Users module initialized')
  }
}

export default UsersModule 
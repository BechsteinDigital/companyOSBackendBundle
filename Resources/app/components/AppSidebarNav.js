import { h, resolveComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { CNavGroup, CNavItem, CNavTitle, CSidebarNav } from '@coreui/vue'

import nav from '../_nav.js'

function item(component, props, ...children) {
  return h(resolveComponent(component), props, () => children)
}

function link(component, props, ...children) {
  return h(resolveComponent(component), props, () => children)
}

export function AppSidebarNav() {
  const navItems = (items) =>
    items.map((item, index) => {
      const { component, name, badge, icon, ...rest } = item
      const Wrapper = component === 'CNavItem' ? CNavItem : CNavGroup

      if (component === 'CNavTitle') {
        return item(CNavTitle, {
          key: `nav-title-${index}`,
          ...rest,
        })
      }

      if (component === 'CNavGroup') {
        return item(
          Wrapper,
          {
            key: `nav-group-${index}`,
            toggler: name,
            visible: item.visible,
            ...rest,
          },
          item.items && navItems(item.items),
        )
      }

      return item(
        Wrapper,
        {
          key: `nav-item-${index}`,
          ...rest,
        },
        link(RouterLink, { to: item.to }, () => [
          icon && h(resolveComponent('CIcon'), { customClassName: 'nav-icon', icon }),
          name && h('span', { innerHTML: name }),
          badge &&
            h(
              resolveComponent('CBadge'),
              {
                color: badge.color,
                class: 'ms-auto',
              },
              {
                default: () => badge.text,
              },
            ),
        ]),
      )
    })

  return h(CSidebarNav, { id: 'sidebar-nav' }, () => navItems(nav))
} 
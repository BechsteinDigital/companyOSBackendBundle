import { defineComponent, h } from 'vue'
import './co-page.scss'

export default defineComponent({
  name: 'CoPage',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    showBackButton: {
      type: Boolean,
      default: false
    },
    backRoute: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    return () => h('div', {
      class: 'co-page'
    }, [
      // Header
      h('div', {
        class: 'co-page__header'
      }, [
        props.showBackButton && h('button', {
          class: 'co-page__back-button',
          onClick: () => {
            if (props.backRoute) {
              // Router navigation logic
            }
          }
        }, '← Zurück'),
        h('div', {
          class: 'co-page__title-section'
        }, [
          props.title && h('h1', {
            class: 'co-page__title'
          }, props.title),
          props.subtitle && h('p', {
            class: 'co-page__subtitle'
          }, props.subtitle)
        ])
      ]),
      // Content
      h('div', {
        class: 'co-page__content'
      }, slots.default?.())
    ])
  }
}) 
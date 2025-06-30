import { defineComponent, h } from 'vue'
import './co-card.scss'

export default defineComponent({
  name: 'CoCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    padding: {
      type: String,
      default: '1.5rem'
    },
    shadow: {
      type: String,
      default: 'default' // none, sm, default, lg
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots }) {
    const getCardClasses = () => {
      const classes = ['co-card']
      
      if (props.shadow !== 'none') {
        classes.push(`co-card--shadow-${props.shadow}`)
      }
      
      if (props.border) {
        classes.push('co-card--bordered')
      }
      
      return classes.join(' ')
    }

    return () => h('div', {
      class: getCardClasses(),
      style: {
        padding: props.padding
      }
    }, [
      // Header
      (props.title || props.subtitle) && h('div', {
        class: 'co-card__header'
      }, [
        props.title && h('h3', {
          class: 'co-card__title'
        }, props.title),
        props.subtitle && h('p', {
          class: 'co-card__subtitle'
        }, props.subtitle)
      ]),
      // Content
      h('div', {
        class: 'co-card__content'
      }, slots.default?.()),
      // Footer
      slots.footer && h('div', {
        class: 'co-card__footer'
      }, slots.footer())
    ])
  }
}) 
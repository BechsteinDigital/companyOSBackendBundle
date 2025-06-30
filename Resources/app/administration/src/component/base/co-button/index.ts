import { defineComponent, h } from 'vue'
import './co-button.scss'

export default defineComponent({
  name: 'CoButton',
  props: {
    variant: {
      type: String,
      default: 'primary' // primary, secondary, success, danger, warning, info
    },
    size: {
      type: String,
      default: 'md' // sm, md, lg
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const getButtonClasses = () => {
      const classes = ['co-button']
      classes.push(`co-button--${props.variant}`)
      classes.push(`co-button--${props.size}`)
      
      if (props.disabled) {
        classes.push('co-button--disabled')
      }
      
      if (props.loading) {
        classes.push('co-button--loading')
      }
      
      return classes.join(' ')
    }

    const handleClick = (event: Event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }

    return () => h('button', {
      class: getButtonClasses(),
      type: props.type,
      disabled: props.disabled || props.loading,
      onClick: handleClick
    }, [
      props.loading && h('span', {
        class: 'co-button__spinner'
      }),
      slots.default?.()
    ])
  }
}) 
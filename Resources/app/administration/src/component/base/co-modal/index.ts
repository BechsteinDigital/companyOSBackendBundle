import { defineComponent, h, ref, watch } from 'vue'
import './co-modal.scss'

export default defineComponent({
  name: 'CoModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md' // sm, md, lg, xl
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    const isVisible = ref(props.modelValue)

    watch(() => props.modelValue, (newValue) => {
      isVisible.value = newValue
    })

    const closeModal = () => {
      isVisible.value = false
      emit('update:modelValue', false)
      emit('close')
    }

    const handleBackdropClick = (event: Event) => {
      if (props.closeOnBackdrop && event.target === event.currentTarget) {
        closeModal()
      }
    }

    return () => isVisible.value ? h('div', {
      class: 'co-modal-overlay',
      onClick: handleBackdropClick
    }, [
      h('div', {
        class: `co-modal co-modal--${props.size}`
      }, [
        // Header
        h('div', {
          class: 'co-modal__header'
        }, [
          props.title && h('h3', {
            class: 'co-modal__title'
          }, props.title),
          h('button', {
            class: 'co-modal__close',
            onClick: closeModal
          }, '×')
        ]),
        // Content
        h('div', {
          class: 'co-modal__content'
        }, slots.default?.()),
        // Footer
        slots.footer && h('div', {
          class: 'co-modal__footer'
        }, slots.footer())
      ])
    ]) : null
  }
}) 
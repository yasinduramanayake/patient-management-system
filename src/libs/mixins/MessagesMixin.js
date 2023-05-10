import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  methods: {
    showSuccessMessage(text) {
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          title: 'Success',
          icon: 'CheckIcon',
          variant: 'success',
          text,
        },
      })
    },
    convertAndNotifyError(err) {
      if (!(err.response && err.response.data)) return
      let errors
      let errorOut = '<ul>'
      if (err.response.data.errors) {
        errors = err.response.data.errors
        Object.keys(errors).forEach(error => {
          const element = errors[error]
          errorOut += `<li>${element[0]}</li>`
        })
      }
      errorOut += '</ul>'
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          title: err.response.data.message,
          icon: 'AlertTriangleIcon',
          variant: 'danger',
          text: errorOut,
        },
      })
    },
    notify(variant = null, body = '', title = '') {
      this.$notify(variant, title, body, {
        duration: 6000,
        permanent: false,
      })
    },
    showErrorMessage(text) {
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          title: 'Error',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
          text,
        },
      })
    },
  },
}

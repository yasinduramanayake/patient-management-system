import moment from 'moment'

export default {
  data() {
    return {
      filterQuery: '',
    }
  },
  timer: null,
  methods: {
    filterHander(value) {
      clearTimeout(this.timer)
      this.filterQuery = ''
      const queries = []
      Object.keys(value).forEach(filter => {
        if (this.filters[filter] && this.filters[filter] !== '') {
          if (this.filters[filter] instanceof Date) {
            queries.push(`filter[${filter}]=${encodeURIComponent(moment(this.filters[filter]).format('YYYY-MM-DD'))}`)
          } else if (typeof this.filters[filter] === 'object') {
            if (this.filters[filter].value)queries.push(`filter[${filter}]=${encodeURIComponent(this.filters[filter].value)}`)
          } else {
            queries.push(`filter[${filter}]=${encodeURIComponent(this.filters[filter])}`)
          }
        }
      })
      if (queries.length > 0) this.filterQuery = queries.join('&')
      const that = this
      this.timer = setTimeout(() => {
        that.filterQueryUpdate()
      }, 500)
    },
  },
  watch: {
    filters: {
      handler(value) {
        this.filterHander(value)
      },
      deep: true,
      immediate: true,
    },
  },
}

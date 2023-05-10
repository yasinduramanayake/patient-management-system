import moment from 'moment'
export default {
  methods: {
    momentFormat (value, arg) {
      return moment(value).format(arg)
    },
    momentTimestampFormat (value, arg) {
      return moment(new Date(value)).format(arg)
    }
  },
  filters: {
    momentFormat (value, arg) {
      return moment(value).format(arg)
    },
    momentTimestampFormat (value, arg) {
      return moment(new Date(value)).format(arg)
    }
  }
}

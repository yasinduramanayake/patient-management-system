import Vue from 'vue'

// Vue validation
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'

// Add a rule.
extend('required', {
  ...required,
})
extend('min', {
  ...min,
  message: 'This field must have no less than {length} characters',
})
extend('birthday', {
  ...required,
  message: 'This birthday is invalid',
})
extend('tel', {
  validate: value => value.match(/^[0-9]*$/u),
  message: 'Telephone Number must not contain any letter or special character',
})
extend('email', email)
extend('no_whitespace', {
  validate: value => value.match(/^\S*$/u),
  message: 'Password must not contain whitespace',
})
extend('min_tel', {
  validate: value => value.length > 6,
  message: 'Contact number must contain at least 7 numbers.',
})
extend('max_tel', {
  validate: value => value.length < 17,
  message: 'Contact number allowed only 16 numbers ',
})
extend('contactNumber', {
  validate: value => value.match(/^[+]{0,1}[0-9]*$/g),
  message: 'Enter a valid contact number ',
})
extend('one_uppercase', {
  validate: value => value.match(/[a-z]/),
  message: 'Password must contain at least one Lowercase character',
})
extend('one_lowercase', {
  validate: value => value.match(/[A-Z]/),
  message: 'Password must contain at least one Uppercase character',
})
extend('selected', {
  ...required,
  message: 'Select at least one clinic.',
})
extend('one_number', {
  validate: value => value.match(/[0-9]/),
  message: 'Password must contain at least one numeral',
})
extend('one_special', {
  validate: value => value.match(/[$&+,:;=?@#|'<>.^*()%!-]/),
  message: 'Password must contain at least one special character',
})
extend('same_password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Password confirmation should be matched',
})

// Register it globally
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

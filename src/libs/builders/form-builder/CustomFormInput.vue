<template>
  <b-form-input
    v-if="formInput.type === 'input' || formInput.type === 'number'"
    v-model="data"
    :disabled="loading"
    :size="formInput.size||'md'"
    :class="formInput.inputClass || 'w-full'"
    :type="formInput.inputType || formInput.type"
    :placeholder="formInput.placeholder"
    :icon="formInput.icon"
    :state="errors.length > 0 ? false:null"
  />
  <b-form-textarea
    v-else-if="formInput.type === 'textarea'"
    v-model="data"
    :disabled="loading"
    :size="formInput.size||'md'"
    :class="formInput.inputClass || 'w-full mb-0'"
    :placeholder="formInput.placeholder"
    :state="errors.length > 0 ? false:null"
  />
  <b-form-select
    v-else-if="formInput.type === 'select'"
    v-model="data"
    :disabled="loading"
    :size="formInput.size||'md'"
    :class="formInput.inputClass || 'w-full'"
    :placeholder="formInput.placeholder"
    :clearable="formInput.clearable || false"
    :state="errors.length > 0 ? false:null"
  >
    <!-- :options="formInput.options" -->
    <b-form-select-option
      v-for="option in formInput.options"
      :key="option.label"
      :name="option.label"
      :value="option.value"
    >
      {{ option.label }}
    </b-form-select-option>
  </b-form-select>
  <b-form-checkbox
    v-else-if="formInput.type === 'checkbox' || formInput.type === 'switch'"
    v-model="data"
    :size="formInput.size||'md'"
    :switch="formInput.type === 'switch'"
    :disabled="loading"
    :state="errors.length > 0 ? false:null"
  />
  <b-form-radio-group
    v-else-if="formInput.type === 'radio'"
    v-model="data"
    :size="formInput.size||'md'"
    :options="formInput.options"
    :class="formInput.inputClass"
    :name="formInput.value"
    :state="errors.length > 0 ? false:null"
  />
  <v-select
    v-else-if="formInput.type === 'v-select'"
    v-model="data"
    :options="formInput.options"
    :size="formInput.size||'md'"
    :class="formInput.inputClass"
    :placeholder="formInput.placeholder"
    :disabled="loading"
    :state="errors.length > 0 ? false:null"
  />
  <cleave
    v-else-if="formInput.type === 'marked-input'"
    v-model="data"
    :size="formInput.size||'md'"
    :class="formInput.inputClass || 'form-controll'"
    :raw="formInput.raw"
    :options="option"
    :placeholder="formInput.placeholder"
    :state="errors.length > 0 ? false:null"
  />
  <b-form-datepicker
    v-else-if="formInput.type === 'date'"
    v-model="data"
    :size="formInput.size||'md'"
    :min="formInput.min"
    :max="formInput.max"
    :date-disabled-fn="formInput.dateDisabled"
    :class="formInput.inputClass"
    :disabled="loading"
    :right="formInput.right"
    :button-only="formInput.btn_only"
    :today-button="formInput.today_btn"
    :reset-button="formInput.reset_btn"
    :close-button="formInput.close_btn"
    :placeholder="formInput.placeholder"
    :state="errors.length > 0 ? false:null"
  />
</template>

<script>

import {
  BFormInput,
  BFormTextarea,
  BFormSelect,
  BFormCheckbox,
  BFormRadioGroup,
  BFormDatepicker,
  BFormSelectOption,
} from 'bootstrap-vue'

export default {
  components: {
    // flatPickr,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BFormCheckbox,
    BFormRadioGroup,
    BFormDatepicker,
    BFormSelectOption,
  },
  props: {
    value: undefined,
    formInput: {
      type: Object,
      default: () => [],
    },
    errors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      data: this.value,
    }
  },
  watch: {
    value(value) {
      this.data = value
    },
    data(value) {
      this.$emit('input', value)
    },
  },
  async mounted() {
    if (this.formInput.fetch) {
      this.loading = true
      try {
        this.formInput.options = (await this.formInput.fetch()).data.success
        if (this.formInput.fetchFilter) this.formInput.options = this.formInput.options.map(item => this.formInput.fetchFilter(item))
      } catch (error) {
        this.convertAndNotifyError(error)
      }
      this.loading = false
    }
    if (this.formInput.default) {
      this.formInput.options.unshift(this.formInput.default)
      this.data = this.formInput.default.value
    }
  },
}
</script>

<style>
.vs__dropdown-toggle {
  height: 37px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

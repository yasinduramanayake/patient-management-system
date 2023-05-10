<template>
  <vs-input
    v-if="formInput.type === 'input' || formInput.type === 'number'"
    :disabled="loading"
    :class="formInput.inputClass || 'w-full'"
    :type="formInput.inputType || formInput.type"
    :placeholder="formInput.placeholder"
    :icon="formInput.icon"
    icon-pack="feather"
    icon-no-border
    v-model="data"
  />

  <vs-textarea
    v-else-if="formInput.type === 'textarea'"
    :disabled="loading"
    :class="formInput.inputClass || 'w-full mb-0'"
    :placeholder="formInput.placeholder"
    v-model="data"
  />
  <v-select
    v-else-if="formInput.type === 'select'"
    :disabled="loading"
    :class="formInput.inputClass || 'w-full'"
    :placeholder="formInput.placeholder"
    :options="formInput.options"
    :clearable="formInput.clearable || false"
    v-model="data"
  />
  <vs-switch v-else-if="formInput.type === 'switch'" :class="formInput.inputClass || 'w-full'" v-model="data" />
  <ul v-else-if="formInput.type === 'radio'" :class="formInput.inputClass || 'w-full'">
    <li v-for="option in formInput.options" :key="option">
      <vs-radio :vs-name="option.label" :vs-value="option.value" v-model="data" />
    </li>
  </ul>
  <vs-checkbox
    v-else-if="formInput.type === 'checkbox'"
    :disabled="loading"
    v-model="data"
  />
  <vs-divider v-else-if="formInput.type === 'divider'" />

  <flat-pickr
    v-else-if="formInput.type === 'date'"
    :placeholder="formInput.placeholder"
    :class="formInput.inputClass || 'w-full'"
    :disabled="loading"
    v-model="data"
  />
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  props: {
    value: undefined,
    formInput: Object
  },
  async mounted () {
    if (this.fetch) {
      this.loading = true
      try {
        this.options = (await this.fetch()).data.success
        if (this.default) this.options.unshift(this.default)
      } catch (error) {
        this.convertAndNotifyError(error)
      }
      this.loading = false
    }
  },
  data () {
    return {
      loading: false,
      data: this.value
    }
  },
  watch: {
    data (value) {
      this.$emit('input', value)
    }
  },
  components: {
    flatPickr
  }
}
</script>

<style>
.vs__dropdown-toggle {
  height: 37px;
}
</style>

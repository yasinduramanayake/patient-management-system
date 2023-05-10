<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form
      @submit.prevent="handleSubmit(onSubmit(value))"
      :class="gridClass || 'grid grid-cols-3'"
    >
      <div
        :key="index"
        v-for="(formInput, index) in formStructure"
        :class="formInput.class || 'w-full'"
      >
        <slot :name="formInput.title" v-bind:value="value[formInput.value]">
          <ValidationProvider
            :vid="formInput.title"
            :name="formInput.title"
            :rules="formInput.validation || ''"
            v-slot="{ errors }"
          >
            <label
              :class="formInput.titleClass || 'text-sm opacity-100 text-bold'"
              >{{ formInput.title }}</label
            >
            <custom-form-input :formInput="formInput"
              :value="value[formInput.value]"
              @input="setValue(formInput.value,$event)"
            />
              <!-- v-model="value[formInput.value]" -->
            <span
              :class="
                formInput.errorClass || 'text-sm text-bold text-theme_danger'
              "
              >{{ errors[0] }}</span
            >
          </ValidationProvider>
        </slot>
      </div>
      <slot name="buttons">

      </slot>
    </form>
  </ValidationObserver>
</template>

<script>
import CustomFormInput from '@/layouts/components/form-builder/CustomFormInput'

export default {
  props: {
    gridClass: String,
    formStructure: Array,
    value: undefined,
    onSubmit: Function
  },
  components: { CustomFormInput },
  created () {
    this.formStructure.filter(x => x.default).forEach(x => { this.value[x.value] = x.default })
  },
  methods: {
    reset () {
      this.value = {}
      this.formStructure.filter(x => x.default).forEach(x => { this.value[x.value] = x.default })
    },
    setValue (path, data) {
      // this.value[path] = data
      this.$set(this.value, path, data)
      this.$emit('input', this.value)
    }
  },
  watch:{
    value (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>

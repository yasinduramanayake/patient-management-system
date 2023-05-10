<template>
  <ValidationObserver
    ref="form"
    v-slot="{ handleSubmit }"
  >
    <form
      :class="gridClass"
      @submit.prevent="handleSubmit(onSubmit(value))"
    >
      <div
        v-for="(formInput, index) in formStructure"
        :key="index"
        :class="formInput.class || 'col'"
      >
        <slot
          :name="formInput.title"
          :value="value[formInput.value]"
        >
          <ValidationProvider
            #default="{ errors }"
            :vid="formInput.title"
            :name="formInput.title"
            :rules="formInput.validation || ''"
          >
            <!-- <b-form-group
              id="fieldset-1"
              description="Let us know your name."
              label="Enter your name"
              label-for="input-1"
              valid-feedback="Thank you!"
              invalid-feedback="dsadsaasd"
              :state="false"
            >
              <b-form-input
                id="input-1"
                v-model="name"
                :state="false"
                trim
              />
            </b-form-group> -->
            <b-form-group
              :description="formInput.description"
              :label="formInput.title"
              :label-for="formInput.value"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false:null"
            >
              <custom-form-input
                :form-input="formInput"
                :value="value[formInput.value]"
                :errors="errors"
                @input="setValue(formInput.value,$event)"
              />
            </b-form-group>
          </ValidationProvider>
        </slot>
      </div>
      <slot name="buttons" />
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { BFormGroup } from 'bootstrap-vue'
import CustomFormInput from './CustomFormInput.vue'

export default {
  components: {
    ValidationProvider, ValidationObserver, BFormGroup, CustomFormInput,
  },
  props: {
    gridClass: {
      type: String,
      default: () => 'row',
    },
    formStructure: {
      type: Array,
      default: () => [],
    },
    value: undefined,
    onSubmit: {
      type: Function,
      default: () => null,
    },
  },
  watch: {
    value(value) {
      this.$emit('input', value)
    },
  },
  created() {
    this.formStructure.filter(x => x.default).forEach(x => { this.value[x.value] = x.default })
  },
  methods: {
    clearValidation() {
      this.$refs.form.reset()
    },
    reset() {
      this.value = {}
      this.formStructure.filter(x => x.default).forEach(x => { this.value[x.value] = x.default })
    },
    setValue(path, data) {
      this.$set(this.value, path, data)
      this.$emit('input', this.value)
    },
  },
}
</script>

<style>
</style>

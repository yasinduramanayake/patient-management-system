<template>
  <div>
    <portal to="appbar_button">
      <b-button
        v-b-toggle.sidebar-right
        type="filled"
        variant="success"
      >
        <feather-icon
          icon="PlusIcon"
          class="mr-50"
        />
        Add Patient
      </b-button>
    </portal>

    <b-sidebar
      id="sidebar-right"
      v-model="sidebarOpen"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @hidden="formData={};mode='add';$refs.formbuilder.clearValidation()"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5
            v-if="mode==='add'"
            class="mb-0"
          >
            Create a patient
          </h5>
          <h5
            v-else-if="mode==='edit'"
            class="mb-0"
          >
            Edit a patient
          </h5>
          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>
        <form-builder
          v-model="formData"
          :on-submit="onSubmit"
          grid-class="px-1"
          :form-structure="formStructure"
        >
          <template slot="buttons">
            <b-button
              v-if="mode==='add'"
              type="submit"
              variant="warning"
            >
              Create
            </b-button>
            <b-button
              v-if="mode==='edit'"
              type="submit"
              variant="warning"
            >
              Update
            </b-button>
          </template>
        </form-builder>
      </template>
    </b-sidebar>

    <table-builder
      ref="table"
      card-title="Patient List"
      :table-headers="headers"
      :data-fetch="fetch"
      :filter-inputs="filters"
    >
      <template
        slot="action"
        slot-scope="row"
      >
        <b-button
          v-b-toggle.sidebar-right
          class="mr-1"
          type="filled"
          variant="warning"
          @click="readyForEdit(row.row)"
        >
          Edit
        </b-button>
        <b-button
          type="filled"
          variant="danger"
          @click="readyForRemove(row.row)"
        >
          Remove
        </b-button>
      </template>
    </table-builder>
  </div>
</template>

<script>
import FormBuilder from '@/libs/builders/form-builder/FormBuilder.vue'
import TableBuilder from '@/libs/builders/table-builder/TableBuilder.vue'
import Patients from '@/apis/modules/patients'

import { BButton, BSidebar, VBToggle } from 'bootstrap-vue'

export default {
  components: {
    TableBuilder, BButton, BSidebar, FormBuilder,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      active: false,
      sidebarOpen: false,
      mode: 'add',
      formStructure: [
        {
          type: 'input',
          placeholder: 'Patient name here',
          inputType: 'text',
          title: 'Patient name',
          value: 'name',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'input',
          placeholder: 'Patient NIC here',
          inputType: 'text',
          title: 'NIC',
          value: 'nic',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'date',
          placeholder: 'Patient date of birthday here',
          inputType: 'date',
          title: 'Date of birth',
          value: 'date_of_birth',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'v-select',
          placeholder: 'Select a gender',
          inputType: 'select',
          title: 'Gender',
          options: [
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' },
          ],
          value: 'gender',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'number',
          placeholder: 'Patient mobile number',
          inputType: 'number',
          title: 'Mobile number',
          value: 'mobile_number',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'textarea',
          inputType: 'text',
          title: 'Patient address',
          value: 'address',
          class: 'mt-1',
          validation: 'required',
        },
      ],
      formData: {},
      filters: [
        {
          type: 'input',
          inputType: 'search',
          title: 'Patient Name',
          placeholder: 'Search...',
          value: 'name',
        },
        {
          type: 'input',
          inputType: 'search',
          title: 'Date of Birth',
          placeholder: 'Search...',
          value: 'date_of_birth',
        },
        {
          type: 'select',
          title: 'Gender',
          placeholder: 'Search...',
          value: 'sex',
          default: { label: 'Any', value: undefined },
          options: [
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' },
          ],
        },
      ],
      headers: [
        {
          label: 'Patient Name',
          field: 'name',
        },
        {
          label: 'Date of Birth',
          field: 'date_of_birth',
        },
        {
          label: 'Gender',
          field: 'sex',
          formatter: data => (data === 'm' ? 'Male' : 'Female'),
        },
        {
          label: 'Action',
          field: 'action',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    fetch: Patients.index,
    async onSubmit(values) {
      const submitedData = values
      submitedData.data = JSON.stringify({ address: values.address })
      submitedData.sex = values.gender.value
      const submitData = this.lodash.pick(submitedData, [
        'name', 'sex', 'data', 'mobile_number', 'nic', 'date_of_birth',
      ])
      try {
        if (this.mode === 'add') {
          await Patients.create(submitData)
          this.showSuccessMessage('Patient Created')
        } else if (this.mode === 'edit') {
          await Patients.update(submitedData.id, submitData)
          this.showSuccessMessage('Patient Updated')
        }
        this.sidebarOpen = false
        this.$refs.table.refresh()
      } catch (e) {
        this.convertAndNotifyError(e)
      }
    },
    async readyForEdit(row) {
      this.mode = 'edit'
      const editableData = JSON.parse(JSON.stringify(row))
      editableData.address = editableData.data.address
      editableData.gender = this.formStructure.find(x => x.value === 'gender').options.find(x => x.value === editableData.sex)
      this.formData = editableData
    },
    async readyForRemove(row) {
      const result = await this.$swal({
        title: 'Are you sure?',
        text: `Are you sure you want to remove ${row.name.split(' ')[0]}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
      if (result.isConfirmed) {
        try {
          await Patients.delete(row.id)
          this.showSuccessMessage('Patient Removed')
          this.$refs.table.refresh()
        } catch (error) {
          this.convertAndNotifyError(error)
        }
      }
    },
  },
}
</script>

<style>
</style>

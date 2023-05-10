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
        Add Item
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
            Create an item
          </h5>
          <h5
            v-else-if="mode==='edit'"
            class="mb-0"
          >
            Edit an item
          </h5>
          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>
        <form-builder
          ref="formbuilder"
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
import Units from '@/apis/modules/units'
import Items from '@/apis/modules/items'

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
          placeholder: 'Item name here',
          inputType: 'text',
          title: 'Item name',
          value: 'name',
          class: 'mt-1',
          validation: 'required',
        },
        {
          type: 'select',
          placeholder: 'Unit Type',
          title: 'Unit type',
          value: 'unit_id',
          class: 'mt-1',
          fetch: Units.indexWithoutPagination,
          fetchFilter: item => ({ label: item.name, value: item.id }),
          validation: 'required',
        },
        {
          type: 'switch',
          title: 'Eligible to post',
          value: 'is_possible',
          class: 'mt-1',
        },
      ],
      formData: {},
      filters: [
        {
          type: 'input',
          inputType: 'search',
          title: 'Item name',
          placeholder: 'Search...',
          value: 'name',
        },
        {
          type: 'select',
          inputType: 'search',
          title: 'Unit',
          placeholder: 'Search...',
          value: 'unit.name',
        },
      ],
      headers: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Unit',
          field: 'unit.name',
        },
        {
          label: 'Eligible to post',
          field: 'is_possible',
          formatter: data => (data === 1 ? 'Yes' : 'No'),
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
    fetch: Items.index,
    async onSubmit(values) {
      const submitedData = values
      const submitData = this.lodash.pick(submitedData, [
        'name', 'unit_id', 'is_possible',
      ])
      try {
        if (this.mode === 'add') {
          await Items.create(submitData)
          this.showSuccessMessage('Item Created')
        } else if (this.mode === 'edit') {
          await Items.update(submitedData.id, submitData)
          this.showSuccessMessage('Item Updated')
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
      editableData.is_possible = editableData.is_possible === 1
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
          await Items.delete(row.id)
          this.showSuccessMessage('Item Removed')
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

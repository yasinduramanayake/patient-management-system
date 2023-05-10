<template>
  <div>
    <b-card-actions
      ref="filterCard"
      title="Filter"
      class="mb-1"
      collapsed
      action-collapse
    >
      <form-builder
        v-model="filters"
        :form-structure="filterInputs"
        @input="filterHander(filters)"
      />
    </b-card-actions>
    <b-card-actions
      ref="tableCard"
      :title="cardTitle"
      action-refresh
      @refresh="refresh"
    >
      <vue-good-table
        ref="table"
        mode="remote"
        :columns="tableHeaders"
        :rows="tableData"
        :pagination-options="{
          enabled: true,
        }"
        @on-sort-change="onSortChange"
      >
        <template
          slot="table-row"
          slot-scope="props"
        >
          <slot
            :name="props.column.field"
            :row="props.row"
            :data="props.column"
          >
            <div v-if="props.column.formatter">
              {{ props.column.formatter(lodash.get(props.row, props.column.field), props.row) }}
            </div>
            <div v-else-if="props.column.value">
              {{ lodash.get(props.row, props.column.field, "N/A") }}
            </div>
          </slot>
        </template>
        <template
          slot="pagination-bottom"
        >
          <div class="d-flex justify-content-between flex-wrap">
            <!-- page length -->
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap ">
                Showing 1 to
              </span>
              <b-form-select
                v-model="tablePagination.per_page"
                :options="perPages"
                class="mx-1"
              />
              <span class="text-nowrap"> of {{ tablePagination.total }} entries </span>
            </div>
            <!-- pagination -->
            <div>
              <b-pagination
                :value="tablePagination.current_page"
                :total-rows="tablePagination.total"
                :per-page="tablePagination.per_page"
                first-number
                last-number
                align="right"
                prev-class="prev-item"
                next-class="next-item"
                class="mt-1 mb-0"
                @change="tablePagination.current_page = $event"
              >
                <template #prev-text>
                  <feather-icon
                    icon="ChevronLeftIcon"
                    size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                    icon="ChevronRightIcon"
                    size="18"
                  />
                </template>
              </b-pagination>
            </div>
          </div>
        </template>
      </vue-good-table>
    </b-card-actions>
  </div>
</template>

<script>
import FormBuilder from '@/libs/builders/form-builder/FormBuilder.vue'
import FilterMixin from '@/libs/mixins/FilterMixin'

import { VueGoodTable } from 'vue-good-table'

import { BCardActions } from '@/@core/components/b-card-actions'

import {
  BPagination, BFormSelect,
} from 'bootstrap-vue'

export default {
  components: {
    BCardActions, VueGoodTable, BPagination, BFormSelect, FormBuilder,
  },
  mixins: [FilterMixin],
  props: {
    cardTitle: {
      type: String,
      default: () => 'Card Title',
    },
    tableHeaders: {
      type: Array,
      default: () => [],
    },
    filterInputs: {
      type: Array,
      default: () => [],
    },
    dataFetch: {
      type: Function,
      default: () => null,
    },
    perPages: {
      type: Array,
      default: () => ['10', '50', '100'],
    },
  },
  data() {
    return {
      tablePagination: {
        per_page: 10,
        total_pages: 1,
        current_page: 1,
      },
      tableData: [],
      filter: {},
      filters: {},
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'tablePagination.current_page': async function (currentPage) {
      this.filter.current_page = `page=${currentPage}`
      await this.fetchData()
    },
    // eslint-disable-next-line func-names
    'tablePagination.per_page': async function (perPage) {
      this.filter.per_page = `per_page=${perPage}`
      this.filter.current_page = 1
      await this.fetchData()
    },
  },
  async mounted() {
    await this.fetchData()
    this.$refs.filterCard.isContentCollapsed = true
    this.$refs.filterCard.maxHeight = '1.5rem'
  },
  methods: {
    async trigger() {
      // console.log('sadasd')
    },
    async onSortChange(data) {
      this.filter.sort = `sort=${data.map(x => (x.type === 'asc' ? encodeURIComponent(x.field) : `-${encodeURIComponent(x.field)}`)).join(',')}`
      await this.fetchData()
    },
    async filterQueryUpdate() {
      this.filter.filters = this.filterQuery
      if (this.tablePagination.current_page === 1) {
        await this.fetchData()
      } else {
        this.tablePagination.current_page = 1
      }
    },
    async refresh() {
      this.filter = {}
      this.$refs.table.$refs['table-header-primary'].sorts = []
      await this.fetchData()
    },
    async fetchData() {
      this.$refs.tableCard.showLoading = true
      try {
        const request = (
          await this.dataFetch(Object.values(this.filter).join('&'))
        ).data.success
        this.tableData = request.data
        this.tablePagination = request.pagination
      } catch (error) {
        // console.log(error)
        this.convertAndNotifyError(error)
      }
      this.$refs.tableCard.showLoading = false
    },
  },
}
</script>

<style lang="scss" >
  @import '@core/scss/vue/libs/vue-good-table.scss';
</style>

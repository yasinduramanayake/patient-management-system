<template>
  <div>
    <vx-card
      v-if="filterInputs"
      ref="filterCard"
      title="Filter"
      class="mb-5"
      collapseAction
    >
      <form-builder :formStructure="filterInputs" v-model="filters" @input="filterHander(filters)" />
    </vx-card>
    <vx-card :title="cardTitle">
      <vs-table
        stripe
        :max-items="tablePagination.per_page"
        :data="tableData"
        id="table"
        class="table-dark-inverted table-auto vs-con-loading__container ch-tbl"
      >
        <template slot="thead">
          <vs-th
            :key="th.title"
            v-for="th in tableHeaders"
            :class="th.headerClass"
            >{{ th.title }}</vs-th
          >
        </template>

        <template slot-scope="{ data }">
          <vs-tr :key="tr.id" v-for="tr in data" class="cursor-pointer">
            <vs-td
              :key="th.title"
              v-for="th in tableHeaders"
              :class="th.bodyClass"
            >
              <slot :name="th.title" v-bind:row="tr" v-bind:data="tr[th.value]">
                <div v-if="th.formatter">
                  {{ th.formatter(lodash.get(tr, th.value), tr) }}
                </div>
                <div v-else-if="th.value">
                  {{ lodash.get(tr, th.value, "N/A") }}
                </div>
              </slot>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <vs-pagination
        class="pt-5"
        :total="tablePagination.total_pages"
        :max="5"
        v-model="tablePagination.current_page"
      ></vs-pagination>
    </vx-card>
  </div>
</template>

<script>
import FormBuilder from '@/layouts/components/form-builder/FormBuilder'
import FilterMixin from '@/mixins/FilterMixin'

export default {
  props: {
    cardTitle: String,
    tableHeaders: Array,
    filterInputs: Array,
    dataFetch: Function
  },
  mixins: [FilterMixin],
  components: { FormBuilder },
  data () {
    return {
      tablePagination: {
        per_page: 10,
        total_pages: 1,
        current_page: 1
      },
      tableData: [],
      filter: {},
      filters: {}
    }
  },
  async mounted () {
    await this.fetchData()
    this.$refs.filterCard.isContentCollapsed = true
    this.$refs.filterCard.maxHeight = '1.5rem'
  },
  methods: {
    async trigger () {
      // console.log('sadasd')
    },
    async filterQueryUpdate () {
      this.filter.filters = this.filterQuery
      if (this.tablePagination.current_page === 1) {
        await this.fetchData()
      } else {
        this.tablePagination.current_page = 1
      }
    },
    async fetchData () {
      this.$vs.loading({
        container: '#table',
        scale: 1
      })
      try {
        const request = (
          await this.dataFetch(this.lodash.values(this.filter).join('&'))
        ).data.success
        this.tableData = request.data
        this.tablePagination = request.pagination
      } catch (error) {
        this.convertAndNotifyError(error)
      }
      this.$vs.loading.close('#table > .con-vs-loading')
    }
  },
  watch: {
    async 'tablePagination.current_page' (current_page) {
      this.filter.current_page = `page=${current_page}`
      await this.fetchData()
    }
  }
}
</script>

<style>
</style>

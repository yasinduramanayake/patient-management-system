export default [
  {
    path: '/items',
    name: 'items',
    component: () => import('@/views/items/index.vue'),
    meta: {
      pageTitle: 'Items',
      breadcrumb: [
        {
          text: 'Items',
          active: true,
        },
      ],
    },
  },
]

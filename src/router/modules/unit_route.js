export default [
  {
    path: '/units',
    name: 'units',
    component: () => import('@/views/units/index.vue'),
    meta: {
      pageTitle: 'Units',
      breadcrumb: [
        {
          text: 'Units',
          active: true,
        },
      ],
    },
  },
]

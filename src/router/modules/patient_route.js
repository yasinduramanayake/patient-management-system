export default [
  {
    path: '/patients',
    name: 'patients',
    component: () => import('@/views/patient/index.vue'),
    meta: {
      pageTitle: 'Patients',
      breadcrumb: [
        {
          text: 'Patients',
          active: true,
        },
      ],
    },
  },
]

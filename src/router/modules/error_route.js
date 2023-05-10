export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/error404.vue'),
    meta: {
      layout: 'full',
      noAuth: true,
    },
  },
  {
    path: '*',
    redirect: 'error-404',
    meta: {
      noAuth: true,
    },
  },
]

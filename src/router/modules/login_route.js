export default [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      layout: 'full',
      redirectIfLoggedIn: true,
      noAuth: true,
    },
  },
]

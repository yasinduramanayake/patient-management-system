export default {
  init(router, store) {
    router.beforeEach(async (to, _, next) => {
      await store.dispatch('autoLogin')

      //   if (!canNavigate(to)) {
      //     if (!isLoggedIn) return next({ name: 'auth-login' })
      //     return next({ name: 'misc-not-authorized' })
      //   }

      const { isLogedIn } = store.getters

      if (to.meta.redirectIfLoggedIn && isLogedIn) {
        next({
          path: '/dashboard',
          replace: true,
        })
      }

      if (!to.meta.noAuth && !isLogedIn) {
        next({
          path: '/',
          replace: true,
        })
      }

      return next()
    })
  },
}

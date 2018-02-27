import {store} from '../store'

export const authMixin = {
  computed: {
    isAuthenticatedUser:
      function () {
        return Boolean(store.getters.user)
      },
    isAdmin: function () {
      return store.getters.isAdmin
    },
    isAnonymousUser: function () {
      return store.getters.user.isAnonymous
    }
  }
}

import {store} from '../store'

export const authMixin = {
  computed: {
    isAuthenticatedUser:
      function () {
        return store.getters.user !== null && store.getters.user !== undefined
      },
    isAdmin: function () {
      return this.$store.getters.isAdmin
    }
  }
}

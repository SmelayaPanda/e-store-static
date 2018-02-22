import {store} from '../store'

export const authMixin = {
  computed: {
    isAuthenticatedUser:
      function () {
        return Boolean(store.getters.user)
      },
    isAdmin: function () {
      return this.$store.getters.isAdmin
    }
  }
}

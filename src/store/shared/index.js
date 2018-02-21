export default {
  // State ---------------------------------------------------
  state: {
    loading: true,
    error: null
  },
  // Mutations ---------------------------------------------------
  mutations: { // to change state
    setLoading:
      (state, payload) => {
        state.loading = payload
      },
    setError:
      (state, payload) => {
        state.error = payload
      },
    clearError:
      (state) => {
        state.error = null
      }
  },
  // Actions ---------------------------------------------------
  actions: { // specify the mutation
    clearError:
      ({commit}) => {
        commit('clearError')
      },
    setError:
      ({commit}, payload) => {
        commit('setError', payload)
      },
    setLoading:
      ({commit}, payload) => {
        commit('setLoading', payload)
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    loading:
      state => {
        return state.loading
      },
    error:
      state => {
        return state.error
      }
  }
}

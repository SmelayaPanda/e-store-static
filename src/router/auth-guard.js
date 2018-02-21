import {store} from '../store'
// for block creation new meetup and profile settings
export default (to, from, next) => {
  if (store.getters.user) {
    next()
  } else {
    next('/signin')
  }
}

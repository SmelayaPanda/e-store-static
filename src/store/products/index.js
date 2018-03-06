import * as firebase from 'firebase'
import 'firebase/firestore'

export default {
  state: {
    products: [],
    lastVisibleId: '',
    isAllLoaded: false
  },
  mutations: {
    setProducts:
      (state, payload) => {
        state.products = payload
      },
    setLastVisible:
      (state, payload) => {
        state.lastVisibleId = payload
      },
    isAllLoaded: // to avoid infinitive load more
      (state, payload) => {
        state.isAllLoaded = payload
      }
  },
  actions: {
    fetchProducts:
      ({commit, getters}, payload) => {
        let query = firebase.firestore().collection('products')
        if (payload.maxPrice) {
          query = query
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        }
        if (payload.size) {
          query = query.where('size', '==', payload.size)
        }
        if (payload.category) {
          query = query.where('category', '==', payload.category)
        }
        if (payload.color) {
          query = query.where('color', '==', payload.color)
        }
        query = query.orderBy('price', payload.sortAsc ? 'asc' : 'desc')
        if (getters.lastVisibleId) {
          query = query.startAfter(getters.lastVisibleId)
        }

        query
          .limit(9)
          .get()
          .then((snapshot) => {
            let products = payload.loadMore ? getters.products : []
            if (!getters.isAllLoaded) {
              if (snapshot.size < 9) {
                commit('isAllLoaded', true)
              }
              snapshot.forEach(doc => {
                products.push(doc.data())
              })
              let lastVisible = snapshot.docs[snapshot.docs.length - 1]
              commit('setLastVisible', lastVisible)
            }
            commit('setProducts', products)
          })
          .catch(err => {
            console.log(err)
          })
      },
    resetLastVisible:
      ({commit}) => {
        commit('isAllLoaded', false)
        commit('setLastVisible', null)
      },
    addNewProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let productId
        let image = payload.image
        delete payload.image
        firebase.firestore().collection('products').add(payload)
          .then(data => {
            productId = data.id
            return firebase.storage().ref('products/' + productId + '/main').put(image)
          }) // images Urls will be automatically uploaded - see cloud function!
          .then(() => {
            let updateData = {
              productId: productId,
              images: {
                main: {
                  original: '', thumbnail: '', card: ''
                }
              }
            }
            return firebase.firestore().collection('products').doc(productId).update(updateData)
          })
          .then(() => {
            commit('LOADING', false)
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    editProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.firestore().collection('products').doc(payload.productId).update(payload)
          .then(() => {
            console.log('success')
            let products = getters.products
            products[payload.productId] = payload
            commit('setProducts', products)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    editProductImage:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let newImageUrl
        firebase.storage().ref('products/' + payload.productId + '/main').put(payload.image)
          .then(
            fileData => {
              newImageUrl = fileData.metadata.downloadURLs[0]
              console.log('New Image uploaded to storage.')
              return firebase.firestore().collection('products').doc(payload.productId).update({imageUrl: newImageUrl})
            })
          .then(() => {
            commit('LOADING', false)
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            commit('LOADING', false)
          })
      },
    deleteProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.firestore().collection('products').doc(payload).delete()
          .then(() => {
            return firebase.storage().ref('products/' + payload + '/main').delete()
              .then(() => {
                return firebase.storage().ref('products/' + payload + '/card_main').delete()
                  .then(() => {
                    return firebase.storage().ref('products/' + payload + '/thumb_main').delete()
                  })
              })
          })
          .then(() => {
            console.log('Product was removed')
            commit('LOADING', false)
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    products:
      state => {
        return state.products
      },
    lastVisibleId:
      state => {
        return state.lastVisibleId
      },
    isAllLoaded:
      state => {
        return state.isAllLoaded
      },
    productById:
      state => (productId) => {
        return state.products.find(p => {
          return p.productId === productId
        })
      }
  }
}

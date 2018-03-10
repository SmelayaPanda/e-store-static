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
        if (payload.brand) {
          query = query.where('brand', '==', payload.brand)
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
        firebase.firestore().collection('products').add(payload)
          .then(data => {
            productId = data.id
            let updateData = {
              productId: productId,
              // For quick access in admin table.
              // Cloud function fill up it!
              img_0: {original: '', thumbnail: '', card: ''},
              img_1: {original: '', thumbnail: '', card: ''},
              img_2: {original: '', thumbnail: '', card: ''},
              img_3: {original: '', thumbnail: '', card: ''},
              img_4: {original: '', thumbnail: '', card: ''}
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
            console.log('Product edited')
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
        let images = payload.images
        delete payload.images
        let uploadImage = function (name, image) {
          return firebase.storage().ref('products/' + payload.productId + '/' + name).put(image)
        }
        let actions = []
        for (let img in images) {
          actions.push(uploadImage(img, images[img]))
        }
        console.log(actions)
        return Promise.all(actions)
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
            let product = getters.productById(payload)
            let images = [] // images names
            for (let i = 0; i < 5; i++) {
              if (product['img_' + i].original !== '') {
                images.push('img_' + i)
                images.push('card_img_' + i)
                images.push('thumb_img_' + i)
              }
            }
            let deleteImage = function (name) {
              return firebase.storage().ref('products/' + payload + '/' + name).delete()
            }
            let actions = images.map(deleteImage)
            return Promise.all(actions)
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

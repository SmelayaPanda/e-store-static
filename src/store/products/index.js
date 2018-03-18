import * as firebase from 'firebase'
import 'firebase/firestore'
import algoliasearch from 'algoliasearch'

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
        commit('LOADING', true)
        let query = firebase.firestore().collection('products')
        if (payload.maxPrice) {
          query = query
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        }
        if (payload.group) {
          query = query.where('group', '==', payload.group)
        }
        if (payload.category) {
          query = query.where('category', '==', payload.category)
        }
        if (payload.brand) {
          query = query.where('brand', '==', payload.brand)
        }
        if (payload.color) {
          query = query.where('color', '==', payload.color)
        }
        query = query.orderBy('price', payload.sortAsc ? 'asc' : 'desc')
        if (getters.lastVisibleId) {
          query = query.startAfter(getters.lastVisibleId)
        }
        if (payload.limit) { // Shop case
          query = query.limit(payload.limit)
        }

        query.get()
          .then((snapshot) => {
            let products = payload.loadMore ? getters.products : []
            // Shop case
            if (!getters.isAllLoaded && payload.limit) {
              if (snapshot.size < payload.limit) {
                commit('isAllLoaded', true)
              }
              snapshot.docs.forEach(doc => {
                products.push(doc.data())
              })
              let lastVisible = snapshot.docs[snapshot.docs.length - 1]
              commit('setLastVisible', lastVisible)
            } else { // Admin case - show all
              snapshot.docs.forEach(doc => {
                products.push(doc.data())
              })
            }
            commit('setProducts', products)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    algoliaSearch:
      ({commit, dispatch}, payload) => {
        const ALGOLIA_APP_ID = '2CVO44WQ94'
        const ALGOLIA_SEARCH_KEY = '68d8a98b0c136d3dbd0a799949007e8d'
        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
        const index = client.initIndex('e_store_products')
        // Search query
        const query = payload

        // Perform an Algolia search:
        // https://www.algolia.com/doc/api-reference/api-methods/search/
        index
          .search({
            query
          })
          .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            // console.log(responses.hits)
            let products = []
            let getProduct = function (productId) {
              return firebase.firestore().collection('products').doc(productId).get()
                .then(snapshot => {
                  // console.log(snapshot.data())
                  products.push(snapshot.data())
                })
            }
            let actions = []
            let resp = responses.hits
            for (let product in resp) {
              // console.log(resp[product].objectID)
              actions.push(getProduct(resp[product].objectID))
            }
            Promise.all(actions)
              .then(() => {
                // console.log('All fetcheD!')
                commit('setProducts', products)
              })
              .catch(err => {
                console.log(err)
              })
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
            window.location.reload() // TODO: ?
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
            window.location.reload() // TODO: ?
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

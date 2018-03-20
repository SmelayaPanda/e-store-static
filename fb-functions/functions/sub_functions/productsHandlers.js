const productHandlers = require('algoliasearch');
// DON'T FORGET SEE WHAT PRODUCT UPDATED AFTER CREATION!

exports.updateProductHandler = function (event, functions, admin) {
  console.log('>-------------------------------------------------------------------------------------------------------');
  return Promise.all([
    handleMaxPrice(event, admin, 'update'),
    updateAlgoliaIndex(functions, event, 'update')
  ])
    .then(val => {
      return val
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteProductHandler = function (event, functions, admin) {
  console.log('>-------------------------------------------------------------------------------------------------------');
  return Promise.all([
    handleMaxPrice(event, admin, 'delete'),
    updateAlgoliaIndex(functions, event, 'delete')
  ])
    .then(val => {
      return val
    })
    .catch(err => {
      console.log(err)
    })
}


// App ID and API Key are stored in functions config variables
// firebase functions:config:set algolia.app_id="<YOUR-ALGOLIA-APP-ID>"
// firebase functions:config:set algolia.api_key="<YOUR-ALGOLIA-APP-PUBLIC-KEY>"
let updateAlgoliaIndex = function (functions, event, operation) {
  return new Promise((resolve, reject) => {
    const ALGOLIA_INDEX_NAME = 'e_store_products';
    const ALGOLIA_ID = functions.config().algolia.app_id;
    const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
    const client = productHandlers(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    if (operation === 'update') {
      // Get the product document
      console.log(event.data.data())
      let product = {}
      product.objectID = event.params.productId;
      product.title = event.data.data().title
      product.description = event.data.data().description
      product.group = event.data.data().group
      product.brand = event.data.data().brand
      product.category = event.data.data().category
      product.color = event.data.data().color
      product.SKU = event.data.data().SKU
      // Write to the algolia index
      return index.saveObject(product, (err) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Algolia: Object ${event.params.productId} updated!`)
          resolve()
        }
      });
    } else { // delete operation
      return index.deleteObject(event.params.productId, (err) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Algolia: Object ${event.params.productId} deleted!`)
          resolve()
        }
      });
    }
  })
}

function handleMaxPrice(event, admin, operation) {
  const product = event.data.data();
  let oldMaxPrice;
  let newMaxPrice = 0;

  admin.firestore().collection('statistics').doc('products').get()
    .then(snapshot => {
      oldMaxPrice = snapshot.data().maxPrice;
      if (operation === 'update') {
        return admin.firestore().collection('products').doc(product.productId).get()
      } else { // delete operation
        return admin.firestore().collection('products').get()
      }
    })
    .then(snapshot => {
      if (operation === 'update') {
        newMaxPrice = snapshot.data().price
      } else { // delete operation
        snapshot.docs.forEach(doc => {
          if (doc.data().price > newMaxPrice) {
            newMaxPrice = doc.data().price
          }
        })
      }
      if (Number(oldMaxPrice) > Number(newMaxPrice) && operation === 'update') {
        console.log('Statistics: old max price greater!')
        return true
      } else {
        console.log(`Statistics: new maxPrice of products - ${newMaxPrice}!`);
        return admin.firestore().collection('statistics').doc('products').update({maxPrice: newMaxPrice})
      }
    })
    .catch(err => {
      console.log(err)
    })
}

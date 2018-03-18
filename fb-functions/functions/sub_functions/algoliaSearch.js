const algoliasearch = require('algoliasearch');
// App ID and API Key are stored in functions config variables
// firebase functions:config:set algolia.app_id="<YOUR-ALGOLIA-APP-ID>"
// firebase functions:config:set algolia.api_key="<YOUR-ALGOLIA-APP-PUBLIC-KEY>"


exports.updateProductHandler = function (event, functions) {
  console.log('>-------------------------------------------------------------------------------------------------------');
// DON'T FORGET SEE WHAT PRODUCT UPDATED AFTER CREATION!
  const ALGOLIA_INDEX_NAME = 'e_store_products';
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  // Get the product document
  // const product = event.data.data();
  console.log(event.data.data())
  let product = {}
  product.title = event.data.data().title
  product.description = event.data.data().description
  product.group = event.data.data().group
  product.brand = event.data.data().brand
  product.category = event.data.data().category
  product.color = event.data.data().color
  product.SKU = event.data.data().SKU
  // Write to the algolia index
  product.objectID = event.params.productId;
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(product, (err) => {
    if (!err) {
      console.log(`Object ${event.params.productId} updated`);
      return true;
    } else {
      console.log(err);
      return false;
    }
  });
}

exports.deleteProductHandler = function (event, functions) {
  console.log('>-------------------------------------------------------------------------------------------------------');
  const ALGOLIA_INDEX_NAME = 'e_store_products';
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.deleteObject(event.params.productId, (err) => {
    if (!err) {
      console.log(`Object ${event.params.productId} deleted`);
      return true;
    } else {
      console.log(err);
      return false;
    }
  });
}

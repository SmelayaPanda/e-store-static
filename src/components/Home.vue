<template>
  <div class="hello">
    <h1>Hello</h1>
    <el-checkbox v-model="checked">Option</el-checkbox>
    <el-button @click="getFBData">getFBData</el-button>
    {{ msg }}
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      checked: true
    }
  },
  methods: {
    getFBData: function () {
      firebase.database().ref('books').once('value')
        .then(data => {
          this.msg = data.val()
        })
        .catch(err => {
          this.msg = err
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

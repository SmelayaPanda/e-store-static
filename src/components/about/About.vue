<template>
  <!--Cashed version-->
  <div>
    <el-row type="flex" justify="center">
      <el-col :xs="22" :sm="18" :md="16" :lg="14" :xl="12" type="flex" align="middle">
        <h1>Hello from info</h1>
        <p v-once>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aut eveniet, impedit provident quised ut.
          Adipisci aspernatur cupiditate distinctio, esse facere fuga harum, illum laboriosam molestiae quam reiciendis,
          totam!</p>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="18" :md="16" :lg="14" :xl="12" type="flex" align="middle">
        <reviews></reviews>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Reviews from './Reviews'
export default {
  name: 'info',
  components: {
    Reviews
  }
}
</script>

<style scoped>

</style>

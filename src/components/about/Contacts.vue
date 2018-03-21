<template>
  <el-card class="mb-4">
    <h2>About our company</h2>
    <p>More than studio</p>
    <el-row>
      <el-col :xs="22" :sm="12" :md="12" :lg="12" :xl="12" class="pl-2 pr-2">
        <h3>Who we are?</h3>
        <p v-once>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aut eveniet, impedit provident quised ut.
          Adipisci aspernatur cupiditate distinctio, esse facere fuga harum, illum laboriosam molestiae quam reiciendis,
          totam!
        </p>
      </el-col>
      <el-col :xs="22" :sm="12" :md="12" :lg="12" :xl="12" class="pl-2 pr-2">
        <h3>Address:</h3>
        <p> Novosibirsk, Sirenevaya 31, ap. 65</p>
        <h3>Contacts:</h3>
        <p>
          SmelayaPandaGM@gmail.com <br>
          8 999 467 78 57
        </p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'Contacts'
}
</script>

<style scoped>

</style>

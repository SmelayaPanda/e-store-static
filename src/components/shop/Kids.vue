<template>
  <div>
    <el-row el-row type="flex" justify="center">
      <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
        <h3>Kids</h3>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor dolorem eligendi et fugiat libero nisi porro
        possimus quas tempora tempore! Assumenda beatae consequatur itaque molestias non omnis placeat sapiente
        voluptate?
        <!---->
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
                  v-for="o in 9" :key="o">
            <el-card :body-style="{ padding: '0px' }" style="margin: 10px">
              <img src="@/assets/placeholders/child_placeholder.png" class="image" height="300px" style="opacity: 0.8">
              <div style="padding: 14px;">
                <span>Yummy hamburger</span>
                <div class="bottom clearfix">
                  <time class="time">$37</time>
                  <el-button type="text" class="button">Operating button</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Kids'
}
</script>

<style scoped>

</style>

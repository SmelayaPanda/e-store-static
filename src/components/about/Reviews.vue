<!--
REVIEW STATUSES:
1. new
2. published
3. archive
-->
<template>
<div>
  {{reviews}}
  <el-carousel :interval="4000" type="card" height="410px">
    <el-carousel-item v-for="item in 6" :key="item">
      <el-card class="review_card">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col :span="24">
              <img src="@/assets/icons/anonymous-logo.png" height="40px">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span>Anonymous</span>
            </el-col>
          </el-row>
        </div>
        <el-col :span="22">
        </el-col>
        <el-col :span="24">
          <!--300 symbols-->
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aperiam corporis, dolore eaque eos iure laboriosam magni, modi necessitatibus nemo nesciunt nostrum numquam pariatur quaerat quas quibusdam ullam, ut vero.</p>
          <p class="info--text right">Date: 23: 12: 53</p>
        </el-col>
      </el-card>
    </el-carousel-item>
  </el-carousel>
  <!--ADD REVIEW-->
  <el-button type="text" @click="addReviewDialog = true">
    Add review
  </el-button>
  <el-dialog
    title="Add review!"
    :visible.sync="addReviewDialog"
    width="500px"
    center
  >
    <h3 class="info--text">Add review!</h3>
    <el-input v-model="review.name" placeholder="Name" class="mb-2 mt-2"></el-input>
    <el-input v-model="review.text"
              type="textarea"
              placeholder="Review (max 300 symbols)"
              :autosize="{ minRows: 3, maxRows: 7}"
              :maxlength="300"
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addReview" class="mt-3" type="primary" :disabled="!isValidForm">Add</el-button>
      <el-button @click="addReviewDialog = false" class="mt-3">Cancel</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'Reviews',
  data () {
    return {
      addReviewDialog: false,
      review: {
        name: '',
        text: '',
        status: 'new',
        data: new Date(),
        image: null
      }
    }
  },
  methods: {
    addReview () {
      this.addReviewDialog = false
      this.$store.dispatch('addReview', this.review)
    }
  },
  computed: {
    reviews () {
      return this.$store.getters.reviews
    },
    isValidForm () {
      return this.review.name && this.review.text
    }
  }
}
</script>

<style scoped>
  .review_card {
    padding: 10px;
    margin: 5px;
    height: 400px;
  }
</style>

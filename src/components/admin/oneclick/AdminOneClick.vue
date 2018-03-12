<template>
  <!--STATUS:
1. created
2. processed
3. refusal
4. sent
5. delivered
6. returned
-->
  <div v-if="oneClick">
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row type="flex" justify="start" align="middle" class="mb-4">
        <h2 class="ml-3 mr-2">Status</h2>
        <el-select filterable
                   no-match-text="Status is missing"
                   v-model="status"
                   placeholder="Brand"
                   @change="loadStatusOneClick"
        >
          <el-option
            v-for="val in statuses"
            :key="val"
            :label="val"
            :value="val">
          </el-option>
        </el-select>
      </el-row>
      <el-table
        ref="categoryTable"
        :data="oneClick"
        :highlight-current-row="true"
        empty-text="No data"
        style="width: 100vw; text-align: left"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col :span="12">
                <p><span>Database One Click id:</span>
                  <el-tag size="mini" type="success">{{ props.row.id }}</el-tag>
                <h3>Product info:</h3>
                <p>
                  Title: {{ props.row.product.title }}<br>
                  Vendor Code: {{ props.row.product.vendorCode }}<br>
                  Price: {{ props.row.product.price }}<br>
                  <span v-if="props.row.product.qty">Quantity: {{ props.row.product.qty }}</span>
                </p>
                <span v-if="props.row.comments">
                <h3>Comments:</h3>
                {{ props.row.comments }}<br>
              </span>
              </el-col>
              <el-col :span="12">
              <span v-if="props.row.shipping">
                <h3>Shipping info:</h3>
                <p>
                  City: {{ props.row.shipping.city }}<br>
                  Street: {{ props.row.shipping.street }}<br>
                  Build: {{ props.row.shipping.build }}<br>
                  House: {{ props.row.shipping.house }}<br>
                </p>
              </span>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <h3 class="mt-3">Status history:</h3>
                <span>
                  <el-tag type="info">Created
                    <p>
                      {{ props.row.creationDate | date }}<br>
                      <span v-if="props.row.processDate || props.row.refusalDate">
                        ------------------------------
                      </span>
                    </p>
                  </el-tag>
                </span>
                <!--PROCESS-->
                <span v-if="props.row.processDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Processed
                      <p>
                        {{ props.row.processDate | date }}<br>
                        {{(Math.abs(props.row.processDate - props.row.creationDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--REFUSAL-->
                <span v-if="props.row.refusalDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Refusal
                      <p>
                        {{ props.row.refusalDate | date }}<br>
                        {{(Math.abs(props.row.refusalDate - props.row.processDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--SENT-->
                <span v-if="props.row.sentDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Sent
                      <p>
                        {{ props.row.sentDate | date }}<br>
                        {{(Math.abs(props.row.sentDate - props.row.processDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--DELIVERED-->
                <span v-if="props.row.deliveredDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Delivered
                      <p>
                        {{ props.row.deliveredDate | date }}<br>
                        {{(Math.abs(props.row.deliveredDate - props.row.sentDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--RETURNED-->
                <span v-if="props.row.returnedDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Returned
                      <p>
                        {{ props.row.returnedDate | date }}<br>
                        {{(Math.abs(props.row.returnedDate - props.row.deliveredDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--CREATION DATE-->
        <el-table-column
          label="Date"
          width="200">
          <template slot-scope="scope">
            <span><el-tag type="success">{{ scope.row.creationDate | date }}</el-tag></span>
          </template>
        </el-table-column>
        <!--Title-->
        <el-table-column
          label="Title"
          width="300">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>Title: {{ scope.row.product.title }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.product.title | snippet(40) }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!--NICKNAME-->
        <el-table-column
          label="Nickname"
          width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.nickname || snippet(20) }}</p>
          </template>
        </el-table-column>
        <!--PHONE-->
        <el-table-column
          label="Phone"
          width="140">
          <template slot-scope="scope">
            <p>{{ scope.row.phone }}</p>
          </template>
        </el-table-column>
        <!--EMAIL-->
        <el-table-column
          label="Email"
          width="200">
          <template slot-scope="scope">
            <p>{{ scope.row.email }}</p>
          </template>
        </el-table-column>
        <!--Process-->
        <el-table-column
          width="80"
          label="Process">
          <template slot-scope="scope">
            <el-row type="flex" justify="center">
              <process-one-click :oneClickId="scope.row.id"></process-one-click>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ProcessOneClick from './crud/ProcessOneClick'

export default {
  components: {
    ProcessOneClick
  },
  name: 'AdminOneClick',
  data () {
    return {
      status: 'created',
      statuses: ['created', 'processed', 'refusal', 'sent', 'delivered', 'returned']
    }
  },
  methods: {
    loadStatusOneClick () {
      this.$store.dispatch('fetchOneClick', this.status)
    }
  },
  computed: {
    oneClick () {
      return this.$store.getters.oneClick
    }
  }
}
</script>

<style scoped>
</style>

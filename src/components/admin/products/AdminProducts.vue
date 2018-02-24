<template>
  <div>
    <h1 class="mb-2">All products</h1>
    <add-product></add-product>
    <el-table
      :data="tableData"
      style="width: 90vw; text-align: left"
    >
      <!--ID-->
      <el-table-column
        label="id"
        width="40">
        <template slot-scope="scope">
          <span style="margin-left: 2px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!--DESCRIPTION-->
      <el-table-column
        label="Title"
        width="240">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Title: {{ scope.row.title }}</p>
            <p>Description: {{ scope.row.description }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title | snippet(40) }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--Priority-->
      <el-table-column
        label="Priority"
        width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <!--PRICE-->
      <el-table-column
        label="Price"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.price }} {{ scope.row.currency }}</span>
        </template>
      </el-table-column>
      <!--QUANTITY-->
      <el-table-column
        label="Quantity"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.qty }}</span>
        </template>
      </el-table-column>
      <!--COLORS-->
      <el-table-column
        label="Color"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>
      <!--SIZE-->
      <el-table-column
        label="Size"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <!--WEIGHT-->
      <el-table-column
        label="Weight"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }} {{ scope.row.weightMeasure }}</span>
        </template>
      </el-table-column>
      <!--DATE-->
      <el-table-column
        label="Date"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <!--EDIT/DELETE-->
      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">Edit
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddProduct from './crud/AddProduct'

export default {
  components: {
    AddProduct
  },
  name: 'AdminProducts',
  data () {
    return {
      tableData: [{
        id: 1,
        title: 'Product firs and first and biggest',
        description: 'Awesome product, firs place',
        priority: 1,
        currency: 'RUR',
        price: '1500',
        qty: 10,
        color: 'green',
        size: 'big',
        weight: '0.1',
        weightMeasure: 'kg',
        date: '2016-05-03'
      }, {
        id: 2,
        title: 'Product second eah',
        description: 'Awesome product, firs place',
        priority: 2,
        currency: 'RUR',
        price: '9000',
        qty: 7,
        color: 'red',
        size: 'small',
        weight: '0.3',
        weightMeasure: 'kg',
        date: '2016-05-03'
      }, {
        id: 3,
        title: 'Product 3',
        description: 'Awesome product, firs place',
        priority: 3,
        currency: 'RUR',
        price: '1200',
        qty: 167,
        color: ['blue', 'red', 'yellow'],
        size: 'big',
        weight: '0.5',
        weightMeasure: 'gr',
        date: '2016-05-03'
      }, {
        id: 22,
        title: 'Product 4',
        description: 'Awesome product, firs place',
        priority: 4,
        currency: 'RUR',
        price: '150',
        qty: 10,
        color: 'green',
        size: 'large',
        weight: '3.1',
        weightMeasure: 'mg',
        date: '2016-05-03'
      }]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    addNewProduct () {
    }
  }
}
</script>

<style scoped>

</style>

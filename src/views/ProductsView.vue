<template>
  <div>
    <NavBar />
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <ProductForm @product-added="fetchProducts" />
        </div>
        <div class="col-md-6">
          <ProductList :products="products" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import ProductForm from '@/components/ProductForm.vue'
import ProductList from '@/components/ProductList.vue'
import api from '@/services/api'

export default {
  components: {
    NavBar,
    ProductForm,
    ProductList
  },
  data() {
    return {
      products: []
    }
  },
  created() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.get('/products')
        this.products = response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
  }
}
</script>

<style>
.container {
  max-width: 1200px;
}
</style>
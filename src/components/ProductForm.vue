<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h3 class="card-title">
          <i class="fas fa-plus-circle me-2"></i>Register Product
        </h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="name" class="form-label">Product Name</label>
            <input type="text" class="form-control" id="name" v-model="product.name" 
                   :class="{ 'is-invalid': errors.name }">
            <div v-if="errors.name" class="invalid-feedback">
              {{ errors.name[0] }}
            </div>
          </div>
          
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" rows="3" 
                      v-model="product.description" :class="{ 'is-invalid': errors.description }"></textarea>
            <div v-if="errors.description" class="invalid-feedback">
              {{ errors.description[0] }}
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="price" class="form-label">Price</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input type="number" step="0.01" class="form-control" id="price" 
                       v-model="product.price" :class="{ 'is-invalid': errors.price }">
                <div v-if="errors.price" class="invalid-feedback">
                  {{ errors.price[0] }}
                </div>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="quantity" class="form-label">Quantity</label>
              <input type="number" class="form-control" id="quantity" 
                     v-model="product.quantity" :class="{ 'is-invalid': errors.quantity }">
              <div v-if="errors.quantity" class="invalid-feedback">
                {{ errors.quantity[0] }}
              </div>
            </div>
          </div>
          
          <div class="d-grid gap-2">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              <i v-else class="fas fa-save me-1"></i>
              {{ loading ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    async submitForm() {
      this.loading = true
      this.errors = {}
      
      try {
        const response = await api.post('/products', this.product)
        this.$emit('product-added', response.data.data)
        this.product = {
          name: '',
          description: '',
          price: 0,
          quantity: 0
        }
        this.$toast.success('Product registered successfully!')
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error('Error saving product. Please try again.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.card-header {
  border-radius: 10px 10px 0 0 !important;
}
</style>
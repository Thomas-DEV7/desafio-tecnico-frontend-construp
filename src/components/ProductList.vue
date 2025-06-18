<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h3 class="card-title">
          <i class="fas fa-list me-2"></i>Product List
        </h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description || 'N/A' }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>{{ product.quantity }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  No products found. Register a new product to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
}
</style>
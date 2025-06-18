<template>
  <div class="container mt-4">
    <!-- Edit Modal -->
    <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="editProductModalLabel">
              <i class="fas fa-edit me-2"></i>Edit Product
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="editName" class="form-label">Name</label>
                  <input v-model="form.name" type="text" class="form-control" id="editName" required>
                  <div v-if="errors.name" class="invalid-feedback d-block">
                    {{ errors.name[0] }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="editPrice" class="form-label">Price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model="form.price" type="number" step="0.01" class="form-control" id="editPrice" required>
                  </div>
                  <div v-if="errors.price" class="invalid-feedback d-block">
                    {{ errors.price[0] }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="editDescription" class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control" id="editDescription" rows="3"></textarea>
                <div v-if="errors.description" class="invalid-feedback d-block">
                  {{ errors.description[0] }}
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="editQuantity" class="form-label">Quantity</label>
                  <input v-model="form.quantity" type="number" class="form-control" id="editQuantity" required>
                  <div v-if="errors.quantity" class="invalid-feedback d-block">
                    {{ errors.quantity[0] }}
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-1"></i>Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <template v-if="isSubmitting">
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Saving...
                  </template>
                  <template v-else>
                    <i class="fas fa-save me-1"></i>Save
                  </template>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteProductModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle me-2"></i>Confirm Deletion
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete product <strong>{{ productToDelete?.name }}</strong>?</p>
            <p class="text-muted">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
              <template v-if="isDeleting">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Deleting...
              </template>
              <template v-else>
                <i class="fas fa-trash-alt me-1"></i>Delete
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products List -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 class="mb-0">
          <i class="fas fa-boxes me-2"></i>Products List
        </h3>
        <button class="btn btn-light btn-sm" @click="refreshProducts">
          <i class="fas fa-sync-alt me-1"></i>Refresh
        </button>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading products...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No products found</h5>
          <p class="text-muted">Click "Add Product" button to get started</p>
        </div>

        <!-- Products Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th class="text-end">Price</th>
                <th class="text-center">Stock</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <span class="fw-semibold">{{ product.name }}</span>
                </td>
                <td>
                  <span class="text-muted small">{{ product.description || 'No description' }}</span>
                </td>
                <td class="text-end">
                  {{ formatCurrency(product.price) }}
                </td>
                <td class="text-center">
                  <span :class="{
                    'badge bg-success': product.quantity > 10,
                    'badge bg-warning': product.quantity > 0 && product.quantity <= 10,
                    'badge bg-danger': product.quantity === 0
                  }">
                    {{ product.quantity }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm" role="group">
                    <button @click="openEditModal(product)" class="btn btn-outline-primary" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="openDeleteModal(product)" class="btn btn-outline-danger" title="Delete">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="pagination.last_page > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <button class="page-link" @click="fetchProducts(pagination.current_page - 1)">
                  &laquo; Previous
                </button>
              </li>

              <li v-for="page in pagination.last_page" :key="page" class="page-item"
                :class="{ active: pagination.current_page === page }">
                <button class="page-link" @click="fetchProducts(page)">
                  {{ page }}
                </button>
              </li>

              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                <button class="page-link" @click="fetchProducts(pagination.current_page + 1)">
                  Next &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="card-footer bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} products
          </small>
          <button class="btn btn-primary btn-sm" @click="$emit('open-create-modal')">
            <i class="fas fa-plus-circle me-1"></i>Add Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import api from '@/services/api'

export default {
  name: 'ProductList',
  props: {
    initialProducts: {
      type: Array,
      default: () => []
    },
    initialPagination: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      products: this.initialProducts,
      pagination: this.initialPagination,
      isLoading: false,
      isSubmitting: false,
      isDeleting: false,
      productToDelete: null,
      form: {
        id: null,
        name: '',
        description: '',
        price: 0,
        quantity: 0
      },
      errors: {},
      editModal: null,
      deleteModal: null
    }
  },
  mounted() {
    this.editModal = new Modal(document.getElementById('editProductModal'))
    this.deleteModal = new Modal(document.getElementById('deleteProductModal'))
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    },
    openEditModal(product) {
      this.form = { ...product }
      this.errors = {}
      this.editModal.show()
    },
    openDeleteModal(product) {
      this.productToDelete = { ...product }
      this.deleteModal.show()
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.errors = {}

      try {
        const response = await api.put(`/products/${this.form.id}`, this.form)
        this.$emit('product-updated', response.data.data)
        this.editModal.hide()
        await this.fetchProducts(this.pagination.current_page);

        this.$toast.success('Product updated successfully!')
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error('Error updating product. Please try again.')
          console.error('Update error:', error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async confirmDelete() {
      this.isDeleting = true

      try {
        await api.delete(`/products/${this.productToDelete.id}`)
        this.$emit('product-deleted', this.productToDelete.id)
        this.deleteModal.hide()
        await this.fetchProducts(this.pagination.current_page);

        this.$toast.success('Product deleted successfully!')
      } catch (error) {
        this.$toast.error('Error deleting product. Please try again.')
        console.error('Delete error:', error)
      } finally {
        this.isDeleting = false
      }
    },
    async refreshProducts() {
      await this.fetchProducts(this.pagination.current_page)
    },
    async fetchProducts(page = 1) {
      this.isLoading = true
      try {
        const response = await api.get('/products', {
          params: {
            page,
            per_page: this.itemsPerPage
          }
        })

        this.products = response.data.data
        this.pagination = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: response.data.meta.from,
          to: response.data.meta.to,
          total: response.data.meta.total,
          per_page: response.data.meta.per_page
        }
      } catch (error) {
        this.$toast.error('Error loading products')
        console.error('Fetch error:', error)
      } finally {
        this.isLoading = false
      }
    }
  },
  watch: {
    initialProducts(newVal) {
      this.products = newVal
    },
    initialPagination(newVal) {
      this.pagination = newVal
    }
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  white-space: nowrap;
}

.badge {
  min-width: 40px;
  padding: 0.35em 0.5em;
}

.modal-header {
  padding: 1rem 1.5rem;
}

.modal-footer {
  padding: 0.75rem 1.5rem;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-link {
  color: #0d6efd;
}

.card-header {
  padding: 0.75rem 1.25rem;
}

.card-footer {
  padding: 0.75rem 1.25rem;
}
</style>
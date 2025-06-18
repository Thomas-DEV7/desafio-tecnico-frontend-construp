<template>
  <div class="container mt-4">
    <!-- Modal de Edição -->
    <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="editProductModalLabel">
              <i class="fas fa-edit me-2"></i>Editar Produto
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="editName" class="form-label">Nome</label>
                  <input v-model="form.name" type="text" class="form-control" id="editName" required>
                  <div v-if="errors.name" class="invalid-feedback d-block">
                    {{ errors.name[0] }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="editPrice" class="form-label">Preço</label>
                  <div class="input-group">
                    <span class="input-group-text">R$</span>
                    <input v-model="form.price" type="number" step="0.01" class="form-control" id="editPrice" required>
                  </div>
                  <div v-if="errors.price" class="invalid-feedback d-block">
                    {{ errors.price[0] }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="editDescription" class="form-label">Descrição</label>
                <textarea v-model="form.description" class="form-control" id="editDescription" rows="3"></textarea>
                <div v-if="errors.description" class="invalid-feedback d-block">
                  {{ errors.description[0] }}
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="editQuantity" class="form-label">Quantidade</label>
                  <input v-model="form.quantity" type="number" class="form-control" id="editQuantity" required>
                  <div v-if="errors.quantity" class="invalid-feedback d-block">
                    {{ errors.quantity[0] }}
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-1"></i>Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <template v-if="isSubmitting">
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Salvando...
                  </template>
                  <template v-else>
                    <i class="fas fa-save me-1"></i>Salvar
                  </template>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div class="modal fade" id="deleteProductModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle me-2"></i>Confirmar Exclusão
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o produto <strong>{{ productToDelete?.name }}</strong>?</p>
            <p class="text-muted">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
              <template v-if="isDeleting">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Excluindo...
              </template>
              <template v-else>
                <i class="fas fa-trash-alt me-1"></i>Excluir
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Produtos -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 class="mb-0">
          <i class="fas fa-boxes me-2"></i>Lista de Produtos
        </h3>
        <button class="btn btn-light btn-sm" @click="refreshProducts">
          <i class="fas fa-sync-alt me-1"></i>Atualizar
        </button>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-2">Carregando produtos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Nenhum produto encontrado</h5>
          <p class="text-muted">Clique no botão "Adicionar Produto" para começar</p>
        </div>

        <!-- Products Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th class="text-end">Preço</th>
                <th class="text-center">Estoque</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <span class="fw-semibold">{{ product.name }}</span>
                </td>
                <td>
                  <span class="text-muted small">{{ product.description || 'Sem descrição' }}</span>
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
                    <button @click="openEditModal(product)" class="btn btn-outline-primary" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="openDeleteModal(product)" class="btn btn-outline-danger" title="Excluir">
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
                  &laquo; Anterior
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
                  Próxima &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="card-footer bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} produtos
          </small>
          <button class="btn btn-primary btn-sm" @click="$emit('open-create-modal')">
            <i class="fas fa-plus-circle me-1"></i>Adicionar Produto
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
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
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

        this.$toast.success('Produto atualizado com sucesso!')
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error('Erro ao atualizar produto. Tente novamente.')
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

        this.$toast.success('Produto excluído com sucesso!')
      } catch (error) {
        this.$toast.error('Erro ao excluir produto. Tente novamente.')
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
            per_page: this.itemsPerPage // Opcional: pode ser uma prop ou data property
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
        this.$toast.error('Erro ao carregar produtos')
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
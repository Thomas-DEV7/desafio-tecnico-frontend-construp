<template>
  <div>
    <NavBar />
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-md-12">
          <!-- Modal de Criação -->
          <div class="modal fade" id="createProductModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header bg-success text-white">
                  <h5 class="modal-title">
                    <i class="fas fa-plus-circle me-2"></i>Novo Produto
                  </h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ProductForm 
                    @product-created="handleProductCreated"
                    @cancel="closeCreateModal"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Produtos -->
          <ProductList
            ref="productList"
            :initial-products="products.data"
            :initial-pagination="products.meta"
            @product-updated="handleProductUpdated"
            @product-deleted="handleProductDeleted"
            @open-create-modal="openCreateModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar.vue'
import ProductList from '@/components/ProductList.vue'
import ProductForm from '@/components/ProductForm.vue'
import api from '@/services/api'

export default {
  name: 'ProductsView',
  components: {
    NavBar,
    ProductList,
    ProductForm
  },
  data() {
    return {
      products: {
        data: [],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: 10,
          to: 1,
          total: 0
        }
      },
      createModal: null,
      isLoading: false
    }
  },
  mounted() {
    this.createModal = new Modal(document.getElementById('createProductModal'))
    this.fetchProducts()
  },
  methods: {
    async fetchProducts(page = 1) {
      this.isLoading = true
      try {
        const response = await api.get('/products', {
          params: { page }
        })
        this.products = {
          data: response.data.data,
          meta: {
            current_page: response.data.current_page,
            from: response.data.from,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            to: response.data.to,
            total: response.data.total
          }
        }
      } catch (error) {
        this.$toast.error('Erro ao carregar produtos')
        console.error('Error fetching products:', error)
      } finally {
        this.isLoading = false
      }
    },
    openCreateModal() {
      this.createModal.show()
    },
    closeCreateModal() {
      this.createModal.hide()
    },
    async handleProductCreated(newProduct) {
      this.createModal.hide()
      this.$toast.success('Produto criado com sucesso!')
      
      // Se estiver na primeira página, recarrega os dados
      if (this.products.meta.current_page === 1) {
        await this.fetchProducts(1)
      } else {
        // Se não, vai para a primeira página
        this.$refs.productList.fetchProducts(1)
      }
    },
    handleProductUpdated(updatedProduct) {
      const index = this.products.data.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        this.products.data.splice(index, 1, updatedProduct)
      }
    },
    handleProductDeleted(productId) {
      this.products.data = this.products.data.filter(p => p.id !== productId)
      this.products.meta.total -= 1
      
      // Se a página ficou vazia e não é a primeira, volta uma página
      if (this.products.data.length === 0 && this.products.meta.current_page > 1) {
        this.fetchProducts(this.products.meta.current_page - 1)
      }
    },
    refreshProducts() {
      this.fetchProducts(this.products.meta.current_page)
    }
  }
}
</script>

<style scoped>
.container-fluid {
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 0 1rem;
  }
}
</style>
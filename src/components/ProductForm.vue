<template>
  <form @submit.prevent="submitForm">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="name" class="form-label">Nome *</label>
        <input 
          v-model="form.name" 
          type="text" 
          class="form-control" 
          id="name"
          :class="{ 'is-invalid': errors.name }"
          required
        >
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name[0] }}
        </div>
      </div>
      
      <div class="col-md-6 mb-3">
        <label for="price" class="form-label">Preço *</label>
        <div class="input-group">
          <span class="input-group-text">R$</span>
          <input 
            v-model="form.price" 
            type="number" 
            step="0.01" 
            class="form-control" 
            id="price"
            :class="{ 'is-invalid': errors.price }"
            required
          >
        </div>
        <div v-if="errors.price" class="invalid-feedback">
          {{ errors.price[0] }}
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Descrição</label>
      <textarea 
        v-model="form.description" 
        class="form-control" 
        id="description" 
        rows="3"
        :class="{ 'is-invalid': errors.description }"
      ></textarea>
      <div v-if="errors.description" class="invalid-feedback">
        {{ errors.description[0] }}
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="quantity" class="form-label">Quantidade *</label>
        <input 
          v-model="form.quantity" 
          type="number" 
          class="form-control" 
          id="quantity"
          :class="{ 'is-invalid': errors.quantity }"
          required
        >
        <div v-if="errors.quantity" class="invalid-feedback">
          {{ errors.quantity[0] }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
        <i class="fas fa-times me-1"></i>Cancelar
      </button>
      <button type="submit" class="btn btn-success" :disabled="isSubmitting">
        <template v-if="isSubmitting">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span>
          Salvando...
        </template>
        <template v-else>
          <i class="fas fa-save me-1"></i>Salvar
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'ProductForm',
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      },
      errors: {},
      isSubmitting: false
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true
      this.errors = {}

      try {
        const response = await api.post('/products', this.form)
        this.$emit('product-created', response.data.data)
        this.resetForm()
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error('Erro ao criar produto. Tente novamente.')
          console.error('Create error:', error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      }
    }
  }
}
</script>
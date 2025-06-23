<template>
  <form @submit.prevent="validateForm">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="name" class="form-label">Name *</label>
        <input v-model="form.name" type="text" class="form-control" id="name" :class="{ 'is-invalid': errors.name }"
          @blur="validateField('name')" maxlength="255">
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name }}
        </div>
        <div class="form-text text-muted">
          {{ form.name.length }}/255 characters
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <label for="price" class="form-label">Price *</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input v-model="form.price" type="number" step="0.01" min="0" class="form-control" id="price"
            :class="{ 'is-invalid': errors.price }" @blur="validateField('price')">
        </div>
        <div v-if="errors.price" class="invalid-feedback">
          {{ errors.price }}
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea v-model="form.description" class="form-control" id="description" rows="3"
        :class="{ 'is-invalid': errors.description }" @blur="validateField('description')"></textarea>
      <div v-if="errors.description" class="invalid-feedback">
        {{ errors.description }}
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="quantity" class="form-label">Quantity *</label>
        <input v-model="form.quantity" type="number" min="0" class="form-control" id="quantity"
          :class="{ 'is-invalid': errors.quantity }" @blur="validateField('quantity')">
        <div v-if="errors.quantity" class="invalid-feedback">
          {{ errors.quantity }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
        <i class="fas fa-times me-1"></i>Cancel
      </button>
      <button type="submit" class="btn btn-success" :disabled="isSubmitting">
        <template v-if="isSubmitting">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span>
          Saving...
        </template>
        <template v-else>
          <i class="fas fa-save me-1"></i>Save
        </template>
      </button>
    </div>
  </form>
</template>
<script>
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProductForm',
  setup() {
    const toast = useToast()
    return { toast }
  },
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
    validateField(field) {
      switch (field) {
        case 'name':
          if (!this.form.name.trim()) {
            this.errors.name = 'Name is required';
          } else if (typeof this.form.name !== 'string') {
            this.errors.name = 'Name must be text';
          } else if (this.form.name.length > 255) {
            this.errors.name = 'Name cannot exceed 255 characters';
          } else {
            delete this.errors.name;
          }
          break;

        case 'price':
          if (isNaN(this.form.price) || this.form.price === '') {
            this.errors.price = 'Price is required';
          } else if (Number(this.form.price) < 0) {
            this.errors.price = 'Price cannot be negative';
          } else {
            delete this.errors.price;
          }
          break;

        case 'description':
          if (this.form.description && typeof this.form.description !== 'string') {
            this.errors.description = 'Description must be text';
          } else {
            delete this.errors.description;
          }
          break;

        case 'quantity':
          const quantity = Number(this.form.quantity);
          if (isNaN(quantity) || this.form.quantity === '') {
            this.errors.quantity = 'Quantity is required';
          } else if (!Number.isInteger(quantity)) {
            this.errors.quantity = 'Quantity must be a whole number';
          } else if (quantity < 0) {
            this.errors.quantity = 'Quantity cannot be negative';
          } else {
            delete this.errors.quantity;
          }
          break;
      }
    },

    validateForm() {
      this.validateField('name');
      this.validateField('price');
      this.validateField('description');
      this.validateField('quantity');

      if (Object.keys(this.errors).length === 0) {
        this.submitForm();
      } else {
        this.toast.error('Please fix the form errors before submitting');
      }
    },

    async submitForm() {
      this.isSubmitting = true;
      this.errors = {};

      try {
        const response = await api.post('/products', {
          name: this.form.name,
          description: this.form.description,
          price: Number(this.form.price),
          quantity: parseInt(this.form.quantity)
        });

        this.$emit('product-created', response.data.data);
        this.resetForm();
        this.toast.success('Produto criado com sucesso!');
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          const errorMessage =
            error.response?.data?.message || error.message || 'Erro ao criar produto';
          this.toast.error(' ' + errorMessage);
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.form = {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      };
      this.errors = {};
    }
  }
}
</script>


<style scoped>
.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875em;
}

.is-invalid {
  border-color: #dc3545;
}

.form-text {
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style>